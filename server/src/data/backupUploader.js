import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createBackup } from './backup.js'
import { readFileSync } from 'fs'

const ORIGIN = 'https://api.github.com'

async function gh(path, method, body, token) {
  const r = await fetch(ORIGIN + path, {
    method,
    headers: {
      Authorization: 'Bearer ' + token,
      'User-Agent': 'xinli-backup',
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await r.json()
  data._status = r.status
  return data
}

export async function uploadBackupToGithub() {
  const token = process.env.GITHUB_TOKEN
  if (!token) return { error: 'GITHUB_TOKEN 未配置' }

  const b = createBackup()
  const owner = 'erre3333333'
  const repo = 'xinli'
  const tag = 'auto-backup'

  // 确保 git tag 存在
  const ref = await gh(`/repos/${owner}/${repo}/git/ref/tags/${tag}`, 'GET', null, token)
  if (ref._status === 404) {
    const main = await gh(`/repos/${owner}/${repo}/git/ref/heads/main`, 'GET', null, token)
    if (!main.object) return { error: '获取 main 分支失败' }
    const makeTag = await gh(`/repos/${owner}/${repo}/git/tags`, 'POST', {
      tag, message: 'auto backup tag', object: main.object.sha, type: 'commit',
    }, token)
    if (!makeTag.sha) return { error: '创建 tag 失败: ' + JSON.stringify(makeTag) }
    await gh(`/repos/${owner}/${repo}/git/refs`, 'POST', {
      ref: 'refs/tags/' + tag, sha: makeTag.sha,
    }, token)
  }

  // 查找或创建 release
  let release = await gh(`/repos/${owner}/${repo}/releases/tags/${tag}`, 'GET', null, token)
  if (release._status === 404) {
    release = await gh(`/repos/${owner}/${repo}/releases`, 'POST', {
      tag_name: tag, name: '数据库自动备份',
      body: '自动备份 ' + b.name, prerelease: true,
    }, token)
  }
  if (!release.id) return { error: '创建 release 失败: ' + JSON.stringify(release).substring(0,200) }

  // 删除旧 assets
  const assets = await gh(`/repos/${owner}/${repo}/releases/${release.id}/assets`, 'GET', null, token)
  if (Array.isArray(assets)) for (const a of assets) await gh(`/repos/${owner}/${repo}/releases/assets/${a.id}`, 'DELETE', null, token)

  // 上传新备份
  const content = readFileSync(b.path)
  const uploadUrl = release.upload_url.replace('{?name,label}', '') + '?name=' + encodeURIComponent(b.name)
  const resp = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token, 'User-Agent': 'xinli-backup',
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/octet-stream',
      'Content-Length': content.length,
    },
    body: content,
  })
  const result = await resp.json()

  if (!resp.ok) return { error: '上传失败: ' + JSON.stringify(result).substring(0,200) }
  return { success: true, url: result.browser_download_url, file: b.name }
}
