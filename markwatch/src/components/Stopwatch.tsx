import React from 'react'
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

  return (
    <div className="stopwatch-container">
      {/* Mobile Pie Chart View */}
      <div className="mobile-pie-view">
        <div className="topic-display-mobile">
          <h2 className="topic-text-mobile">{topic}</h2>
        </div>
        
        <svg className="pie-chart" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="20"
          />
          
          {/* Animated pie segment */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={mobileColor}
            strokeWidth="20"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (progress)}`}
            strokeLinecap="butt"
            transform="rotate(-90 100 100)"
            className="pie-segment"
            style={{
              filter: remainingMs <= 5000 ? `drop-shadow(0 0 10px ${mobileColor})` : 'none',
            }}
          />
          
          {/* Center text */}
          <text
            x="100"
            y="95"
            textAnchor="middle"
            className="pie-time"
            fill={mobileColor}
            style={{ fontSize: '28px', fontWeight: 'bold' }}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </text>
          <text
            x="100"
            y="115"
            textAnchor="middle"
            className="pie-ms"
            fill={mobileColor}
            style={{ fontSize: '16px', opacity: 0.8 }}
          >
            .{String(milliseconds).padStart(2, '0')}
          </text>
        </svg>

        <div className="mobile-controls">
          {!isRunning ? (
            <button onClick={onStart} className="mobile-control-btn mobile-start-btn">
              ▶ Start
            </button>
          ) : (
            <button onClick={onPause} className="mobile-control-btn mobile-pause-btn">
              ⏸ Pause
            </button>
          )}
          <button onClick={onReset} className="mobile-control-btn mobile-reset-btn">
            ↻ Reset
          </button>
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

      {/* Desktop Controls */}
      <div className="controls desktop-controls">
        {!isRunning ? (
          <button onClick={onStart} className="control-btn start-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
            Start
          </button>
        ) : (
          <button onClick={onPause} className="control-btn pause-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="6" y="5" width="4" height="14" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" fill="currentColor" />
            </svg>
            Pause
          </button>
        )}
        <button onClick={onReset} className="control-btn reset-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16" />
          </svg>
          Reset
        </button>
      </div>
      </div>
    </div>
  )
}

export default Stopwatch
