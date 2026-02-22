# Arquivo: /Pages/Relatorios.ps1

# A aba Relatorios centraliza as funcoes de extracao de relatorios.

# Cria pasta Relatorios no Desktop.
function Fol-Relatorios {
	$script:Relatorios = "$env:USERPROFILE\Desktop\Relatorios"
	if (!(Test-Path $script:Relatorios)) { New-Item -ItemType Directory -Path $script:Relatorios }
}


# Relatorio de informacões da rede.
function Rel-Rede {
	# Chama a janela de loading.	
    Exec-JanelaLoad
	$script:JanelaProgresso.Value = 20	
	
	# Codigo do relatorio.
	Fol-Relatorios
	netsh wlan show wlanreport
	Move-Item -Path "C:\ProgramData\Microsoft\Windows\WlanReport\wlan-report-latest.html" -Destination "$script:Relatorios\Relatorio_WLAN.html" -Force
	$script:JanelaProgresso.Value = 50

    $Arquivo = "$script:Relatorios\Relatorio_Redes.txt" 
	"================ RELATÓRIO DE REDE - $(Get-Date) ===" | Out-File $Arquivo
	"================ ADAPTADORES DE REDE ================" | Out-File $Arquivo -Append
	Get-NetAdapter -ErrorAction SilentlyContinue | Select-Object Name, InterfaceDescription, Status, MacAddress | Out-String | Out-File $Arquivo -Append
	"================ DETALHES DE IP ================" | Out-File $Arquivo -Append
	ipconfig /all | Out-String | Out-File $Arquivo -Append
    "================ PING E LATÊNCIA  ================" | Out-File $Arquivo -Append
    Test-NetConnection 8.8.8.8 -InformationLevel Detailed | Select-Object ComputerName, PingSucceeded, PingReplyDetails | Format-List | Out-File $Arquivo -Append
    "================ RESOLUÇÃO DNS ================" | Out-File $Arquivo -Append
    Resolve-DnsName google.com -Type A -ErrorAction SilentlyContinue | Select-Object Name, IPAddress | Format-Table -AutoSize | Out-File $Arquivo -Append
    "================ TRACERT ================" | Out-File $Arquivo -Append
    Test-NetConnection 8.8.8.8 -TraceRoute | Select-Object -ExpandProperty TraceRoute | Out-File $Arquivo -Append
    $script:JanelaProgresso.Value = 70	

	# Fecha a janela de loading.
	Exec-FecharJanelaLoad
}

# Relatorio de status da bateria.
function Rel-Bateria {
	# Chama a janela de loading.
	Exec-JanelaLoad
	$script:JanelaProgresso.Value = 30
	# Codigo do relatorio.
	Fol-Relatorios
	powercfg /batteryreport /output "$script:Relatorios\Saude_Bateria.html"
	$script:JanelaProgresso.Value = 60
	powercfg /energy /output "$script:Relatorios\Eficiencia_Energia.html" /duration 5
	# Fecha a janela de loading.
	Exec-FecharJanelaLoad
}

function Render-Relatorios {
	
	# BS = Barra lateral de rolagem.
	$BS = New-Object System.Windows.Forms.FlowLayoutPanel; $BS.Location = New-Object System.Drawing.Point(20, 240); $BS.Size = New-Object System.Drawing.Size(790, 260); $BS.AutoScroll = $true; $BS.FlowDirection = "TopDown"; $BS.WrapContents = $false
    $script:ContentPanel.Controls.Add($BS)
	
    Add-GCard -Title "RELATORIOS" -Value "Em desenvolvimento." -X 20 -Y 70	
    Add-GCard -Title "RELATORIOS" -Value "Em desenvolvimento." -X 420 -Y 70

    Add-GerarRelatorio -ParentPanel $BS -Relatorio "Bateria" -Func {Rel-Bateria}
    Add-GerarRelatorio -ParentPanel $BS -Relatorio "Rede" -Func {Rel-Rede}

}











