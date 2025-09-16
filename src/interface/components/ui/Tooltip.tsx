import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/shared/utils/cn'

interface TooltipProps {
  children: React.ReactNode
  content: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

export function Tooltip({ 
  children, 
  content, 
  side = 'top', 
  delay = 300,
  className 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current && tooltipRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect()
        const tooltipRect = tooltipRef.current.getBoundingClientRect()
        
        let top = 0
        let left = 0
        
        switch (side) {
          case 'top':
            top = triggerRect.top - tooltipRect.height - 8
            left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
            break
          case 'bottom':
            top = triggerRect.bottom + 8
            left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
            break
          case 'left':
            top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
            left = triggerRect.left - tooltipRect.width - 8
            break
          case 'right':
            top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
            left = triggerRect.right + 8
            break
        }
        
        setPosition({ top, left })
        setIsVisible(true)
      }
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg pointer-events-none',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            className
          )}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {content}
          <div
            className={cn(
              'absolute w-2 h-2 bg-gray-900 rotate-45',
              side === 'top' && 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2',
              side === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2',
              side === 'left' && 'left-full top-1/2 -translate-y-1/2 -translate-x-1/2',
              side === 'right' && 'right-full top-1/2 -translate-y-1/2 translate-x-1/2'
            )}
          />
        </div>
      )}
    </div>
  )
}
