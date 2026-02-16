# Arquivo: /Pages/Relatorios.ps1

# A aba Relatorios centraliza as funcoes de extracao de relatorios.

# Cria pasta Relatorios no Desktop.
function Fol-Relatorios {
	# Variavel da pasta de relatorios, cria uma caso nao exista.
	$Relatorios = "$env:USERPROFILE\Desktop\Relatorios"
	if (!(Test-Path $Relatorios)) { New-Item -ItemType Directory -Path $Relatorios }
}

# Relatorio de status da bateria.
function Rel-Bateria {
# Chama a janela de loading.
Exec-JanelaLoad; $script:JanelaProgresso.Value = 30
# Codigo da tarefa que a função executa.
powercfg /batteryreport /output "$env:USERPROFILE\Desktop\Relatorios\Saude_Bateria.html"; $script:JanelaProgresso.Value = 60
powercfg /energy /output "$env:USERPROFILE\Desktop\Relatorios\Eficiencia_Energia.html" /duration 5; $script:JanelaProgresso.Value = 80
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
    #Add-GerarRelatorio -ParentPanel $BS -Relatorio "Rede" -Func {Rel-Rede}

}


