# ============================================================
# 一键增量部署脚本（Windows PowerShell 5.1）
# 用法：
#   .\deploy.ps1            # 构建 + 只上传变更文件到服务器
#   .\deploy.ps1 -Full      # 强制全量同步（忽略清单）
#   .\deploy.ps1 -SkipBuild # 跳过本地构建，只同步
# ============================================================
[CmdletBinding()]
param(
  [switch]$Full,
  [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot
Set-Location $root

# ---------- 读取配置 ----------
$configPath = Join-Path $root 'deploy-config.json'
if (-not (Test-Path $configPath)) {
  throw "缺少 deploy-config.json，请复制模板并填写服务器信息。"
}
$cfg = Get-Content $configPath -Raw -Encoding UTF8 | ConvertFrom-Json

# 占位符守卫：host 必须看起来像真实主机/IP，或仍含中文占位文本
$placeholder = $cfg.host -match '[\u4e00-\u9fff]' -or $cfg.host -match '203\.0\.113|your (host|server)|HOST|example\.com|^\s*$' -or $cfg.remote_dir -match '[\u4e00-\u9fff]'
if ($placeholder) {
  Write-Host '⚠️  请先编辑 deploy-config.json，填入 host / user / remote_dir。' -ForegroundColor Yellow
  Write-Host '   （remote_dir 是服务器上网站根目录，例如 /www/wwwroot/centurymanufacture.com）' -ForegroundColor Yellow
  exit 1
}

$hostStr = "$($cfg.user)@$($cfg.host)"
$sshExe = "ssh"
$scpExe = "scp"
$sshArgs = @('-o', 'StrictHostKeyChecking=accept-new', '-o', 'ConnectTimeout=15')
if ($cfg.port -and [int]$cfg.port -ne 22) { $sshArgs += @('-p', [string]$cfg.port) }
if ($cfg.identity_file) { $sshArgs += @('-i', $cfg.identity_file) }

# ---------- 构建 ----------
if (-not $SkipBuild) {
  Write-Host '== [1/4] 构建 dist ...' -ForegroundColor Cyan
  npm run build
  if ($LASTEXITCODE -ne 0) { throw '构建失败，已中止部署。' }
}

$dist = Join-Path $root 'dist'
if (-not (Test-Path $dist)) { throw "未找到 dist 目录（$dist），请先构建。" }

# ---------- 计算变更 ----------
$manifestPath = Join-Path $root 'deploy-manifest.json'
$manifest = @{}
if (-not $Full -and (Test-Path $manifestPath)) {
  $manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
}

Write-Host '== [2/4] 扫描变更文件 ...' -ForegroundColor Cyan
$localFiles = Get-ChildItem $dist -Recurse -File -ErrorAction SilentlyContinue
$localMap = @{}
$toUpload = @()          # 相对路径（正斜杠）
$toDelete = @()          # 远端存在但本地已删的相对路径（正斜杠）

foreach ($f in $localFiles) {
  $rel = $f.FullName.Substring($dist.Length).TrimStart('\','/').Replace('\','/')
  $key = "$(($f.Length))|$($f.LastWriteTime.Ticks)"
  $localMap[$rel] = $true
  if ($Full -or -not $manifest.$rel -or $manifest.$rel -ne $key) {
    $toUpload += $rel
  }
}

if (-not $Full -and $manifest -is [System.Management.Automation.PSCustomObject]) {
  foreach ($p in $manifest.PSObject.Properties) {
    if (-not $localMap[$p.Name]) { $toDelete += $p.Name }
  }
}

Write-Host "  本地文件: $($localFiles.Count)  需上传: $($toUpload.Count)  需删除: $($toDelete.Count)" -ForegroundColor Gray

if ($toUpload.Count -eq 0 -and $toDelete.Count -eq 0) {
  Write-Host '== 没有变化，无需上传。' -ForegroundColor Green
  exit 0
}

# ---------- 远端目录 ----------
$remote = $cfg.remote_dir.TrimEnd('/')
Write-Host '== [3/4] 同步到服务器 ...' -ForegroundColor Cyan

# 3a. 删除远端多余文件
foreach ($rel in $toDelete) {
  $remoteAbs = "$remote/$rel".Replace("'", "'\''")
  & $sshExe @sshArgs $hostStr -- ("rm -f '" + $remoteAbs + "'") 2>$null
}

# 3b. 创建远端目录（一次 ssh 全建，整条远程命令作为单个参数传给远端 shell）
$dirs = $toUpload | ForEach-Object {
  $idx = $_.LastIndexOf('/')
  if ($idx -ge 0) { $_.Substring(0, $idx) } else { '' }
} | Where-Object { $_ } | Sort-Object -Unique
if ($dirs) {
  $mkDirs = ($dirs | ForEach-Object { "mkdir -p `"$remote/$_`"" }) -join ' && '
  & $sshExe @sshArgs $hostStr -- $mkDirs 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) { Write-Host '远端 mkdir 部分失败，请检查路径与权限。' -ForegroundColor Red }
}

# 3c. 按目录分批 scp（一个 scp 传一个目录的所有变更文件）
$groups = $toUpload | Group-Object {
  $idx = $_.LastIndexOf('/')
  if ($idx -ge 0) { $_.Substring(0, $idx) } else { '' }
}
$copied = 0
$failed = $false
foreach ($g in $groups) {
  if ($copied -ge 200) { Write-Host '已上传 200+ 文件，剩余可重跑续传（脚本为增量，重复执行只补剩余）。' -ForegroundColor Yellow; $failed = $true; break }
  $remoteDir = if ($g.Name) { "$remote/$($g.Name)" } else { $remote }
  $srcList = @()
  foreach ($rel in $g.Group) {
    $localAbs = Join-Path $dist ($rel -replace '/', '\')
    $srcList += $localAbs
  }
  & $scpExe @sshArgs @srcList "$hostStr`:$remoteDir" 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Write-Host "上传目录 `"$remoteDir`" 失败（$($g.Group.Count) 个文件）" -ForegroundColor Red
    $failed = $true
  } else {
    $copied += $g.Group.Count
  }
}
Write-Host "  已上传: $copied / $($toUpload.Count)" -ForegroundColor Green

# ---------- 写入清单（仅当全部成功）----------
if ($failed) {
  Write-Host '⚠️  存在上传失败，本次不更新清单；修复后重跑会重试缺失/失败文件。' -ForegroundColor Yellow
  exit 1
}
$newManifest = [ordered]@{}
foreach ($f in $localFiles) {
  $rel = $f.FullName.Substring($dist.Length).TrimStart('\','/').Replace('\','/')
  $newManifest[$rel] = "$(($f.Length))|$($f.LastWriteTime.Ticks)"
}
$newManifest | ConvertTo-Json -Depth 4 | Set-Content $manifestPath -Encoding UTF8

# ---------- 最后校验 ----------
Write-Host '== [4/4] 校验线上 robots.txt ...' -ForegroundColor Cyan
try {
  $lk = $cfg.live_check_url
  $txt = (Invoke-WebRequest -Uri $lk -UseBasicParsing -TimeoutSec 20).Content
  if ($txt -match [regex]::Escape($cfg.expect_remote_robots)) {
    Write-Host '✅ 线上 robots.txt 正常（Allow: /），站点已可抓取。' -ForegroundColor Green
    Write-Host "  校验地址: $lk" -ForegroundColor Gray
  } else {
    Write-Host '⚠️  线上 robots.txt 内容与预期不符，请手动检查（防止误传父目录 Disallow 版本）。' -ForegroundColor Yellow
  }
} catch {
  Write-Host '⚠️  无法在线校验 robots.txt（可能网络受限或尚未生效），请手动确认。' -ForegroundColor Yellow
}

Write-Host ''
Write-Host '部署完成。增量清单已更新，下次只上传变更文件。' -ForegroundColor Green
