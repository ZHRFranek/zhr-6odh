# Tworzy / aktualizuje skrot ZHR na pulpicie (najnowsza strona).
$ErrorActionPreference = "Stop"

$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Launcher = Join-Path $Root "scripts\launch-zhr.vbs"
$Icon = Join-Path $Root "assets\zhr-liliyka.ico"
if (-not (Test-Path -LiteralPath $Icon)) {
    & (Join-Path $Root "scripts\build-icon.ps1")
}
$Desktop = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $Desktop "ZHR.lnk"
$Wscript = Join-Path $env:SystemRoot "System32\wscript.exe"

if (-not (Test-Path -LiteralPath $Launcher)) { throw "Brak launchera: $Launcher" }
if (-not (Test-Path -LiteralPath $Icon)) { throw "Brak ikony: $Icon" }
if (-not (Test-Path -LiteralPath $Wscript)) { throw "Brak wscript: $Wscript" }

$Wsh = New-Object -ComObject WScript.Shell
$Sc = $Wsh.CreateShortcut($ShortcutPath)
$Sc.TargetPath = $Wscript
$Sc.Arguments = "//nologo `"$Launcher`""
$Sc.WorkingDirectory = $Root
$Sc.IconLocation = "$Icon,0"
$Sc.Description = "ZHR - strona drużyny (Astro, localhost)"
$Sc.WindowStyle = 1
$Sc.Save()

Write-Host "Utworzono skrot: $ShortcutPath"
