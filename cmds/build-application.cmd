@Echo off
cd ps

powershell.exe -executionpolicy remotesigned -File  buildApplication.ps1

@Echo on
pause 2000
