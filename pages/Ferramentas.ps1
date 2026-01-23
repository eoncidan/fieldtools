# Arquivo: /Pages/Ferramentas.ps1

# A aba Ferramentas centraliza os softwares nativos do Windows.

function Render-Ferramentas {
    # Linha 1
    Add-Launcher -Text "Gerenciador`nde Tarefas" -Command "taskmgr" -X 20 -Y 70
    Add-Launcher -Text "Painel de`nControle" -Command "control" -X 170 -Y 70
    Add-Launcher -Text "Editor de`nRegistro" -Command "regedit" -X 320 -Y 70
    Add-Launcher -Text "CMD`n(Admin)" -Command "cmd" -X 470 -Y 70
    Add-Launcher -Text "Problem Steps Recorder (PSR)" -Command "psr.exe" -X 620 -Y 70              
    
    # Linha 2
    Add-Launcher -Text "Limpeza de`nDisco" -Command "cleanmgr" -X 20 -Y 150
    Add-Launcher -Text "Serviços" -Command "services.msc" -X 170 -Y 150
    Add-Launcher -Text "Conexões" -Command "ncpa.cpl" -X 320 -Y 150
    Add-Launcher -Text "Windows`nUpdate" -Command "ms-settings:windowsupdate" -X 470 -Y 150
    Add-Launcher -Text "Event Viewer" -Command "eventvwr.msc" -X 620 -Y 150             

    # Linha 3
    Add-Launcher -Text "Configuração do Sistema" -Command "msconfig" -X 20 -Y 230   
    Add-Launcher -Text "Gerenciador de Dispositivos" -Command "devmgmt.msc" -X 170 -Y 230
    Add-Launcher -Text "Monitor de Recursos" -Command "resmon" -X 320 -Y 230
    Add-Launcher -Text "Monitor de Desempenho" -Command "perfmon" -X 470 -Y 230 
    Add-Launcher -Text "Diagnóstico de Memória" -Command "mdsched.exe" -X 620 -Y 230    

}

