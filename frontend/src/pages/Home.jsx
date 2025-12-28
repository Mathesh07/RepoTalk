import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import Input from '../components/Input'
import Button from '../components/Button'
import { startIngestion } from '../api/client'
import DarkVeil from '../components/DarkVeil'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const trimmed = url.trim()
    if (!/^https?:\/\/(www\.)?github\.com\/.+\/.+/.test(trimmed)) {
      setError('Please enter a valid GitHub repository URL, e.g., https://github.com/owner/repo')
      return
    }
    setLoading(true)
    try {
      const { repoId } = await startIngestion(trimmed)
      navigate(`/ingesting/${repoId}`)
    } catch (err) {
      setError(err?.message || 'Failed to start ingestion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <DarkVeil />
      </div>
      <div className="absolute inset-0 pointer-events-none bg-glow" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.12),transparent_35%)]" />

      <div className="relative w-full max-w-3xl mx-auto p-6">
        <div className="flex justify-center mb-8">
          <Logo size={32} />
        </div>

        <div className="relative z-10 rounded-2xl border border-white/10 bg-black/80 shadow-soft p-8 backdrop-blur">
          <h1 className="text-4xl font-semibold tracking-tight text-center">Chat with any GitHub repository</h1>
          <p className="text-center text-gray-300 mt-3">Paste a GitHub link.</p>

          <form onSubmit={onSubmit} className="mt-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Paste GitHub link..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  leftIcon={<GitHubIcon />}
                />
              </div>
              <Button type="submit" size="lg" className="shrink-0" disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Repository'}
              </Button>
            </div>
            {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
          </form>
        </div>

        <div className="relative z-10 text-center text-sm text-gray-400 mt-6">No authentication required. Built for engineers and code explorers.</div>
      </div>
    </div>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 .5a11.5 11.5 0 0 0-3.634 22.415c.574.107.785-.249.785-.555 0-.274-.01-1-.016-1.962-3.19.694-3.863-1.538-3.863-1.538-.522-1.327-1.275-1.68-1.275-1.68-1.042-.713.078-.699.078-.699 1.153.081 1.76 1.184 1.76 1.184 1.025 1.757 2.69 1.25 3.344.956.104-.743.401-1.25.73-1.538-2.548-.29-5.223-1.274-5.223-5.67 0-1.252.45-2.276 1.184-3.078-.119-.289-.513-1.454.112-3.03 0 0 .966-.31 3.168 1.176a10.96 10.96 0 0 1 5.767 0c2.2-1.486 3.166-1.176 3.166-1.176.627 1.576.233 2.741.114 3.03.737.802 1.183 1.826 1.183 3.078 0 4.407-2.68 5.377-5.235 5.662.41.354.777 1.05.777 2.118 0 1.531-.014 2.766-.014 3.143 0 .308.207.667.79.553A11.501 11.501 0 0 0 12 .5Z"/>
    </svg>
  )
}
