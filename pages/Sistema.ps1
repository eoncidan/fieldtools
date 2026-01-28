# Arquivo: /Pages/Sistema.ps1

# A aba Sistema mostra as informações de sistema.

. "$ProjectRoot\Main\Netchecker.ps1"

function Render-Sistema {
    # Cards primarios para informar o loading.
    Add-Card -Title "PROCESSADOR" -Value "Carregando..." -X 20 -Y 240
    Add-Card -Title "MEMÓRIA RAM" -Value "Carregando..." -X 20 -Y 330
    Add-Card -Title "PARTIÇÃO DO SISTEMA (C:)" -Value "Carregando..." -X 420 -Y 70
    Add-GCard -Title "DISCOS INSTALADOS" -Value "Carregando..." -X 420 -Y 160
	Add-Card -Title "GRAFICOS" -Value "Carregando..." -X 20 -Y 420	
	Add-GCard -Title "DISPOSITIVO" -Value "Carregando..." -X 20 -Y 70
	Add-NetCard -Title "CONFIGURAÇÕES DE REDE" -Text1 "Carregando..." -Text2 "Carregando..." -X 420 -Y 330
    $script:ContentPanel.Refresh()

    # Script coleta os dados.
    $ScriptBlock = {
        # Informações de processador.
        $CPU = Get-CimInstance win32_processor | select-object -ExpandProperty Name

		# Nome de dispositivo, modelo e usuário.
		$InfoDisp = Get-CimInstance Win32_ComputerSystem; $DeNome, $DeModelo, $DeUsuario = $Info.Name, $Info.Model, $Info.PrimaryOwnerName

		# Versão e data da BIOS.
		$InfoBIOS = Get-CimInstance Win32_BIOS | Select-Object -expandproperty SoftwareElementID
		$BiosDat = ([DateTime](Get-CimInstance Win32_BIOS).ReleaseDate).ToString("dd/MM/yyyy")

		# Informações de sistema operacional.
		$DeOs = get-ciminstance win32_operatingsystem | select-object -expandproperty caption

		# Placa de video instalada. Equipamentos com mais de uma terá elas listadas, ex: Integrada Intel e Dedicada Nvidia.
		$DeVideo = Get-CimInstance win32_videoController | select-object -expandproperty description

        # Informações de memória RAM, tipo, velocidade e quantidade.
        $RAMObj = Get-CimInstance Win32_ComputerSystem
        $TotalGB = [Math]::Ceiling($RAMObj.TotalPhysicalMemory / 1GB)
        
        try {
            $Pente = Get-CimInstance Win32_PhysicalMemory -ErrorAction Stop | Select-Object -First 1
            $RamType = switch ($Pente.SMBIOSMemoryType) {
                24 { "DDR3" } 26 { "DDR4" } 34 { "DDR5" } 0 { "DDR" } Default { "DIMM" }
            }
            $RamSpeed = $Pente.ConfiguredClockSpeed
        } catch { $RamType = "RAM"; $RamSpeed = "" }

        # Info do Disco C: 
        $Logico = Get-CimInstance Win32_LogicalDisk | Where-Object DeviceID -eq 'C:'
        $Free = [Math]::Round($Logico.Freespace / 1GB, 1)
        $TotalC = [Math]::Round($Logico.Size / 1GB, 0)

        # Discos instalados (HD, SSD, USB e etc.)
        try {
            $Fisicos = Get-PhysicalDisk | Sort-Object DeviceId
            $ListaDiscos = @()
            
            foreach ($D in $Fisicos) {
                # Descobre o tipo e quantidade.
                $Tipo = "Desconhecido"
                if ($D.MediaType -eq "SSD" -or $D.Model -match "SSD") { $Tipo = "SSD" }
                elseif ($D.MediaType -eq "HDD") { $Tipo = "HDD" }
                elseif ($D.BusType -eq "NVMe") { $Tipo = "NVMe" }
                elseif ($D.BusType -eq "USB") { $Tipo = "USB" }
                $SizeGB = [Math]::Round($D.Size / 1GB, 0)
                $ListaDiscos += "[$Tipo] $($D.Model) - $SizeGB GB"
            }
        } catch {
            $ListaDiscos = @("Erro ao listar discos")
        }

        # Retorno.
        @{ 
            CPU = $CPU
			Nome = $DeNome
			Modelo = $DeModelo
			Usuario = $DeUsuario
			BIOS = $BiosVer
			BIOSdat = $BiosDat
			Sistema = $DeOs
			Video = $DeVideo -join "`n"
            RAM_Txt = "$TotalGB GB $RamType" + $(if($RamSpeed){" ($RamSpeed MHz)"})
            C_Free = $Free
            C_Total = $TotalC
            Discos = $ListaDiscos -join "`n" # O 'n quebra a linha.
        }
    }

    $script:PSInstance = [PowerShell]::Create().AddScript($ScriptBlock) # Inicia thread.
    $script:AsyncResult = $script:PSInstance.BeginInvoke()
    $script:Timer = New-Object System.Windows.Forms.Timer
    $script:Timer.Interval = 100 # Timer em 0.1.
    
    $script:Timer.Add_Tick({
        if ($script:CurrentPage -ne "Sistema") {
            $script:Timer.Stop(); if ($script:PSInstance) { $script:PSInstance.Dispose() }; return
        }

        if ($script:AsyncResult.IsCompleted) {
            $script:Timer.Stop()
            try {
                $Result = $script:PSInstance.EndInvoke($script:AsyncResult)
                $script:PSInstance.Dispose()
                
                if ($Result -and ($script:CurrentPage -eq "Sistema")) {
                    $script:ContentPanel.Controls.Clear()
                    
                    # Título.
                    $lblPage = New-Object System.Windows.Forms.Label
                    $lblPage.Text = "SISTEMA"
                    $lblPage.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
                    $lblPage.ForeColor = $ColorText
                    $lblPage.AutoSize = $true
                    $lblPage.Location = New-Object System.Drawing.Point(20, 20)
                    $script:ContentPanel.Controls.Add($lblPage)

                    # Informações carregadas.
                    Add-Card -Title "PROCESSADOR" -Value $Result.CPU -X 20 -Y 240
                    Add-Card -Title "MEMÓRIA RAM" -Value $Result.RAM_Txt -X 20 -Y 330
                    $TextoC = "Livre: $($Result.C_Free) GB / Total: $($Result.C_Total) GB"
                    Add-Card -Title "PARTIÇÃO DO SISTEMA (C:)" -Value $TextoC -X 420 -Y 70
                    Add-GCard -Title "DISCOS INSTALADOS" -Value $Result.Discos -X 420 -Y 160
					Add-Card -Title "GRAFICOS" -Value $Result.Video -X 20 -Y 420	
					Add-GCard -Title "DISPOSITIVO" -Value "Nome: $($Result.Nome)`nModelo: $($Result.Modelo)`nUsuario: $($Result.Usuario)`nBIOS: $($Result.BIOS), $($Result.BIOSdat)`nSO: $($Result.Sistema)" -X 20 -Y 70
					Add-NetCard -Title "CONFIGURAÇÕES DE REDE" -Text1 "IP: $($rnetc.IP)`nDNS: $($rnetc.DNS1) / $($rnetc.DNS2)" -Text2 "WIFI`nBLUETOOTH`nETHERNET" -X 420 -Y 330
                }
            } catch { Write-Host "Erro: $_" }
        }
    })
    $script:Timer.Start()


}


