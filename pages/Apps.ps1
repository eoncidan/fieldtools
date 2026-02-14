# Arquivo: /Pages/Apps.ps1

# A aba Apps centraliza as aplicações essenciais com a opção de instalar.
function Render-Apps {

	# BS = Barra lateral de rolagem.
	$BS = New-Object System.Windows.Forms.FlowLayoutPanel; $BS.Location = New-Object System.Drawing.Point(20, 70); $BS.Size = New-Object System.Drawing.Size(800, 430); $BS.AutoScroll = $true; $BS.FlowDirection = "TopDown"; $BS.WrapContents = $false
    $script:ContentPanel.Controls.Add($BS)

    # Lista de Apps para instalar
    #Add-WingetApp -ParentPanel $BS -AppName "Nome do app" -WingetID "Caminho mstore" -Description "Descrição do app"

	# --- ACESSO REMOTO E REDE ---
    Add-WingetApp -ParentPanel $BS -AppName "AnyDesk" -WingetID "AnyDeskSoftwareGmbH.AnyDesk" -Description "Acesso remoto rápido e leve" 
    Add-WingetApp -ParentPanel $BS -AppName "RustDesk" -WingetID "RustDesk.RustDesk" -Description "Alternativa Open Source ao TeamViewer" 
    Add-WingetApp -ParentPanel $BS -AppName "Advanced IP Scanner" -WingetID "Famatech.AdvancedIPScanner" -Description "Escaneamento de rede LAN e IPs" 
    Add-WingetApp -ParentPanel $BS -AppName "PuTTY" -WingetID "PuTTY.PuTTY" -Description "Cliente SSH e Telnet para acesso a servidores/switches" 
    Add-WingetApp -ParentPanel $BS -AppName "Wireshark" -WingetID "WiresharkFoundation.Wireshark" -Description "Análise profunda de tráfego de rede"

    # --- DIAGNÓSTICO DE DISCO E SISTEMA ---
    Add-WingetApp -ParentPanel $BS -AppName "CrystalDiskInfo" -WingetID "CrystalDewWorld.CrystalDiskInfo" -Description "Verifica saúde (S.M.A.R.T) de HDs e SSDs" 
    Add-WingetApp -ParentPanel $BS -AppName "CrystalDiskMark" -WingetID "CrystalDewWorld.CrystalDiskMark" -Description "Teste de velocidade de leitura/escrita de disco" 
    Add-WingetApp -ParentPanel $BS -AppName "TreeSize Free" -WingetID "JAMSoftware.TreeSize.Free" -Description "Visualiza o que está ocupando espaço no disco" 
    Add-WingetApp -ParentPanel $BS -AppName "CPU-Z" -WingetID "CPUID.CPU-Z" -Description "Detalhes técnicos do processador e RAM"
    Add-WingetApp -ParentPanel $BS -AppName "HWMonitor" -WingetID "CPUID.HWMonitor" -Description "Monitoramento de hardware e temperaturas" 
    Add-WingetApp -ParentPanel $BS -AppName "GPU-Z" -WingetID "TechPowerUp.GPU-Z" -Description "Informações detalhadas da placa de vídeo" 	

    # --- FERRAMENTAS DE MANUTENÇÃO E UTILITÁRIOS ---
    Add-WingetApp -ParentPanel $BS -AppName "WinToys" -WingetID "9P8LTPGCBZXD" -Description "Otimização e personalização do Windows" 	
    Add-WingetApp -ParentPanel $BS -AppName "Revo Uninstaller" -WingetID "VSRevoGroup.RevoUninstallerFree" -Description "Remove programas difíceis e limpa resíduos" 
    Add-WingetApp -ParentPanel $BS -AppName "Rufus" -WingetID "Rufus.Rufus" -Description "Cria pendrives bootáveis" 
    Add-WingetApp -ParentPanel $BS -AppName "PowerToys" -WingetID "Microsoft.PowerToys" -Description "Conjunto de utilitários avançados da Microsoft" 
    Add-WingetApp -ParentPanel $BS -AppName "BleachBit" -WingetID "BleachBit.BleachBit" -Description "Limpeza de sistema"
    Add-WingetApp -ParentPanel $BS -AppName "7-Zip" -WingetID "7zip.7zip" -Description "Compactador e descompactador de arquivos" 	

    # --- NAVEGADORES E EDITORES ---
    Add-WingetApp -ParentPanel $BS -AppName "Notepad++" -WingetID "Notepad++.Notepad++" -Description "Editor de texto avançado" 	
    Add-WingetApp -ParentPanel $BS -AppName "Google Chrome" -WingetID "Google.Chrome" -Description "Navegador padrão" 
    Add-WingetApp -ParentPanel $BS -AppName "Firefox" -WingetID "Mozilla.Firefox" -Description "Navegador alternativo para testes" 
    Add-WingetApp -ParentPanel $BS -AppName "VS Code" -WingetID "Microsoft.VisualStudioCode" -Description "Editor de código e scripts" 
    Add-WingetApp -ParentPanel $BS -AppName "VLC Media Player" -WingetID "VideoLAN.VLC" -Description "Reprodutor de mídia universal"
    Add-WingetApp -ParentPanel $BS -AppName "Lightshot" -WingetID "Skillbrains.Lightshot" -Description "Ferramenta de captura de tela rápida" 
    Add-WingetApp -ParentPanel $BS -AppName "LibreOffice" -WingetID "TheDocumentFoundation.LibreOffice" -Description "Suíte de escritório gratuita e open source"

}


