# Arquivo: /Pages/Relatorios.ps1

# A aba Relatorios centraliza as funcoes de extracao de relatorios.

# Cria pasta Relatorios no Desktop.
function Fol-Relatorios {
	$script:Relatorios = "$env:USERPROFILE\Desktop\Relatorios"
	if (!(Test-Path $script:Relatorios)) { New-Item -ItemType Directory -Path $script:Relatorios }
}

# Relatorio de desempenho do sistema.
function Rel-Desempenho {
	# Chama a janela de loading.	
    Exec-JanelaLoad
    $script:JanelaProgresso.Value = 20
    
	# Codigo do relatorio.
    Fol-Relatorios	
    $Arquivo = "$script:Relatorios\Relatorio_Desempenho.txt"	
    "================ USO GERAL (CPU E RAM) ================" | Out-File $Arquivo
    Get-CimInstance Win32_Processor | Select-Object @{Name="Uso de CPU (%)";Expression={$_.LoadPercentage}} | Format-List | Out-File $Arquivo -Append
    Get-CimInstance Win32_OperatingSystem | Select-Object @{Name="RAM Total(GB)";Expression={[math]::Round($_.TotalVisibleMemorySize/1MB,2)}}, @{Name="RAM Livre(GB)";Expression={[math]::Round($_.FreePhysicalMemory/1MB,2)}} | Format-Table -AutoSize | Out-File $Arquivo -Append
    $script:JanelaProgresso.Value = 50
    "================ PROCESSOS (10) ================" | Out-File $Arquivo -Append
    Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 Name, CPU, @{Name="RAM(MB)";Expression={[math]::Round($_.WorkingSet/1MB,2)}}, Id | Format-Table -AutoSize | Out-File $Arquivo -Append
    $script:JanelaProgresso.Value = 90
	
	# Fecha a janela de loading.	
    Exec-FecharJanelaLoad
}

# Relatorio de integridade de disco.
function Rel-Disco {
	# Chama a janela de loading.	
    Exec-JanelaLoad
    $script:JanelaProgresso.Value = 10
    
	# Codigo do relatorio.
    Fol-Relatorios	
    $Arquivo = "$script:Relatorios\Relatorio_Disco.txt"	
    "================ ESPAÇO EM DISCO ================" | Out-File $Arquivo
    Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | Select-Object DeviceID, @{Name="Total(GB)";Expression={[math]::Round($_.Size/1GB,2)}}, @{Name="Livre(GB)";Expression={[math]::Round($_.FreeSpace/1GB,2)}}, @{Name="% Livre";Expression={[math]::Round(($_.FreeSpace/$_.Size)*100,2)}} | Format-Table -AutoSize | Out-File $Arquivo -Append
    "================ STATUS S.M.A.R.T. ================" | Out-File $Arquivo -Append
    wmic diskdrive get model,status | Out-File $Arquivo -Append
    $script:JanelaProgresso.Value = 40
    "================ ERROS LÓGICOS DE DISCO (SCAN) ================" | Out-File $Arquivo -Append
    Get-Volume -DriveLetter C | Repair-Volume -Scan | Out-File $Arquivo -Append
    $script:JanelaProgresso.Value = 70
    
	# Fecha a janela de loading.
    Exec-FecharJanelaLoad
}

# Relatorio de status do sistema.
function Rel-Sistema {
	# Chama a janela de loading.
    Exec-JanelaLoad
    $script:JanelaProgresso.Value = 20
    
	# Codigo do relatorio.
    Fol-Relatorios	
	$Arquivo = "$script:Relatorios\Relatorio_Sistema.txt"
    "================ STATUS DE SEGURANÇA (ANTIVÍRUS/EDR) ================" | Out-File $Arquivo
    Get-MpComputerStatus -ErrorAction SilentlyContinue | Select-Object AMServiceEnabled, AntivirusEnabled, IsTamperProtected, IoavProtectionEnabled, OnAccessProtectionEnabled, RealTimeProtectionEnabled, BehaviorMonitorEnabled, AntispywareEnabled | Format-List | Out-File $Arquivo -Append
    $script:JanelaProgresso.Value = 40
    "================ WINDOWS UPDATE (ÚLTIMOS PATCHES) ================" | Out-File $Arquivo -Append
    Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 5 HotFixID, Description, InstalledOn | Format-Table -AutoSize | Out-File $Arquivo -Append
    "================ EVENT VIEWER: ERROS CRÍTICOS (ÚLTIMOS 7 DIAS) ================" | Out-File $Arquivo -Append
    Get-WinEvent -FilterHashtable @{LogName='System','Application'; Level=1,2; StartTime=(Get-Date).AddDays(-7)} -ErrorAction SilentlyContinue | Select-Object TimeCreated, Id, ProviderName, Message -First 30 | Format-Table -AutoSize | Out-File $Arquivo -Append -Width 200
    $script:JanelaProgresso.Value = 60
    "================ INTEGRIDADE DO SO (DISM / SFC) ================" | Out-File $Arquivo -Append
    "Status DISM (CheckHealth):" | Out-File $Arquivo -Append
    DISM /Online /Cleanup-Image /CheckHealth | Out-File $Arquivo -Append
    $script:JanelaProgresso.Value = 80
    "Status SFC (Apenas Verificacao):" | Out-File $Arquivo -Append
    sfc /verifyonly | Out-File $Arquivo -Append

	# Fecha a janela de loading.
    Exec-FecharJanelaLoad
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
	Test-Connection -ComputerName 8.8.8.8 -Count 4 -ErrorAction SilentlyContinue | Select-Object Address, ResponseTime | Format-List | Out-File $Arquivo -Append
	$script:JanelaProgresso.Value = 70	
    "================ RESOLUÇÃO DNS ================" | Out-File $Arquivo -Append
    Resolve-DnsName google.com -Type A -ErrorAction SilentlyContinue | Select-Object Name, IPAddress | Format-Table -AutoSize | Out-File $Arquivo -Append
    "================ TRACERT ================" | Out-File $Arquivo -Append
	tracert.exe -d -h 15 8.8.8.8 | Out-File $Arquivo -Append    
	$script:JanelaProgresso.Value = 0	

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
	
    Add-GCard -Title "RELATORIOS" -Value "Todos os relatórios que forem extraidos irá ser armazenado na sua área de trabalho dentro da pasta **Relatorios** que é gerada assim que extraido qualquer tipo de relatório disponivel na listagem abaixo." -X 20 -Y 70	
    Add-GCard -Title "RELATORIOS" -Value "Bateria - Informe da SAUDE e EFICIENCIA da bateria.`nRede - IP, PING, LATENCIA e RESOLUCAO de DNS.`nDesempenho - Uso geral de CPU, RAM e PROCESSOS.`nDisco - SMART, ESPAÇO em disco e ERROS LOGICOS.`nSistema - WINDOWS UPDATE, INTEGRIDADE e EVENT VIEWER." -X 420 -Y 70

    Add-GerarRelatorio -ParentPanel $BS -Relatorio "Bateria" -Func {Rel-Bateria} # Relatorio de status da bateria.
    Add-GerarRelatorio -ParentPanel $BS -Relatorio "Rede" -Func {Rel-Rede} # Relatorio de informações de rede.
    Add-GerarRelatorio -ParentPanel $BS -Relatorio "Desempenho" -Func {Rel-Desempenho} # Relatorio de desempenho do sistema.
    Add-GerarRelatorio -ParentPanel $BS -Relatorio "Disco" -Func {Rel-Disco} # Relatorio de integridade de disco.
    Add-GerarRelatorio -ParentPanel $BS -Relatorio "Sistema" -Func {Rel-Sistema} # Relatorio de status do sistema.
}
