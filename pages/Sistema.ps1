# Arquivo: /Pages/Sistema.ps1

# A aba Sistema mostra as informações de sistema.

function Render-Sistema {
    # Cards primarios para informar o loading.
    Add-Card -Title "PROCESSADOR" -Value "Carregando..." -X 20 -Y 70
    Add-Card -Title "MEMÓRIA RAM" -Value "Carregando..." -X 395 -Y 70
    Add-Card -Title "PARTIÇÃO DO SISTEMA (C:)" -Value "Carregando..." -X 20 -Y 230
    Add-Card -Title "DISCOS INSTALADOS" -Value "Carregando..." -X 395 -Y 230
    Add-Card -Title "N/A" -Value "Em breve" -X 395 -Y 390	
    Add-Card -Title "N/A" -Value "Em breve" -X 20 -Y 390	
    $script:ContentPanel.Refresh()

    # Script coleta os dados.
    $ScriptBlock = {
        # CPU
        $CPU = Get-CimInstance Win32_Processor | Select-Object -ExpandProperty Name
        
        # RAM
        $RAMObj = Get-CimInstance Win32_ComputerSystem
        $TotalGB = [Math]::Ceiling($RAMObj.TotalPhysicalMemory / 1GB)
        
        # Tipo de RAM 
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
                    Add-Card -Title "PROCESSADOR" -Value $Result.CPU -X 20 -Y 70
                    Add-Card -Title "MEMÓRIA RAM" -Value $Result.RAM_Txt -X 395 -Y 70
                    $TextoC = "Livre: $($Result.C_Free) GB`nTotal: $($Result.C_Total) GB"
                    Add-Card -Title "PARTIÇÃO DO SISTEMA (C:)" -Value $TextoC -X 20 -Y 230
                    Add-Card -Title "DISCOS INSTALADOS" -Value $Result.Discos -X 395 -Y 230
					Add-Card -Title "N/A" -Value "Em breve" -X 395 -Y 390	
					Add-Card -Title "N/A" -Value "Em breve" -X 20 -Y 390	
                }
            } catch { Write-Host "Erro: $_" }
        }
    })
    $script:Timer.Start()

}


