import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import ChatMessage from '../components/ChatMessage'
import MessageInput from '../components/MessageInput'
import Button from '../components/Button'
import { getRepoMeta, getMessages, sendMessage } from '../api/client'

export default function Chat() {
  const { repoId } = useParams()
  const navigate = useNavigate()
  const [meta, setMeta] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [m, msgs] = await Promise.all([getRepoMeta(repoId), getMessages(repoId)])
        if (!mounted) return
        setMeta(m)
        setMessages(msgs)
      } catch (e) {
        if (!mounted) return
        setError(e?.message || 'Failed to load chat')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [repoId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const handleSend = async (text) => {
    setError('')
    const userMsg = { id: `${Date.now()}`, role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setSending(true)
    try {
      const aiMsg = await sendMessage(repoId, text)
      setMessages((prev) => [...prev, aiMsg])
    } catch (e) {
      setError(e?.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const onQuickPrompt = (p) => handleSend(p)

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-gray-300">Loading chat…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar meta={meta} onQuickPrompt={onQuickPrompt} />

      <main className="flex-1 flex flex-col">
        <div className="border-b border-white/10 bg-white/[0.02]">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Chatting with</div>
              <div className="text-lg font-semibold">{meta?.name}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate(`/ingesting/${repoId}`)}>Re-ingest</Button>
              <Button variant="outline" onClick={() => navigate('/')}>New chat</Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
            {messages.length === 0 && (
              <EmptyState onQuickPrompt={onQuickPrompt} />
            )}
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            <div ref={endRef} />
          </div>
        </div>

        {error && (
          <div className="max-w-5xl mx-auto w-full px-4">
            <div className="mb-2 text-sm text-red-300">{error}</div>
          </div>
        )}

        <MessageInput onSend={handleSend} disabled={sending} />
      </main>
    </div>
  )
}

function EmptyState({ onQuickPrompt }) {
  const hints = [
    'Explain this repository',
    'How does authentication work?',
    'Find main business logic',
    'How to run this project?',
    'Are there tests?'
  ]
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
      <h3 className="text-xl font-semibold">Ask anything about this repo</h3>
      <p className="text-gray-300 mt-2">Use the smart prompts below to get started.</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {hints.map((h) => (
          <button key={h} onClick={() => onQuickPrompt(h)} className="text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition">
            {h}
          </button>
        ))}
      </div>
    </div>
  )
}
