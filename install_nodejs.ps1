# 下载Node.js安装程序
$url = "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi"
$output = "nodejs_installer.msi"
Invoke-WebRequest -Uri $url -OutFile $output

# 安装Node.js
Start-Process msiexec.exe -Wait -ArgumentList '/i nodejs_installer.msi /quiet'

Write-Host "Node.js installation completed"
