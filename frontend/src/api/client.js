import axios from 'axios'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: apiBase,
  timeout: 20000,
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (!error.response) {
      throw error
    }
    throw error
  }
)

// ---- Mock layer (used if backend not available) ----
// Default to true, but allow disabling with VITE_USE_MOCK="false"
const useMock = false

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function saveLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function readLocal(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key))
    return v ?? fallback
  } catch {
    return fallback
  }
}

// Mock DB
const DB = {
  repos: readLocal('mock_repos', {}),
  chats: readLocal('mock_chats', {}),
}

function commit() {
  saveLocal('mock_repos', DB.repos)
  saveLocal('mock_chats', DB.chats)
}

async function mockStartIngestion(url) {
  await sleep(600)
  const id = uid()
  const name = url.split('/').slice(-1)[0] || 'repository'
  DB.repos[id] = {
    url,
    name,
    branch: 'main',
    language: ['JavaScript', 'TypeScript', 'Python'][Math.floor(Math.random() * 3)],
    files: 0,
    status: 'queued',
    steps: {
      fetching: false,
      reading: false,
      chunking: false,
      embeddings: false,
      storing: false,
    },
  }
  DB.chats[id] = []
  commit()
  simulateIngestion(id)
  return { repoId: id }
}

async function simulateIngestion(repoId) {
  const s = ['fetching', 'reading', 'chunking', 'embeddings', 'storing']
  DB.repos[repoId].status = 'running'
  commit()
  for (const step of s) {
    await sleep(900)
    DB.repos[repoId].steps[step] = true
    if (step === 'reading') DB.repos[repoId].files = 142
    commit()
  }
  DB.repos[repoId].status = 'completed'
  commit()
}

async function mockGetIngestionStatus(repoId) {
  await sleep(350)
  const repo = DB.repos[repoId]
  if (!repo) throw new Error('Repo not found')
  const stepOrder = ['fetching', 'reading', 'chunking', 'embeddings', 'storing']
  const completed = stepOrder.filter((k) => repo.steps[k]).length
  const progress = Math.round((completed / stepOrder.length) * 100)
  return { status: repo.status, steps: repo.steps, progress, name: repo.name }
}

async function mockGetRepoMeta(repoId) {
  await sleep(250)
  const r = DB.repos[repoId]
  if (!r) throw new Error('Repo not found')
  return {
    name: r.name,
    branch: r.branch,
    language: r.language,
    files: r.files || 0,
    url: r.url,
  }
}

async function mockSendMessage(repoId, content) {
  await sleep(450)
  const id = uid()
  DB.chats[repoId] ||= []
  DB.chats[repoId].push({ id: uid(), role: 'user', content })
  const canned = generateAIResponse(content)
  const msg = {
    id,
    role: 'assistant',
    content: canned.text,
    sources: canned.sources,
  }
  DB.chats[repoId].push(msg)
  commit()
  return msg
}

function generateAIResponse(input) {
  const sources = [
    { file: 'src/auth/index.ts', lines: [12, 84] },
    { file: 'src/core/service/userService.js', lines: [33, 77] },
  ]
  const text = `**Summary**\n\n${
    input.toLowerCase().includes('test')
      ? 'The repository contains unit tests under the tests/ directory using Jest.'
      : 'This repository is structured with a clear separation of concerns and a conventional service layer.'
  }\n\n\n\n\n\n` +
  '```js\n// sample\nfunction hello(){ console.log("Hello from RepoTalk"); }\n```\n\n' +
  'You can navigate to the files for more details.'
  return { text, sources }
}

async function mockGetMessages(repoId) {
  await sleep(200)
  return DB.chats[repoId] || []
}

export async function startIngestion(url) {
  if (!useMock) {
    // Backend expects { repo_url } and returns { repo_id }
    const { data } = await api.post('/repo/ingest', { repo_url: url })
    // Normalize to frontend shape
    return { repoId: data.repo_id }
  }
  return mockStartIngestion(url)
}

export async function getIngestionStatus(repoId) {
  if (!useMock) {
    // The backend currently doesn't expose a status endpoint.
    // Return an immediate-complete status so the UI redirects to chat.
    return {
      status: 'completed',
      steps: {
        fetching: true,
        reading: true,
        chunking: true,
        embeddings: true,
        storing: true,
      },
      progress: 100,
      name: `repo-${repoId}`,
    }
  }
  return mockGetIngestionStatus(repoId)
}

export async function getRepoMeta(repoId) {
  if (!useMock) {
    // No meta endpoint in backend; try to read from local mock DB for display only.
    try {
      const repos = JSON.parse(localStorage.getItem('mock_repos') || '{}')
      const r = repos[repoId]
      if (r) {
        return { name: r.name, branch: r.branch, language: r.language, files: r.files || 0, url: r.url }
      }
    } catch {}
    return { name: `repo-${repoId}`, branch: 'main', language: '—', files: 0, url: '' }
  }
  return mockGetRepoMeta(repoId)
}

export async function sendMessage(repoId, content) {
  if (!useMock) {
    // Backend expects { repo_id, question } and returns { answer }
    const { data } = await api.post('/chat', { repo_id: repoId, question: content })
    // Normalize into chat message shape used by UI
    return { id: `${Date.now()}`, role: 'assistant', content: data.answer, sources: [] }
  }
  return mockSendMessage(repoId, content)
}

export async function getMessages(repoId) {
  if (!useMock) {
    // No messages history endpoint; start with empty history.
    return []
  }
  return mockGetMessages(repoId)
}
