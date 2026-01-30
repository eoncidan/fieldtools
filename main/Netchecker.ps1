# Arquivo: /Pages/Netchecker.ps1

# Script de verificacao de dispositivos.

function Netchecker {
	# Coleta e retorna as infos de rede.
	$SysInfo = Get-CimInstance Win32_NetworkAdapterConfiguration  -Filter "IPEnabled = True"
	
	# WiFi e Ethernet.
    try {
        $Adapters = Get-NetAdapter -ErrorAction SilentlyContinue
        
        # WiFi
        $WiFiAdapter = $Adapters | Where-Object { $_.InterfaceDescription -match "Wireless|Wi-Fi|802.11" } | Select-Object -First 1
        if ($null -eq $WiFiAdapter) { $WiFiStatus = "Não Instalado" }
        elseif ($WiFiAdapter.Status -eq "Up") { $WiFiStatus = "Conectado" }
        else { $WiFiStatus = "Desconectado" }

        # Ethernet
        $EthAdapter = $Adapters | Where-Object { $_.InterfaceDescription -match "Ethernet|GbE|Realtek|Intel" -and $_.InterfaceDescription -notmatch "Wireless|Wi-Fi|Bluetooth" } | Select-Object -First 1
        if ($null -eq $EthAdapter) { $EthStatus = "Não Instalado" }
        elseif ($EthAdapter.Status -eq "Up") { $EthStatus = "Conectado" }
        else { $EthStatus = "Desconectado" }
    } catch { $WiFiStatus = "Erro"; $EthStatus = "Erro" }
	
    # Bluetooth.
    try {
        # Verifica serviços e dispositivos PnP.
        $BTDevice = Get-PnpDevice -Class "Bluetooth" -Status "OK" -ErrorAction SilentlyContinue
        if ($BTDevice) { $BTStatus = "Ativo" } else { $BTStatus = "Indisponível/Off" }
    } catch {$BTStatus = "Erro"}

    # Saidas e entrads de audio.
    try {
        # Busca endpoints de áudio ativos.
        $AudioDevs = Get-PnpDevice -Class "AudioEndpoint" -Status "OK" -ErrorAction SilentlyContinue
        
        # Filtra por Output e Input.
        if ($AudioDevs) {
            $AudioOutStatus = "Ok"
            $AudioInStatus  = "Ok"
        } else {
            $AudioOutStatus = "Não Detectado"
            $AudioInStatus  = "Não Detectado"
        }
    } catch { $AudioOutStatus = "Erro"; $AudioInStatus = "Erro" }

    # USBs
    try {
        # Verifica se há controladores USB com erro.
        $USBErrors = Get-PnpDevice -Class "USB" -Status "Error","Degraded" -ErrorAction SilentlyContinue
        if ($USBErrors) { $USBStatus = "Alerta (Falha de Driver)" } else { $USBStatus = "Ok (Controladores Ativos)" }
    } catch { $USBStatus = "Erro" }

    # Verificadao do disco.
    try {
        $Disks = Get-PhysicalDisk | Where-Object { $_.MediaType -ne 'Unspecified' }
        $Unhealthy = $Disks | Where-Object { $_.HealthStatus -ne 'Healthy' }
        
        if ($Unhealthy) { 
            $DiskStatus = "Risco Detetado ($($Unhealthy.FriendlyName))" 
        } else { 
            $DiskStatus = "Saudável ($($Disks.Count) Unid.)" 
        }
    } catch { $DiskStatus = "Indisponível" }

    # Bateria (se tiver).
    try {
        $Battery = Get-CimInstance Win32_Battery -ErrorAction SilentlyContinue
        if ($Battery) {
            # Calcula porcentagem aproximada
            $BatLevel = $Battery.EstimatedChargeRemaining
            $BatStatus = "$BatLevel% Restante"
        } else {
            $BatStatus = "Não Detectado (AC)"
        }
    } catch { $BatStatus = "Erro" }
	
	[PSCustomObject]@{
		
	IP = $SysInfo.IPAddress[0]
	DNS1 = $SysInfo.DNSServerSearchOrder[0]
	DNS2 = $SysInfo.DNSServerSearchOrder[1]
    WiFi        = $WiFiStatus
    Ethernet    = $EthStatus
    Bluetooth   = $BTStatus
    AudioOutput = $AudioOutStatus
    AudioInput  = $AudioInStatus
    USB         = $USBStatus
    DiskHealth  = $DiskStatus
    Battery     = $BatStatus	
	
	}
}

$global:SysInfo = Netchecker
