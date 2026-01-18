# Start.ps1
# Objetivo: Elevar privilégios, ocultar console e iniciar a GUI.

$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$MainGUI = Join-Path $ScriptPath "MainGUI.ps1"

# Verifica se é Administrador
$Principal = [Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()
if (-not $Principal.IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    # Relança como Admin
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    Exit
}

# Oculta a janela do Console (Método via P/Invoke)
$t = '[DllImport("user32.dll")] public static extern bool ShowWindow(int handle, int state);'
Add-Type -MemberDefinition $t -Name Api -Namespace Win32
$hwnd = (Get-Process -Id $PID).MainWindowHandle
[void][Win32.Api]::ShowWindow($hwnd, 0) # 0 = Hide

#  Carrega a Interface Principal
if (Test-Path $MainGUI) {
    . $MainGUI
} else {
    [System.Windows.Forms.MessageBox]::Show("Erro: MainGUI.ps1 não encontrado na pasta: $ScriptPath", "Field Tools Pro", 0, 16)
    Exit
}