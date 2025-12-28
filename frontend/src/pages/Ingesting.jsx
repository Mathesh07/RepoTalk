import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProgressSteps from '../components/ProgressSteps'
import Button from '../components/Button'
import { getIngestionStatus } from '../api/client'

export default function Ingesting() {
  const { repoId } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('queued')
  const [steps, setSteps] = useState({})
  const [progress, setProgress] = useState(0)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const title = useMemo(() => (name ? `Ingesting ${name}` : 'Ingesting repository'), [name])

  useEffect(() => {
    let mounted = true
    let timer

    async function poll() {
      try {
        const data = await getIngestionStatus(repoId)
        if (!mounted) return
        setStatus(data.status)
        setSteps(data.steps)
        setProgress(data.progress)
        setName(data.name)

        if (data.status === 'completed') {
          setTimeout(() => navigate(`/chat/${repoId}`), 600)
        } else if (data.status === 'failed') {
          setError('Ingestion failed. Please go back and try again.')
        } else {
          timer = setTimeout(poll, 900)
        }
      } catch (e) {
        if (!mounted) return
        setError(e?.message || 'Failed to get status')
        timer = setTimeout(poll, 1500)
      }
    }

    poll()
    return () => {
      mounted = false
      if (timer) clearTimeout(timer)
    }
  }, [repoId, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl p-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-gray-400">RepoTalk</div>
              <h2 className="text-2xl font-semibold">{title}</h2>
            </div>
            <GitHubIcon />
          </div>

          <ProgressSteps steps={steps} progress={progress} />

          <div className="mt-6 text-sm text-gray-400">
            Status: <span className="text-white/90 font-medium">{status}</span>
          </div>

          {error && (
            <div className="mt-4 p-3 border border-red-500/30 bg-red-500/10 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/')}>Back</Button>
            {status === 'completed' && (
              <Button onClick={() => navigate(`/chat/${repoId}`)}>Open Chat</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function GitHubIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 .5a11.5 11.5 0 0 0-3.634 22.415c.574.107.785-.249.785-.555 0-.274-.01-1-.016-1.962-3.19.694-3.863-1.538-3.863-1.538-.522-1.327-1.275-1.68-1.275-1.68-1.042-.713.078-.699.078-.699 1.153.081 1.76 1.184 1.76 1.184 1.025 1.757 2.69 1.25 3.344.956.104-.743.401-1.25.73-1.538-2.548-.29-5.223-1.274-5.223-5.67 0-1.252.45-2.276 1.184-3.078-.119-.289-.513-1.454.112-3.03 0 0 .966-.31 3.168 1.176a10.96 10.96 0 0 1 5.767 0c2.2-1.486 3.166-1.176 3.166-1.176.627 1.576.233 2.741.114 3.03.737.802 1.183 1.826 1.183 3.078 0 4.407-2.68 5.377-5.235 5.662.41.354.777 1.05.777 2.118 0 1.531-.014 2.766-.014 3.143 0 .308.207.667.79.553A11.501 11.501 0 0 0 12 .5Z"/>
    </svg>
  )
}
