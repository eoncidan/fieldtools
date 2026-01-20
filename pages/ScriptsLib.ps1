# Arquivo: /Pages/Scripts.ps1

# A aba Scripts consiste em centralizar todos os scripts do usuario jogando os .ps1 na pasta LIB na raiz.

# RENDERIZA A PAGINA
function Render-ScriptsLib {
    param($RootPath)

    $LibFolder = "$RootPath\Lib"
    
    # Cria a pasta se não existir
    if (-not (Test-Path $LibFolder)) { New-Item -ItemType Directory -Path $LibFolder | Out-Null }

    $Scripts = Get-ChildItem -Path $LibFolder -Filter "*.ps1"
    
    if ($Scripts.Count -eq 0) {
        $lbl = New-Object System.Windows.Forms.Label
        $lbl.Text = "Nenhum script encontrado na pasta LIB"
        $lbl.AutoSize = $true; $lbl.Location = New-Object System.Drawing.Point(20, 80)
        $script:ContentPanel.Controls.Add($lbl)
        return
    }

    $X = 20; $Y = 70
    $Count = 0

    foreach ($File in $Scripts) {
        # Executa o script ignorando política de segurança
        Add-Launcher -Text $File.BaseName -Command "powershell.exe -ExecutionPolicy Bypass -File `"$($File.FullName)`"" -X $X -Y $Y
        
        # Lógica de Grid (quebra de linha a cada 5 itens)
        $X += 150
        $Count++
        if ($X -gt 700) { 
            $X = 20
            $Y += 110 
        }
    }

}
