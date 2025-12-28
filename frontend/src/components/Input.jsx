import React from 'react'
import clsx from 'clsx'

export default function Input({ className, leftIcon, rightIcon, ...props }) {
  return (
    <div className={clsx('relative group', className)}>
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {leftIcon}
        </div>
      )}
      <input
        className={clsx(
          'w-full h-12 bg-black/80 border border-white/10 rounded-lg outline-none',
          'text-white placeholder:text-gray-400',
          'pl-3 pr-3',
          leftIcon && 'pl-12',
          rightIcon && 'pr-10',
          'focus:ring-0 focus:border-accent'
        )}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {rightIcon}
        </div>
      )}
    </div>
  )
}
