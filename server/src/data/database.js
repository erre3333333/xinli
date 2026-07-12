import initSqlJs from 'sql.js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, 'therapy.db')

let db = null

export async function initDb() {
  const SQL = await initSqlJs({
    locateFile: file => join(__dirname, file)
  })

  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      avatar TEXT DEFAULT '',
      plan TEXT NOT NULL DEFAULT 'free',
      plan_expires_at TEXT,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS medical_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      record_type TEXT NOT NULL DEFAULT 'diagnosis',
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      summary TEXT DEFAULT '',
      doctor_type TEXT DEFAULT '',
      session_data TEXT DEFAULT '{}',
      created_at TEXT DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS daily_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      identifier TEXT NOT NULL,
      identifier_type TEXT NOT NULL DEFAULT 'ip',
      date TEXT NOT NULL DEFAULT (date('now','localtime')),
      count INTEGER NOT NULL DEFAULT 0
    )
  `)

  db.run(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_usage
    ON daily_usage(identifier, identifier_type, date)
  `)

  try {
    db.run("ALTER TABLE users ADD COLUMN plan TEXT NOT NULL DEFAULT 'free'")
  } catch {}
  try {
    db.run('ALTER TABLE users ADD COLUMN plan_expires_at TEXT')
  } catch {}

  saveDb()
  return db
}

export function getDb() {
  return db
}

export function saveDb() {
  if (!db) return
  const data = db.export()
  const buffer = Buffer.from(data)
  writeFileSync(DB_PATH, buffer)
}

export function closeDb() {
  if (db) { saveDb(); db.close(); db = null }
}
