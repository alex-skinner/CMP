Write-Host ''
Write-Host '****************************************************************'
Write-Host 'This script will create a production version of your application' -foregroundcolor "green"
Write-Host 'Script author: Alex Skinner' -foregroundcolor "DarkCyan"
Write-Host 'Email: alex.skinner@redpixie.com' -foregroundcolor "DarkCyan"
Write-Host '****************************************************************'
Write-Host ''
Write-Host 'Please enter the output path where the app package will be deployed too'
Write-Host 'This must be an absolute path and does require quotes'

$invocation = (Get-Variable MyInvocation).Value
$directorypath = Split-Path $invocation.MyCommand.Path

$appPath = $directorypath.Replace("cmds\ps", "")

$outputPath = Read-Host -Prompt 'Output path'
$applicationName = Read-Host -Prompt 'Please enter the name of your application'

$fullOutputPath = $outputPath+'\'+$applicationName

Write-Host 'Creating application '
New-Item $fullOutputPath -type directory -force

#Copy app/dist folder
Write-Host '---------------------------------------------------------------------------'
Write-Host '   - Copying app\dist folder' -foregroundcolor "green"
Copy-Item $appPath'app\dist' -Destination $fullOutputPath'\app' -Recurse -Container -Force
Write-Host '---------------------------------------------------------------------------'

#Copy app-static folder
Write-Host '   - Copying app static folder' -foregroundcolor "green"
Copy-Item $appPath'app-static' -Destination $fullOutputPath -Recurse -Container -Force
Write-Host '---------------------------------------------------------------------------'

#Copy bower_components folder
Write-Host '   - Copying bower components folder' -foregroundcolor "green"
Copy-Item $appPath'bower_components' -Destination $fullOutputPath -Recurse -Container -Force
Write-Host '---------------------------------------------------------------------------'

#Copy node_modules folder
Write-Host '   - Copying node modules folder' -foregroundcolor "green"
Copy-Item $appPath'node_modules' -Destination $fullOutputPath -Container -Force
Write-Host '---------------------------------------------------------------------------'

#Copy index.html folder
Write-Host '   - Copying index.html' -foregroundcolor "green"
Copy-Item $appPath'index.html' -Destination $fullOutputPath -Recurse -Container -Force
Write-Host '---------------------------------------------------------------------------'

Write-Host ''
Write-Host ''
Write-Host '                        ****************'
Write-Host '                              Done' -foregroundcolor "green"
Write-Host '                        ****************'

ii $fullOutputPath