import React, { useState } from 'react'
import Button from './Button'

export default function MessageInput({ onSend, disabled }) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    const text = value.trim()
    if (!text) return
    onSend?.(text)
    setValue('')
  }

  const onKey = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-full border-t border-white/10 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
      <div className="mx-auto max-w-5xl px-4 py-3">
        <div className="flex items-end gap-3">
          <textarea
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            placeholder="Ask about this repository..."
            className="flex-1 resize-none rounded-lg border border-white/10 bg-white/5 p-3 text-white placeholder:text-gray-400 focus:border-accent/40 focus:ring-2 focus:ring-accent/30"
            style={{ minHeight: 48, maxHeight: 160 }}
            disabled={disabled}
          />
          <Button onClick={handleSend} disabled={disabled || !value.trim()}>
            Send
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-400">Press Ctrl/⌘ + Enter to send</div>
      </div>
    </div>
  )
}
