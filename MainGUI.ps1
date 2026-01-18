# MainGUI.ps1
# Objetivo: Interface Gráfica

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Configurações Visuais
$ColorDark      = [System.Drawing.ColorTranslator]::FromHtml("#2D2D30")
$ColorDarker    = [System.Drawing.ColorTranslator]::FromHtml("#1E1E1E")
$ColorContent   = [System.Drawing.ColorTranslator]::FromHtml("#F5F5F5")
$ColorAccent    = [System.Drawing.ColorTranslator]::FromHtml("#0078D7")
$ColorText      = [System.Drawing.Color]::White
$FontTitle      = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold) 
$FontRegular    = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Regular)

# Janela Principal
$Form = New-Object System.Windows.Forms.Form
$Form.Text = "Field Tools"
$Form.Size = New-Object System.Drawing.Size(980, 600)
$Form.StartPosition = "CenterScreen"
$Form.FormBorderStyle = "None"
$Form.BackColor = $ColorContent

# Barra superior (removida a padrao do windows)
$TopBar = New-Object System.Windows.Forms.Panel
$TopBar.Height = 40
$TopBar.Dock = "Top"
$TopBar.BackColor = $ColorDarker
$Form.Controls.Add($TopBar)

$lblTitle = New-Object System.Windows.Forms.Label
$lblTitle.Text = "FIELD TOOLS v1.0"
$lblTitle.ForeColor = $ColorText
$lblTitle.Font = $FontTitle
$lblTitle.AutoSize = $true
$lblTitle.Location = New-Object System.Drawing.Point(10, 8)
$TopBar.Controls.Add($lblTitle)

$btnClose = New-Object System.Windows.Forms.Button
$btnClose.Text = "X"
$btnClose.Size = New-Object System.Drawing.Size(40, 40)
$btnClose.Dock = "Right"
$btnClose.FlatStyle = "Flat"
$btnClose.FlatAppearance.BorderSize = 0
$btnClose.ForeColor = $ColorText
$btnClose.BackColor = $ColorDarker
$btnClose.Add_Click({ $Form.Close() })
$btnClose.Add_MouseEnter({ $btnClose.BackColor = [System.Drawing.Color]::Red })
$btnClose.Add_MouseLeave({ $btnClose.BackColor = $ColorDarker })
$TopBar.Controls.Add($btnClose)

# Lógica de Arrastar (Drag)
$isDragging = $false
$dragStartPoint = $null
$TopBar.Add_MouseDown({ 
    $script:isDragging = $true 
    $script:dragStartPoint = $_.Location 
})
$TopBar.Add_MouseMove({ 
    if ($script:isDragging) { 
        $currentPoint = [System.Windows.Forms.Cursor]::Position
        $Form.Location = New-Object System.Drawing.Point(
            ($currentPoint.X - $script:dragStartPoint.X), 
            ($currentPoint.Y - $script:dragStartPoint.Y)
        )
    } 
})
$TopBar.Add_MouseUp({ $script:isDragging = $false })

# Sidebar (Barra lateral com as abas)
$Sidebar = New-Object System.Windows.Forms.Panel
$Sidebar.Width = 200
$Sidebar.Dock = "Left"
$Sidebar.BackColor = $ColorDark
$Form.Controls.Add($Sidebar)

# ContentPanel 
$ContentPanel = New-Object System.Windows.Forms.Panel
$ContentPanel.Dock = "Fill"
$ContentPanel.BackColor = $ColorContent
$ContentPanel.Padding = New-Object System.Windows.Forms.Padding(20)
$Form.Controls.Add($ContentPanel)
$ContentPanel.BringToFront()

# FUNÇÕES AUXILIARES 

function Add-Card {
    param($Title, $Value, $X, $Y)
    
    $Card = New-Object System.Windows.Forms.Panel
    $Card.Size = New-Object System.Drawing.Size(300, 100)
    $Card.Location = New-Object System.Drawing.Point($X, $Y)
    $Card.BackColor = [System.Drawing.Color]::White 
    
    $lblTitle = New-Object System.Windows.Forms.Label
    $lblTitle.Text = $Title
    $lblTitle.ForeColor = [System.Drawing.Color]::Gray
    $lblTitle.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
    $lblTitle.Location = New-Object System.Drawing.Point(15, 15)
    $lblTitle.AutoSize = $true
    $Card.Controls.Add($lblTitle)

    $lblValue = New-Object System.Windows.Forms.Label
    $lblValue.Text = $Value
    $lblValue.ForeColor = [System.Drawing.ColorTranslator]::FromHtml("#0078D7")
    $lblValue.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
    $lblValue.Location = New-Object System.Drawing.Point(15, 45)
    $lblValue.AutoSize = $true
    $lblValue.MaximumSize = New-Object System.Drawing.Size(280, 0)
    $Card.Controls.Add($lblValue)

    $script:ContentPanel.Controls.Add($Card)
}

function Add-Launcher {
    param($Text, $Command, $X, $Y)

    $btn = New-Object System.Windows.Forms.Button
    $btn.Text = $Text
    $btn.Size = New-Object System.Drawing.Size(140, 100)
    $btn.Location = New-Object System.Drawing.Point($X, $Y)
    $btn.BackColor = [System.Drawing.ColorTranslator]::FromHtml("#3E3E42")
    $btn.ForeColor = [System.Drawing.Color]::White
    $btn.FlatStyle = "Flat"
    $btn.FlatAppearance.BorderSize = 0
    $btn.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    $btn.Cursor = [System.Windows.Forms.Cursors]::Hand

    $btn.Add_Click({ 
        try { Start-Process $Command -ErrorAction Stop } 
        catch { [System.Windows.Forms.MessageBox]::Show("Erro: $_", "Erro") }
    }.GetNewClosure())

    $btn.Add_MouseEnter({ $this.BackColor = [System.Drawing.ColorTranslator]::FromHtml("#0078D7") })
    $btn.Add_MouseLeave({ $this.BackColor = [System.Drawing.ColorTranslator]::FromHtml("#3E3E42") })

    $script:ContentPanel.Controls.Add($btn)
}

function Add-WingetApp {
    param($AppName, $WingetID, $Description, $ParentPanel)

    $AppRow = New-Object System.Windows.Forms.Panel
    $AppRow.Size = New-Object System.Drawing.Size(700, 50)
    $AppRow.Margin = New-Object System.Windows.Forms.Padding(0, 0, 0, 10)
    $AppRow.BackColor = [System.Drawing.Color]::White

    # Botão de Instalar
    $btnInstall = New-Object System.Windows.Forms.Button
    $btnInstall.Text = "Instalar"
    $btnInstall.Size = New-Object System.Drawing.Size(100, 30)
    $btnInstall.Location = New-Object System.Drawing.Point(10, 10)
    $btnInstall.FlatStyle = "Flat"
    $btnInstall.BackColor = $ColorAccent
    $btnInstall.ForeColor = [System.Drawing.Color]::White
    $btnInstall.Cursor = [System.Windows.Forms.Cursors]::Hand
    
    $btnInstall.Add_Click({
        $this.Enabled = $false
        $this.Text = "..."
        Start-Process "winget" -ArgumentList "install --id $WingetID --silent --accept-package-agreements --accept-source-agreements" -Wait -WindowStyle Hidden
        $this.Text = "OK!"
        $this.BackColor = [System.Drawing.Color]::Green
    }.GetNewClosure())

    # Descrição do App
    $lblApp = New-Object System.Windows.Forms.Label
    $lblApp.Text = "$AppName - $Description"
    $lblApp.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    $lblApp.Location = New-Object System.Drawing.Point(120, 15)
    $lblApp.AutoSize = $true
    $lblApp.ForeColor = [System.Drawing.Color]::Black

    $AppRow.Controls.Add($btnInstall)
    $AppRow.Controls.Add($lblApp)
    $ParentPanel.Controls.Add($AppRow)
}

# Navegação 

function Render-Page {
    param([string]$PageName)

    $script:ContentPanel.Controls.Clear()
    $script:ContentPanel.Refresh() # Força atualização visual
    
    $lblPage = New-Object System.Windows.Forms.Label
    $lblPage.Text = $PageName.ToUpper()
    $lblPage.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $lblPage.ForeColor = [System.Drawing.ColorTranslator]::FromHtml("#0078D7")
    $lblPage.AutoSize = $true
    $lblPage.Location = New-Object System.Drawing.Point(20, 20)
    $script:ContentPanel.Controls.Add($lblPage)

    switch ($PageName) {
		"Diagnósticos" { 
            if ($script:Timer) { $script:Timer.Stop(); $script:Timer.Dispose() }
            
            # 2. Mostra estado "Carregando..."
            Add-Card -Title "PROCESSADOR" -Value "Carregando..." -X 20 -Y 80
            Add-Card -Title "MEMÓRIA RAM" -Value "..." -X 340 -Y 80
            Add-Card -Title "DISCO TOTAL (C:)" -Value "..." -X 20 -Y 200
            Add-Card -Title "ESPAÇO LIVRE" -Value "..." -X 340 -Y 200
            $script:ContentPanel.Refresh()

            # Inicia o Job
            $script:Job = Start-Job {
                $CPU = Get-CimInstance Win32_Processor | Select-Object -ExpandProperty Name
                $RAM = [Math]::Ceiling((Get-CimInstance Win32_ComputerSystem | Select-Object -ExpandProperty TotalPhysicalMemory) / 1GB)
                $Disco = [Math]::Round((Get-CimInstance Win32_LogicalDisk | Where-Object DeviceID -eq 'C:' | Select-Object -ExpandProperty Size) / 1GB, 2)
                $DiscoLivre = [Math]::Round((Get-CimInstance Win32_LogicalDisk | Where-Object DeviceID -eq 'C:' | Select-Object -ExpandProperty Freespace) / 1GB, 2)
                
                [PSCustomObject]@{
                    Processador = $CPU
                    MemoriaRAM = $RAM
                    Disco = $Disco
                    DiscoLivre = $DiscoLivre
                }
            }

            # Configura o Timer
            $script:Timer = New-Object System.Windows.Forms.Timer
            $script:Timer.Interval = 500
            $script:Timer.Add_Tick({
                if ($script:Job.State -eq 'Completed') {
                    $script:Timer.Stop() # Para o relógio
                    
                    try {
                        # Recebe os dados
                        $Result = Receive-Job -Job $script:Job
                        Remove-Job -Job $script:Job
                        
                        # Limpa e redesenha
                        if ($Result) {
                            $script:ContentPanel.Controls.Clear()
                            
                            # Título (Redesenha)
                            $lblPage = New-Object System.Windows.Forms.Label
                            $lblPage.Text = "DIAGNÓSTICOS"
                            $lblPage.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
                            $lblPage.ForeColor = [System.Drawing.ColorTranslator]::FromHtml("#0078D7")
                            $lblPage.AutoSize = $true
                            $lblPage.Location = New-Object System.Drawing.Point(20, 20)
                            $script:ContentPanel.Controls.Add($lblPage)

                            # Informações depois do Job achar
                            Add-Card -Title "PROCESSADOR" -Value $Result.Processador -X 20 -Y 80
                            Add-Card -Title "MEMÓRIA RAM" -Value "$($Result.MemoriaRAM) GB" -X 340 -Y 80
                            Add-Card -Title "DISCO TOTAL (C:)" -Value "$($Result.Disco) GB" -X 20 -Y 200
                            Add-Card -Title "ESPAÇO LIVRE" -Value "$($Result.DiscoLivre) GB" -X 340 -Y 200
                        }
                    }
                    catch {
                        [System.Windows.Forms.MessageBox]::Show("Erro ao receber dados: $_")
                    }
                }
            })

            $script:Timer.Start()
        }
        "Ferramentas" { 
            Add-Launcher -Text "Gerenciador`nde Tarefas" -Command "taskmgr" -X 20 -Y 80
            Add-Launcher -Text "Painel de`nControle" -Command "control" -X 170 -Y 80
            Add-Launcher -Text "Editor de`nRegistro" -Command "regedit" -X 320 -Y 80
            Add-Launcher -Text "CMD`n(Admin)" -Command "cmd" -X 470 -Y 80
            Add-Launcher -Text "Problem Steps Recorder`nPSR" -Command "psr.exe" -X 620 -Y 80				
            
            Add-Launcher -Text "Limpeza de`nDisco" -Command "cleanmgr" -X 20 -Y 190
            Add-Launcher -Text "Serviços" -Command "services.msc" -X 170 -Y 190
            Add-Launcher -Text "Conexões" -Command "ncpa.cpl" -X 320 -Y 190
            Add-Launcher -Text "Windows`nUpdate" -Command "ms-settings:windowsupdate" -X 470 -Y 190
            Add-Launcher -Text "Event Viewer" -Command "eventvwr.msc" -X 620 -Y 190				
 
			Add-Launcher -Text "Configuração do Sistema" -Command "msconfig" -X 20 -Y 300	
            Add-Launcher -Text "Gerenciador de Dispositivos" -Command "devmgmt.msc" -X 170 -Y 300
            Add-Launcher -Text "Monitor de Recursos" -Command "resmon" -X 320 -Y 300
            Add-Launcher -Text "Monitor de Desempenho" -Command "perfmon" -X 470 -Y 300	
            Add-Launcher -Text "Diagnóstico de Memória" -Command "mdsched.exe" -X 620 -Y 300				
        }
		"Apps" {
            # Painel com Scroll para a lista de apps
            $ScrollPanel = New-Object System.Windows.Forms.FlowLayoutPanel
            $ScrollPanel.Location = New-Object System.Drawing.Point(20, 80)
            $ScrollPanel.Size = New-Object System.Drawing.Size(740, 450)
            $ScrollPanel.AutoScroll = $true
            $ScrollPanel.FlowDirection = "TopDown"
            $ScrollPanel.WrapContents = $false
            $script:ContentPanel.Controls.Add($ScrollPanel)

            # Lista de Apps para instalar
            Add-WingetApp -AppName "Notepad++" -WingetID "Notepad++.Notepad++" -Description "Editor de texto avançado" -ParentPanel $ScrollPanel
            Add-WingetApp -AppName "WinToys" -WingetID "9P8LTPGCBZXD" -Description "Otimização e personalização do Windows" -ParentPanel $ScrollPanel
            Add-WingetApp -AppName "HWMonitor" -WingetID "CPUID.HWMonitor" -Description "Monitoramento de hardware e temperaturas" -ParentPanel $ScrollPanel
            Add-WingetApp -AppName "GPU-Z" -WingetID "TechPowerUp.GPU-Z" -Description "Informações detalhadas da placa de vídeo" -ParentPanel $ScrollPanel
            Add-WingetApp -AppName "AutoHotkey" -WingetID "AutoHotkey.AutoHotkey" -Description "Automação e criação de scripts" -ParentPanel $ScrollPanel
            Add-WingetApp -AppName "7-Zip" -WingetID "7zip.7zip" -Description "Compactador e descompactador de arquivos" -ParentPanel $ScrollPanel
            Add-WingetApp -AppName "Lightshot" -WingetID "Skillbrains.Lightshot" -Description "Ferramenta de captura de tela rápida" -ParentPanel $ScrollPanel
            Add-WingetApp -AppName "WO Mic Client" -WingetID "WirelessOrange.WOMic" -Description "Usa o celular como microfone do PC" -ParentPanel $ScrollPanel
            Add-WingetApp -AppName "LibreOffice" -WingetID "TheDocumentFoundation.LibreOffice" -Description "Suíte de escritório gratuita e open source" -ParentPanel $ScrollPanel
        }
}}

# Gerador do Menu 
function Add-MenuButton {
    param([string]$Text, [int]$Y)
    $btn = New-Object System.Windows.Forms.Button
    $btn.Text = "  $Text"
    $btn.TextAlign = "MiddleLeft"
    $btn.FlatStyle = "Flat"
    $btn.FlatAppearance.BorderSize = 0
    $btn.ForeColor = [System.Drawing.Color]::White
    $btn.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Regular)
    $btn.Size = New-Object System.Drawing.Size(200, 45)
    $btn.Location = New-Object System.Drawing.Point(0, $Y)
    $btn.Cursor = [System.Windows.Forms.Cursors]::Hand
    $btn.Add_Click({ 
        Render-Page -PageName $Text 
    }.GetNewClosure())
    
    $btn.Add_MouseEnter({ $this.BackColor = [System.Drawing.ColorTranslator]::FromHtml("#0078D7") })
    $btn.Add_MouseLeave({ $this.BackColor = [System.Drawing.ColorTranslator]::FromHtml("#2D2D30") })
    
    $Sidebar.Controls.Add($btn)
}

# Botões do menu
Add-MenuButton -Text "Diagnósticos" -Y 60
Add-MenuButton -Text "Ferramentas" -Y 105
Add-MenuButton -Text "Apps" -Y 150
Add-MenuButton -Text "Debloat" -Y 195
Add-MenuButton -Text "Desempenho" -Y 240
Add-MenuButton -Text "Scripts" -Y 285

# Inicialização
Render-Page -PageName "Diagnósticos" # Pagina que vai abrir ao iniciar o script
[void]$Form.ShowDialog()