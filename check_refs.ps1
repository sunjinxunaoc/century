$all = Get-ChildItem -Recurse -File
$issues = @()
foreach ($f in $all) {
    if ($f.Extension -notin @('.html', '.css', '.js', '.xml', '.txt', '.md')) { continue }
    $c = Get-Content $f.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $c) { continue }
    $m1 = [regex]::Matches($c, '(?:src|href)="([^"]+)"')
    $m2 = [regex]::Matches($c, 'url\(([^)]+)\)')
    $refs = @()
    foreach ($m in $m1) { $refs += $m.Groups[1].Value }
    foreach ($m in $m2) {
        $v = $m.Groups[1].Value.Trim().Trim('"').Trim("'")
        $refs += $v
    }
    foreach ($r in $refs) {
        if ($r -match '^(https?:|data:|mailto:|tel:|#|javascript:)') { continue }
        if ($r -match '^\s*$') { continue }
        $clean = ($r -split '[?#]')[0]
        if ($clean -eq '' -or $clean -eq 'http' -or $clean -eq 'https') { continue }
        if ($clean -match '^[a-z]+:\d') { continue }
        $target = Join-Path $f.DirectoryName $clean
        if (-not (Test-Path -LiteralPath $target)) {
            $issues += "$($f.FullName)  ->  $r"
        }
    }
}
if ($issues.Count -eq 0) { "NO BROKEN REFERENCES" } else { $issues }
