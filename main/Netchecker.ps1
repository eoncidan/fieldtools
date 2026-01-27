# Arquivo: /Pages/Netchecker.ps1

# Script de verificacao de dispositivos.

function Netchecker {
	
		$netc = Get-CimInstance Win32_NetworkAdapterConfiguration  -Filter "IPEnabled = True"
	
		[PSCustomObject]@{
		IP = $netc.IPAddress[0]
		DNS1 = $netc.DNSServerSearchOrder[0]
		DNS2 = $netc.DNSServerSearchOrder[1]
		}
}

$global:rnetc = Netchecker
Write-Host "IP: $($rnetc.IP) / DNS1: $($rnetc.DNS1) / DNS2: $($rnetc.DNS2)" -ForegroundColor Cyan