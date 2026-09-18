$files = Get-ChildItem -Path "src" -Recurse -Include *.js, *.vue
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $u = $c
    $u = $u.Replace('"images/', '"/images/')
    $u = $u.Replace("'images/", "'/images/")
    if ($u -ne $c) {
        [System.IO.File]::WriteAllText($f.FullName, $u, (New-Object System.Text.UTF8Encoding($false)))
        "fixed: $($f.Name)"
    }
}
"done"
