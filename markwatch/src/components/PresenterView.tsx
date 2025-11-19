import './PresenterView.css'

interface PresenterViewProps {
  topic: string
  remainingMs: number
  progress: number
  totalDuration: number
  shrinkMode?: boolean
}

const PresenterView: React.FC<PresenterViewProps> = ({ 
  topic, 
  remainingMs, 
  progress,
  shrinkMode = true
}) => {
  const minutes = Math.floor(remainingMs / 60000)
  const seconds = Math.floor((remainingMs % 60000) / 1000)
  const milliseconds = Math.floor((remainingMs % 1000) / 10)

  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`

  const rotation = progress * 360
  const circumference = 2 * Math.PI * 230
  const strokeDashoffset = shrinkMode 
    ? circumference * progress 
    : circumference * (1 - progress)

  const isExpired = remainingMs <= 0
  const isRed = remainingMs <= 5000
  const isWarning = remainingMs <= 15000 && remainingMs > 5000

  const maskBaseFill = shrinkMode ? 'white' : 'black'
  const maskPathFill = shrinkMode ? 'black' : 'white'

  let color = '#06b6d4' // cyan
  if (isExpired || isRed) {
    color = '#ef4444' // red at 5s and below
  } else if (isWarning) {
    color = '#f59e0b' // yellow at 15s-5s
  }

  return (
    <div className="presenter-view">
      <div className="presenter-topic">{topic}</div>
      
      <div 
        className={`presenter-clock-container ${(isExpired || isRed) ? 'glow' : ''}`}
        style={{ color }}
      >
        <svg className="presenter-progress-ring" viewBox="0 0 500 500">
          <defs>
            <mask id="pie-mask">
              <rect width="500" height="500" fill="black" />
              <circle cx="250" cy="250" r="245" fill={maskBaseFill} />
              {progress < 1 && (
                <path
                  d={`M 250 250 L 250 5 A 245 245 0 ${progress > 0.5 ? 1 : 0} 1 ${
                    250 + 245 * Math.sin(progress * 2 * Math.PI)
                  } ${
                    250 - 245 * Math.cos(progress * 2 * Math.PI)
                  } Z`}
                  fill={maskPathFill}
                />
              )}
              {progress >= 1 && (
                <circle cx="250" cy="250" r="245" fill={maskPathFill} />
              )}
            </mask>
          </defs>
          
          {/* Background circle for small screens (solid dark) */}
          <circle
            cx="250"
            cy="250"
            r="245"
            fill="#1a1a2a"
            className="presenter-pie-background"
          />
          
          {/* Background ring for large screens */}
          <circle
            cx="250"
            cy="250"
            r="230"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            className="presenter-ring-background"
          />
          
          {/* Progress ring for large screens */}
          <circle
            cx="250"
            cy="250"
            r="230"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="presenter-progress-stroke"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '250px 250px',
              transition: 'stroke 0.3s ease, stroke-dashoffset 0.1s linear'
            }}
          />
          
          {/* Filled pie for small screens */}
          <circle
            cx="250"
            cy="250"
            r="245"
            fill={color}
            mask="url(#pie-mask)"
            className="presenter-pie-fill"
            style={{
              transition: 'fill 0.3s ease'
            }}
          />
        </svg>

        <div className="presenter-clock-face">
          <div className="presenter-clock-bezel">
            {[...Array(60)].map((_, i) => {
              const isHourMarker = i % 5 === 0
              return (
                <div
                  key={i}
                  className={`presenter-marker ${isHourMarker ? 'hour-marker' : 'minute-marker'}`}
                  style={{
                    transform: `rotate(${i * 6}deg) translateY(-48%)`
                  }}
                />
              )
            })}

            <div
              className={`presenter-second-hand ${(isExpired || isRed) ? 'glow' : ''}`}
              style={{
                transform: `rotate(${rotation}deg)`,
                backgroundColor: color
              }}
            />
            <div 
              className={`presenter-center-dot ${(isExpired || isRed) ? 'glow' : ''}`}
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
        
        <div 
          className={`presenter-time presenter-time-overlay ${isExpired ? 'expired' : isRed ? 'expired' : isWarning ? 'warning' : ''}`}
          style={{ color }}
        >
          {timeString}
        </div>
      </div>
    </div>
  )
}

export default PresenterView
