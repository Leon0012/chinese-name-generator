# 设置执行策略
Write-Host "正在设置执行策略..." -ForegroundColor Green
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 检查 Node.js 是否安装
Write-Host "检查 Node.js 是否安装..." -ForegroundColor Green
$nodeVersion = node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "Node.js 未安装，正在安装..." -ForegroundColor Yellow
    # 运行 Node.js 安装脚本
    & "$PSScriptRoot\install_nodejs.ps1"
} else {
    Write-Host "Node.js 版本: $nodeVersion" -ForegroundColor Green
}

# 安装 Vercel CLI
Write-Host "正在安装 Vercel CLI..." -ForegroundColor Green
npm install -g vercel
if ($LASTEXITCODE -ne 0) {
    Write-Host "Vercel CLI 安装失败！" -ForegroundColor Red
    Write-Host "请检查网络连接后重试。" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

# 登录 Vercel
Write-Host "准备登录 Vercel..." -ForegroundColor Green
Write-Host "即将打开浏览器进行登录，请在浏览器中完成登录过程。" -ForegroundColor Yellow
vercel login
if ($LASTEXITCODE -ne 0) {
    Write-Host "Vercel 登录失败！" -ForegroundColor Red
    Write-Host "请确保您有稳定的网络连接并重试。" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

# 部署项目
Write-Host "正在部署项目..." -ForegroundColor Green
vercel --prod
if ($LASTEXITCODE -ne 0) {
    Write-Host "项目部署失败！" -ForegroundColor Red
    Write-Host "请检查错误信息并重试。" -ForegroundColor Red
} else {
    Write-Host "项目部署成功！" -ForegroundColor Green
}

# 等待用户确认
Write-Host "`n部署过程完成！" -ForegroundColor Green
Read-Host "按回车键退出"
