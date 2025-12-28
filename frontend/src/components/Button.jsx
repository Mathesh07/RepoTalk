import React from 'react'
import clsx from 'clsx'

export default function Button({ children, className, variant = 'primary', size = 'md', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-accent hover:bg-accent/90 text-white shadow-soft',
    ghost: 'bg-white/5 hover:bg-white/10 text-white',
    outline: 'border border-white/10 hover:bg-white/5 text-white',
  }
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  }
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}
