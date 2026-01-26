# Arquivo: /Main/MainGUI.ps1

# Objetivo: Interface.

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ARQUITETURA DE CAMINHOS
$ProjectRoot = Split-Path $PSScriptRoot -Parent

# CARREGAR PÁGINAS
# O "dot sourcing" (.) carrega as funções dos outros arquivos na memória.
. "$ProjectRoot\Pages\Sistema.ps1"
. "$ProjectRoot\Pages\Ferramentas.ps1"
. "$ProjectRoot\Pages\Apps.ps1"
. "$ProjectRoot\Pages\ScriptsLib.ps1"

# CONFIGURAÇÕES VISUAIS
$ColorDark      = [System.Drawing.ColorTranslator]::FromHtml("#121212")
$ColorLDark     = [System.Drawing.ColorTranslator]::FromHtml("#565656")
$ColorContent   = [System.Drawing.ColorTranslator]::FromHtml("#191919")
$ColorLContent  = [System.Drawing.ColorTranslator]::FromHtml("#323232")
$ColorText      = [System.Drawing.Color]::White
$FontTitle      = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)

# JANELA PRINCIPAL
$Form = New-Object System.Windows.Forms.Form
$Form.Text = "Field Tools"
$Form.Size = New-Object System.Drawing.Size(980, 570)
$Form.StartPosition = "CenterScreen"
$Form.FormBorderStyle = "None"
$Form.BackColor = $ColorContent

# TOPBAR (BARRA SUPERIOR SUBSTITUTA DO WINDOWS)
$TopBar = New-Object System.Windows.Forms.Panel; $TopBar.Height = 40; $TopBar.Dock = "Top"; $TopBar.BackColor = $ColorDark; $Form.Controls.Add($TopBar)
$lblTitle = New-Object System.Windows.Forms.Label; $lblTitle.Text = "FIELD TOOLS"; $lblTitle.ForeColor = $ColorText; $lblTitle.Font = $FontTitle; $lblTitle.AutoSize = $true; $lblTitle.Location = New-Object System.Drawing.Point(10, 8); $TopBar.Controls.Add($lblTitle)
$btnClose = New-Object System.Windows.Forms.Button; $btnClose.Text = "X"; $btnClose.Size = New-Object System.Drawing.Size(40, 40); $btnClose.Dock = "Right"; $btnClose.FlatStyle = "Flat"; $btnClose.FlatAppearance.BorderSize = 0; $btnClose.ForeColor = $ColorText; $btnClose.BackColor = $ColorDark
$btnClose.Add_Click({ $Form.Close() }); $btnClose.Add_MouseEnter({ $btnClose.BackColor = [System.Drawing.Color]::Red }); $btnClose.Add_MouseLeave({ $btnClose.BackColor = $ColorDark }); $TopBar.Controls.Add($btnClose)

# LOGICA DE ARRASTO DE JANELA (DRAG)
$TopBar.Add_MouseDown({ $script:isDragging = $true; $script:dragStartPoint = $_.Location })
$TopBar.Add_MouseMove({ if ($script:isDragging) { $p = [System.Windows.Forms.Cursor]::Position; $Form.Location = New-Object System.Drawing.Point(($p.X - $script:dragStartPoint.X), ($p.Y - $script:dragStartPoint.Y)) } })
$TopBar.Add_MouseUp({ $script:isDragging = $false })

# SIDEBAR (BARRA LATERAL)
$Sidebar = New-Object System.Windows.Forms.Panel; $Sidebar.Width = 150; $Sidebar.Dock = "Left"; $Sidebar.BackColor = $ColorDark; $Form.Controls.Add($Sidebar)
$ContentPanel = New-Object System.Windows.Forms.Panel; $ContentPanel.Dock = "Fill"; $ContentPanel.BackColor = $ColorContent; $ContentPanel.Padding = New-Object System.Windows.Forms.Padding(20); $Form.Controls.Add($ContentPanel); $ContentPanel.BringToFront()

# FUNÇÕES VISUAIS

# Add-Card = Card pequeno para informações.
function Add-Card {
    param($Title, $Value, $X, $Y)
    
    $Card = New-Object System.Windows.Forms.Panel
    $Card.Size = New-Object System.Drawing.Size(390, 80)
    $Card.Location = New-Object System.Drawing.Point($X, $Y)
    $Card.BackColor = $ColorLContent
    
    $lblTitle = New-Object System.Windows.Forms.Label
    $lblTitle.Text = $Title
    $lblTitle.ForeColor = $ColorText
    $lblTitle.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
    $lblTitle.Location = New-Object System.Drawing.Point(15, 15)
    $lblTitle.AutoSize = $true
    $Card.Controls.Add($lblTitle)

    $lblValue = New-Object System.Windows.Forms.Label
    $lblValue.Text = $Value
    $lblValue.ForeColor = $ColorText
    $lblValue.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
    $lblValue.Location = New-Object System.Drawing.Point(15, 45)
    $lblValue.AutoSize = $true
    $lblValue.MaximumSize = New-Object System.Drawing.Size(370, 0)
    $Card.Controls.Add($lblValue)

    $script:ContentPanel.Controls.Add($Card)
}

# Add-GCard = Card grande para informações.
function Add-GCard {
    param($Title, $Value, $X, $Y)
    
    $GCard = New-Object System.Windows.Forms.Panel
    $GCard.Size = New-Object System.Drawing.Size(390, 160)
    $GCard.Location = New-Object System.Drawing.Point($X, $Y)
    $GCard.BackColor = $ColorLContent
    
    $lblTitle = New-Object System.Windows.Forms.Label
    $lblTitle.Text = $Title
    $lblTitle.ForeColor = $ColorText
    $lblTitle.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
    $lblTitle.Location = New-Object System.Drawing.Point(15, 15)
    $lblTitle.AutoSize = $true
    $GCard.Controls.Add($lblTitle)

    $lblValue = New-Object System.Windows.Forms.Label
    $lblValue.Text = $Value
    $lblValue.ForeColor = $ColorText
    $lblValue.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
    $lblValue.Location = New-Object System.Drawing.Point(15, 45)
    $lblValue.AutoSize = $true
    $lblValue.MaximumSize = New-Object System.Drawing.Size(370, 0)
    $GCard.Controls.Add($lblValue)

    $script:ContentPanel.Controls.Add($GCard)
}

# Add-Launcher = Botão com texto+input.
function Add-Launcher {
    param($Text, $Command, $X, $Y)

    $btn = New-Object System.Windows.Forms.Button
    $btn.Text = $Text
    $btn.Size = New-Object System.Drawing.Size(140, 70)
    $btn.Location = New-Object System.Drawing.Point($X, $Y)
    $btn.BackColor = $ColorDark
    $btn.ForeColor = $ColorText
    $btn.FlatStyle = "Flat"
    $btn.FlatAppearance.BorderSize = 0
    $btn.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Regular)
    $btn.Cursor = [System.Windows.Forms.Cursors]::Hand
    $btn.Tag = $Command
    $btn.Add_Click({ 
        try { 
            $CommandString = $this.Tag
            
            if ($CommandString -match "^(\S+)\s+(.*)$") {
                Start-Process -FilePath $matches[1] -ArgumentList $matches[2] -ErrorAction Stop
            }
            else {
                Start-Process $CommandString -ErrorAction Stop
            }
        } 
        catch { [System.Windows.Forms.MessageBox]::Show("Erro ao abrir: $_", "Erro") }
    })

    $btn.Add_MouseEnter({ $this.BackColor = $ColorLDark })
    $btn.Add_MouseLeave({ $this.BackColor = $ColorDark })

    $script:ContentPanel.Controls.Add($btn)
}

# Add-WingetApp = Botao instalar e descricao.
function Add-WingetApp {
    param($AppName, $WingetID, $Description, $ParentPanel)

    $AppRow = New-Object System.Windows.Forms.Panel
    $AppRow.Size = New-Object System.Drawing.Size(760, 50)
    $AppRow.Margin = New-Object System.Windows.Forms.Padding(0, 0, 0, 10)
    $AppRow.BackColor = $ColorLContent

    # Botão Instalar
    $btnInstall = New-Object System.Windows.Forms.Button
    $btnInstall.Text = "Instalar"
    $btnInstall.Size = New-Object System.Drawing.Size(100, 30)
    $btnInstall.Location = New-Object System.Drawing.Point(10, 10)
    $btnInstall.FlatStyle = "Flat"
    $btnInstall.BackColor = $ColorDark
    $btnInstall.ForeColor = $ColorText
    $btnInstall.FlatAppearance.BorderSize = 0	
    $btnInstall.Cursor = [System.Windows.Forms.Cursors]::Hand
    
    $btnInstall.Add_Click({
        $this.Enabled = $false
        $this.Text = "..."
        Start-Process "winget" -ArgumentList "install --id $WingetID --silent --accept-package-agreements --accept-source-agreements" -Wait -WindowStyle Hidden
        $this.Text = "Instalado!"
        $this.BackColor = [System.Drawing.Color]::Green
    }.GetNewClosure())

    # Descrição
    $lblApp = New-Object System.Windows.Forms.Label
    $lblApp.Text = "$AppName - $Description"
    $lblApp.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    $lblApp.Location = New-Object System.Drawing.Point(120, 15)
    $lblApp.AutoSize = $true
    $lblApp.ForeColor = $ColorText

    $AppRow.Controls.Add($btnInstall)
    $AppRow.Controls.Add($lblApp)
    $ParentPanel.Controls.Add($AppRow)
}

# NAVEGAÇÃO 
function Stop-BackgroundTasks {
    # Mata o Timer antigo.
    if ($script:Timer) { 
        $script:Timer.Stop()
        $script:Timer.Dispose()
        $script:Timer = $null
    }
    # Limpa Job antigo.
    if ($script:Job) {
        Remove-Job -Job $script:Job -Force -ErrorAction SilentlyContinue
        $script:Job = $null
    }
}

function Render-Page {
    param([string]$PageName)

    # Para tudo antes de trocar de pagina.
    Stop-BackgroundTasks

    # Define e limpa a pagina.
    $script:CurrentPage = $PageName
    $script:ContentPanel.Controls.Clear()
    $script:ContentPanel.Refresh()
    
    # Título da Página.
    $lblPage = New-Object System.Windows.Forms.Label
    $lblPage.Text = $PageName.ToUpper()
    $lblPage.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $lblPage.ForeColor = $script:ColorText
    $lblPage.AutoSize = $true
    $lblPage.Location = New-Object System.Drawing.Point(20, 20)
    $script:ContentPanel.Controls.Add($lblPage)

    # Roteador (Switch).
    switch ($PageName) {
        "Sistema"      { Render-Sistema } 
        "Ferramentas"  { Render-Ferramentas }
        "Scripts"      { Render-ScriptsLib -RootPath $script:ProjectRoot }
        "Apps"         { Render-Apps }
        #"Desempenho"   { }
    }
}

# MENU LATERAL
function Add-MenuButton {
    param([string]$Text, [int]$Y)
    $btn = New-Object System.Windows.Forms.Button
    $btn.Text = "  $Text"
    $btn.TextAlign = "MiddleLeft"
    $btn.FlatStyle = "Flat"
    $btn.FlatAppearance.BorderSize = 0
    $btn.ForeColor = [System.Drawing.Color]::White
    $btn.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Regular)
    $btn.Size = New-Object System.Drawing.Size(150, 45)
    $btn.Location = New-Object System.Drawing.Point(0, $Y)
    $btn.Cursor = [System.Windows.Forms.Cursors]::Hand
    $btn.Tag = $Text
    $btn.Add_Click({ 
        Render-Page -PageName $this.Tag 
    })
    
    $btn.Add_MouseEnter({ $this.BackColor = $ColorLDark })
    $btn.Add_MouseLeave({ $this.BackColor = $ColorDark })
    
    $script:Sidebar.Controls.Add($btn)
}

# Botoes do menu.
Add-MenuButton "Sistema" 60
Add-MenuButton "Ferramentas" 105
Add-MenuButton "Apps" 150
Add-MenuButton "Scripts" 195
#Add-MenuButton "Desempenho" 240

# Inicialização
Render-Page -PageName "Sistema" # Pagina de Inicialização.

[void]$Form.ShowDialog()



