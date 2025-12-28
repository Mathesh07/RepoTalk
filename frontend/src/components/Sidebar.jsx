import React from 'react'
import Button from './Button'

export default function Sidebar({ meta, onQuickPrompt }) {
  const prompts = [
    'Explain this repository',
    'How does authentication work?',
    'Find main business logic',
    'How to run this project?',
    'Are there tests?'
  ]

  return (
    <aside className="w-full md:w-80 shrink-0 border-r border-white/10 bg-white/[0.03]">
      <div className="p-5">
        <div className="mb-5">
          <div className="text-sm text-gray-400 mb-1">Repository</div>
          <div className="text-lg font-semibold">{meta?.name || 'Repository'}</div>
          <div className="text-xs text-gray-400 mt-1">{meta?.url}</div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-6">
          <MetaPill label="Branch" value={meta?.branch || 'main'} />
          <MetaPill label="Language" value={meta?.language || '—'} />
          <MetaPill label="Files" value={meta?.files ?? '—'} />
        </div>
        <div>
          <div className="text-sm font-medium mb-2">Smart prompts</div>
          <div className="space-y-2">
            {prompts.map((p) => (
              <Button key={p} variant="ghost" className="w-full justify-start" onClick={() => onQuickPrompt?.(p)}>
                {p}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

function MetaPill({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  )
}
