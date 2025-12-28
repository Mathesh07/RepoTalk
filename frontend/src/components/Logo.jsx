import React from 'react'

export default function Logo({ size = 28 }) {
  return (
    <div className="inline-flex items-center gap-2 select-none">
      <div className="relative">
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7c3aed"/>
              <stop offset="100%" stopColor="#3b82f6"/>
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#g)"/>
          <path d="M7 12h10M7 8h6M7 16h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
      <span className="text-xl font-semibold tracking-tight">RepoTalk</span>
    </div>
  )
}
