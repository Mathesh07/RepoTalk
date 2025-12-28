import React, { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [message])

  return (
    <div ref={ref} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl rounded-2xl p-4 border ${isUser ? 'bg-accent/20 border-accent/30' : 'bg-white/5 border-white/10'} shadow-soft`}
           style={{ borderTopLeftRadius: isUser ? 16 : 6, borderTopRightRadius: isUser ? 6 : 16 }}>
        {isUser ? (
          <div className="text-sm leading-relaxed">{message.content}</div>
        ) : (
          <div className="prose prose-invert container-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {message.content}
            </ReactMarkdown>
            {message.sources?.length ? (
              <div className="mt-3 border-t border-white/10 pt-2">
                <div className="text-xs text-gray-400 mb-1">Sources</div>
                <ul className="space-y-1">
                  {message.sources.map((s, i) => (
                    <li key={i} className="text-xs text-gray-300">
                      <span className="inline-flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-80"><path d="M12 20l9-16H3l9 16z" stroke="currentColor" strokeWidth="1.5"/></svg>
                        <span>{s.file}</span>
                        {s.lines && <span className="text-gray-400">({s.lines[0]}–{s.lines[1]})</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
