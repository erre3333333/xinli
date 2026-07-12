import initSqlJs from 'sql.js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, 'src', 'data', 'therapy.db')

async function main() {
  const SQL = await initSqlJs({
    locateFile: file => join(__dirname, 'src', 'data', file)
  })
  const buffer = readFileSync(dbPath)
  const db = new SQL.Database(buffer)

  console.log('=== users ===')
  const users = db.exec('SELECT id, username, name, created_at FROM users')
  for (const r of users) {
    for (const row of r.values) {
      console.log(`  id=${row[0]} username=${row[1]} name=${row[2]} created_at=${row[3]}`)
    }
  }

  console.log('\n=== medical_records ===')
  const records = db.exec('SELECT id, user_id, record_type, title, doctor_type, created_at, substr(content,1,60) as preview FROM medical_records ORDER BY created_at DESC')
  for (const r of records) {
    for (const row of r.values) {
      console.log(`  id=${row[0]} user=${row[1]} type=${row[2]} title=${row[3]} doctor=${row[4]} time=${row[5]} preview=${row[6]}`)
    }
  }

  db.close()
}

main().catch(e => console.error(e))
