# ZHR - uruchamia strone Astro (web/) i otwiera przegladarke.
$ErrorActionPreference = "Stop"

$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$WebDir = Join-Path $Root "web"
$Url = "http://localhost:4321/"
$DevPort = 4321
$CmsPort = 8081

function Test-PortOpen([int]$Port) {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $client.Connect("127.0.0.1", $Port)
        $client.Close()
        return $true
    } catch {
        return $false
    }
}

function Show-Message([string]$Text, [string]$Title = "ZHR", [string]$Icon = "Information") {
    Add-Type -AssemblyName System.Windows.Forms
    $btn = [System.Windows.Forms.MessageBoxButtons]::OK
    $ico = [System.Windows.Forms.MessageBoxIcon]::Information
    switch ($Icon) {
        "Error"   { $ico = [System.Windows.Forms.MessageBoxIcon]::Error }
        "Warning" { $ico = [System.Windows.Forms.MessageBoxIcon]::Warning }
    }
    [System.Windows.Forms.MessageBox]::Show($Text, $Title, $btn, $ico) | Out-Null
}

function Wait-HttpReady([string]$Address, [int]$Seconds = 45) {
    $deadline = (Get-Date).AddSeconds($Seconds)
    while ((Get-Date) -lt $deadline) {
        try {
            Invoke-WebRequest -Uri $Address -UseBasicParsing -TimeoutSec 2 | Out-Null
            return $true
        } catch {
            Start-Sleep -Milliseconds 800
        }
    }
    return $false
}

function Start-BackgroundNpm([string]$WorkingDir, [string]$ScriptName) {
    Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/c npm run $ScriptName" `
        -WorkingDirectory $WorkingDir `
        -WindowStyle Minimized `
        | Out-Null
}

if (-not (Test-Path -LiteralPath $WebDir)) {
    Show-Message "Nie znaleziono katalogu web:`n$WebDir" -Icon Error
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Show-Message "Brak npm (Node.js). Zainstaluj Node.js z https://nodejs.org/" -Icon Error
    exit 1
}

if (-not (Test-Path -LiteralPath (Join-Path $WebDir "node_modules"))) {
    Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/c npm install && pause" `
        -WorkingDirectory $WebDir `
        -WindowStyle Normal `
        | Out-Null
    Show-Message "Pierwsze uruchomienie - trwa instalacja pakietow.`n`nPoczekaj na koniec w oknie cmd, potem kliknij ikone ZHR ponownie."
    exit 0
}

if (-not (Test-PortOpen $DevPort)) {
    Start-BackgroundNpm $WebDir "dev"
}

if (-not (Test-PortOpen $CmsPort)) {
    Start-BackgroundNpm $WebDir "cms"
}

if (-not (Wait-HttpReady $Url)) {
    Show-Message "Serwer nie odpowiada: $Url`n`nSprawdz zminimalizowane okno cmd (npm run dev)." -Icon Warning
    exit 1
}

Start-Process $Url
