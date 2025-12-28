import React from 'react'
import clsx from 'clsx'

const stepsOrder = [
  { key: 'fetching', label: 'Fetching repository' },
  { key: 'reading', label: 'Reading files' },
  { key: 'chunking', label: 'Chunking code' },
  { key: 'embeddings', label: 'Generating embeddings' },
  { key: 'storing', label: 'Storing vectors' },
]

export default function ProgressSteps({ steps = {}, progress = 0 }) {
  return (
    <div className="w-full">
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-6">
        <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {stepsOrder.map((s, idx) => {
          const done = !!steps[s.key]
          return (
            <div key={s.key} className={clsx(
              'p-3 rounded-lg border flex items-center gap-2',
              done ? 'border-accent/40 bg-accent/10' : 'border-white/10 bg-white/5'
            )}>
              <div className={clsx('w-2.5 h-2.5 rounded-full', done ? 'bg-accent' : 'bg-white/20')} />
              <span className={clsx('text-sm', done ? 'text-white' : 'text-gray-300')}>{idx + 1}. {s.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
