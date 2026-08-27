# Buduje wielorozmiarowa ikone .ico z PNG (harcerska liliyka).
$ErrorActionPreference = "Stop"
$Py = Join-Path $PSScriptRoot "build-icon.py"
python $Py
