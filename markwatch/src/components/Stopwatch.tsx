import React, { useEffect } from 'react'
import './Stopwatch.css'

interface StopwatchProps {
  topic: string
  remainingMs: number
  progress: number
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

const Stopwatch: React.FC<StopwatchProps> = ({
  topic,
  remainingMs,
  progress,
  isRunning,
  onStart,
  onPause,
  onReset,
}) => {
  const totalSeconds = Math.floor(remainingMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const milliseconds = Math.floor((remainingMs % 1000) / 10)

  const rotation = progress * 360

  const getStatusColor = () => {
    if (remainingMs <= 0) return '#ef4444' // red
    if (remainingMs <= 5000) return '#ef4444' // red at 5s for mobile
    if (remainingMs <= 15000) return '#f59e0b' // yellow
    return '#06b6d4' // cyan
  }

  const getMobileStatusColor = () => {
    if (remainingMs <= 0) return '#ef4444' // red
    if (remainingMs <= 5000) return '#ef4444' // red at 5s
    if (remainingMs <= 15000) return '#f59e0b' // yellow at 15s
    return '#10b981' // green for mobile
  }

  const statusColor = getStatusColor()
  const mobileColor = getMobileStatusColor()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle keys when not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault()
          if (isRunning) {
            onPause()
          } else {
            onStart()
          }
          break
        case 'r':
          e.preventDefault()
          onReset()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isRunning, onStart, onPause, onReset])

  return (
    <div className="stopwatch-container">
      {/* Mobile Pie Chart View */}
      <div className="mobile-pie-view">
        <div className="topic-display-mobile">
          <h2 className="topic-text-mobile">{topic}</h2>
        </div>
        
        <svg className="pie-chart" viewBox="0 0 120 120">
          <defs>
            {/* Define a mask for the countdown effect */}
            <mask id="pieMask">
              <circle cx="60" cy="60" r="60" fill="white" />
              {/* This path will reveal the pie as it counts down */}
              <path
                d={`
                  M 60 60
                  L 60 5
                  A 55 55 0 ${progress > 0.5 ? 1 : 0} 1 
                  ${60 + 55 * Math.sin(progress * 2 * Math.PI)} 
                  ${60 - 55 * Math.cos(progress * 2 * Math.PI)}
                  Z
                `}
                fill="black"
              />
            </mask>
          </defs>
          
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="rgba(255, 255, 255, 0.05)"
          />
          
          {/* Animated filled pie segment - shrinks as time passes */}
          <circle
            cx="60"
            cy="60"
            r="55"
            fill={mobileColor}
            mask="url(#pieMask)"
            className="pie-segment"
            style={{
              filter: remainingMs <= 5000 ? `drop-shadow(0 0 8px ${mobileColor})` : 'none',
              transition: 'fill 0.3s ease',
            }}
          />
          
          {/* Center text */}
          <text
            x="60"
            y="56"
            textAnchor="middle"
            className="pie-time"
            fill="#fff"
            style={{ fontSize: '18px', fontWeight: 'bold' }}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </text>
          <text
            x="60"
            y="70"
            textAnchor="middle"
            className="pie-ms"
            fill="#fff"
            style={{ fontSize: '12px', opacity: 0.7 }}
          >
            .{String(milliseconds).padStart(2, '0')}
          </text>
        </svg>

        <div className="mobile-controls">
          <button 
            onClick={!isRunning ? onStart : onPause} 
            className="mobile-control-btn mobile-main-btn"
            title={!isRunning ? "Space to start" : "Space to pause"}
          >
            {!isRunning ? '▶' : '⏸'}
          </button>
          <button 
            onClick={onReset} 
            className="mobile-control-btn mobile-reset-btn"
            title="R to reset"
          >
            ↻
          </button>
        </div>
        
        <div className="keyboard-hints">
          Space: Play/Pause • R: Reset
        </div>
      </div>

      {/* Desktop Analog Watch View */}
      <div className="desktop-watch-view">
        <div className="topic-display">
          <h1 className="topic-text">{topic}</h1>
        </div>

        <div className="stopwatch">
        {/* Outer bezel ring */}
        <div className="stopwatch-bezel">
          {/* Progress ring */}
          <svg className="progress-ring" viewBox="0 0 400 400">
            <circle
              cx="200"
              cy="200"
              r="190"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="4"
            />
            <circle
              cx="200"
              cy="200"
              r="190"
              fill="none"
              stroke={statusColor}
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 190}`}
              strokeDashoffset={`${2 * Math.PI * 190 * (1 - progress)}`}
              strokeLinecap="round"
              transform="rotate(-90 200 200)"
              style={{
                transition: remainingMs <= 0 ? 'none' : 'stroke 0.3s ease',
                filter: remainingMs <= 0 ? 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.8))' : 'none',
              }}
            />
          </svg>

          {/* Clock face */}
          <div className="stopwatch-face">
            {/* Hour markers */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180)
              const x = 50 + 42 * Math.cos(angle)
              const y = 50 + 42 * Math.sin(angle)
              return (
                <div
                  key={i}
                  className="hour-marker"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                >
                  <div className="marker-dot" />
                </div>
              )
            })}

            {/* Minute markers */}
            {[...Array(60)].map((_, i) => {
              if (i % 5 === 0) return null
              const angle = (i * 6 - 90) * (Math.PI / 180)
              const x = 50 + 44 * Math.cos(angle)
              const y = 50 + 44 * Math.sin(angle)
              return (
                <div
                  key={i}
                  className="minute-marker"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                />
              )
            })}

            {/* Digital time display */}
            <div className="digital-display">
              <div className="digital-time" style={{ color: statusColor }}>
                {String(minutes).padStart(2, '0')}:
                {String(seconds).padStart(2, '0')}.
                <span className="milliseconds">{String(milliseconds).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Second hand */}
            <div
              className="hand second-hand"
              style={{
                transform: `rotate(${rotation}deg)`,
                backgroundColor: statusColor,
                boxShadow: remainingMs <= 0 ? `0 0 20px ${statusColor}` : 'none',
              }}
            >
              <div className="hand-tip" style={{ backgroundColor: statusColor }} />
            </div>

            {/* Center dot */}
            <div className="center-dot" style={{ backgroundColor: statusColor }} />
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Stopwatch
