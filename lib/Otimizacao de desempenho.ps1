echo Desativando serviços desnecessários...

sc config "SysMain" start= disabled
sc config "DiagTrack" start= disabled
sc config "WSearch" start= disabled
PowerShell -Command "Disable-ScheduledTask -TaskName 'PCHealth*'"

echo Otimizações de Performance...

reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "EnableMTCUvc" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "HiberbootEnabled" /t REG_DWORD /d 0 /f
powercfg /h off
bcdedit /set useplatformclock true
bcdedit /set disabledynamictick yes

echo Melhorando a Rede e Privacidade...

netsh int tcp set global autotuninglevel=high
reg add "HKLM\Software\Policies\Microsoft\Windows\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Dnscache" /v "Start" /t REG_DWORD /d 2 /f
