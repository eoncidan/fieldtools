# Arquivo: /Start.ps1

# Objetivo: Validar UAC (Admin) e iniciar a interface.

# DESBLOQUEIA OS ARQUIVOS .PS1
Unblock-File -Path "$PSScriptRoot\Start.ps1"
Unblock-File -Path "$PSScriptRoot\Main\MainGUI.ps1"

# VALIDA O ADMIN USER 
$Principal = [Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()
if (-not $Principal.IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    # Se não for Admin, reinicia o script pedindo elevação (Tela Sim/Não do Windows).
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    Exit
}

# VALIDAÇÃO DO AMBIENTE	
Set-Location $PSScriptRoot

# BUSCA O MAIN PARA RODAR A INTERFACE 
$MainGUI = "$PSScriptRoot\Main\MainGUI.ps1"

# ESCONDE O TERMINAL 
$t = '[DllImport("user32.dll")] public static extern bool ShowWindow(int handle, int state);'
Add-Type -MemberDefinition $t -Name Api -Namespace Win32
$hwnd = (Get-Process -Id $PID).MainWindowHandle
[void][Win32.Api]::ShowWindow($hwnd, 0)

# LOAD NA INTERFACE 
if (Test-Path $MainGUI) {
    & $MainGUI
} else {
    Write-Host "ERRO CRÍTICO: Arquivo principal não encontrado em:`n$MainGUI" -ForegroundColor Red
    Read-Host "Pressione Enter para sair..."

}

