# 停止所有 node 进程
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

Start-Sleep 2

# 启动后端
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "src/index.js" -WorkingDirectory "D:\OPENCODE\cc\server"

# 启动前端
Start-Process -NoNewWindow -FilePath "npx" -ArgumentList "vite --host 0.0.0.0 --port 5175" -WorkingDirectory "D:\OPENCODE\cc\client"

Write-Output "Done."
