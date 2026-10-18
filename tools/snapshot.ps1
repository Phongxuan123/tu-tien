# Bản sao nén theo mốc (thay cho git commit khi máy chưa cài git).
# Dùng: powershell -File tools\snapshot.ps1 -Name M1-su-kien
param([Parameter(Mandatory=$true)][string]$Name)
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$dest = Join-Path (Split-Path -Parent $root) 'game-tu-tien-snapshots'
New-Item -ItemType Directory -Force $dest | Out-Null
$zip = Join-Path $dest ((Get-Date -Format 'yyyyMMdd-HHmm') + '-' + $Name + '.zip')
$items = Get-ChildItem $root -Force | Where-Object { $_.Name -notin @('.git') }
Compress-Archive -Path $items.FullName -DestinationPath $zip -Force
Write-Host "Đã lưu: $zip"
