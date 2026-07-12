import { spawn } from 'child_process'
import { createServer } from 'net'

const port = process.argv[2] || 5175

const proc = spawn('npx.cmd', ['localtunnel', '--port', String(port), '--subdomain', 'xinli-therapy'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true,
  timeout: 5000,
})

proc.stdout.on('data', d => {
  const text = d.toString()
  const m = text.match(/https:\/\/[^\s]+\.loca\.lt/)
  if (m) console.log('TUNNEL_URL=' + m[0])
  process.stdout.write(text)
})

proc.stderr.on('data', d => process.stdout.write(d.toString()))
proc.on('error', e => console.log('err:', e.message))
proc.on('exit', c => console.log('exit:', c))
