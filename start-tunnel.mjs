import localtunnel from 'localtunnel'
import fs from 'fs'
import path from 'path'

const tunnel = await localtunnel({ port: 5175, subdomain: 'xinli-cc' })
const url = tunnel.url
const outPath = path.join(process.cwd(), 'tunnel-url.txt')
fs.writeFileSync(outPath, url)
console.log('TUNNEL_URL=' + url)
