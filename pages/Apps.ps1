# Arquivo: /Pages/Apps.ps1

# A aba Apps centraliza as aplicações essenciais com a opção de instalar.

function Render-Apps {
    # Painel com Scroll para a lista de apps
    $ScrollPanel = New-Object System.Windows.Forms.FlowLayoutPanel
    $ScrollPanel.Location = New-Object System.Drawing.Point(20, 70)
    $ScrollPanel.Size = New-Object System.Drawing.Size(800, 430)
    $ScrollPanel.AutoScroll = $true
    $ScrollPanel.FlowDirection = "TopDown"
    $ScrollPanel.WrapContents = $false
    $script:ContentPanel.Controls.Add($ScrollPanel)

    # Lista de Apps para instalar
   #Add-WingetApp -AppName "Nome do app" -WingetID "Caminho mstore" -Description "Descrição do app" -ParentPanel $ScrollPanel	
    Add-WingetApp -AppName "Notepad++" -WingetID "Notepad++.Notepad++" -Description "Editor de texto avançado" -ParentPanel $ScrollPanel
    Add-WingetApp -AppName "WinToys" -WingetID "9P8LTPGCBZXD" -Description "Otimização e personalização do Windows" -ParentPanel $ScrollPanel
    Add-WingetApp -AppName "HWMonitor" -WingetID "CPUID.HWMonitor" -Description "Monitoramento de hardware e temperaturas" -ParentPanel $ScrollPanel
    Add-WingetApp -AppName "GPU-Z" -WingetID "TechPowerUp.GPU-Z" -Description "Informações detalhadas da placa de vídeo" -ParentPanel $ScrollPanel
    Add-WingetApp -AppName "7-Zip" -WingetID "7zip.7zip" -Description "Compactador e descompactador de arquivos" -ParentPanel $ScrollPanel
    Add-WingetApp -AppName "Lightshot" -WingetID "Skillbrains.Lightshot" -Description "Ferramenta de captura de tela rápida" -ParentPanel $ScrollPanel
    Add-WingetApp -AppName "LibreOffice" -WingetID "TheDocumentFoundation.LibreOffice" -Description "Suíte de escritório gratuita e open source" -ParentPanel $ScrollPanel
}

