# Verificação de Sistema - Windows 11

Write-Host "Iniciando verificação do sistema..." -ForegroundColor Cyan

# [1] DISM
Write-Host "`n[1] Executando DISM /RestoreHealth..." -ForegroundColor Yellow
DISM /Online /Cleanup-Image /RestoreHealth
if ($LASTEXITCODE -eq 0) {
    Write-Host "DISM concluído com sucesso." -ForegroundColor Green
} else {
    Write-Host "DISM encontrou erros." -ForegroundColor Red
}

# [2] SFC
Write-Host "`n[2] Executando SFC /scannow..." -ForegroundColor Yellow
sfc /scannow
if ($LASTEXITCODE -eq 0) {
    Write-Host "SFC não encontrou violações." -ForegroundColor Green
} elseif ($LASTEXITCODE -eq 1) {
    Write-Host "SFC corrigiu arquivos corrompidos." -ForegroundColor Yellow
} else {
    Write-Host "SFC encontrou erros não corrigidos." -ForegroundColor Red
}

# [3] CHKDSK
Write-Host "`n[3] Verificando disco com CHKDSK..." -ForegroundColor Yellow
chkdsk C: /scan

# [4] Serviços críticos
Write-Host "`n[4] Verificando serviços essenciais..." -ForegroundColor Yellow
Get-Service | Where-Object { $_.Status -ne 'Running' -and ($_.Name -like '*wuauserv*' -or $_.Name -like '*BITS*' -or $_.Name -like '*Winmgmt*') } | Format-Table Name, Status

# [5] Eventos de erro
Write-Host "`n[5] Últimos 10 erros do sistema..." -ForegroundColor Yellow
Get-EventLog -LogName System -EntryType Error -Newest 10 | Format-Table TimeGenerated, Source, EventID, Message -AutoSize

# [6] Uso de CPU
Write-Host "`n[6] Processos com maior uso de CPU..." -ForegroundColor Yellow
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 | Format-Table Name, CPU, ID

Write-Host "`nVerificação concluída." -ForegroundColor Cyan
