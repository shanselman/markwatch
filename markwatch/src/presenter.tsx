import React from 'react'
import ReactDOM from 'react-dom/client'
import PresenterView from './components/PresenterView'
import './index.css'
import './components/PresenterView.css'

// Prevent body scrolling
document.body.style.overflow = 'hidden'
document.body.style.margin = '0'
document.body.style.padding = '0'
document.documentElement.style.overflow = 'hidden'

interface TimerState {
  topic: string
  totalDuration: number
}

interface TimerDisplay {
  remainingMs: number
  progress: number
}

interface TimerControl {
  startTimeMs: number
  elapsedAtStart: number
  totalDuration: number
  isRunning: boolean
}

function PresenterApp() {
  const [state, setState] = React.useState<TimerState>({
    topic: 'Loading...',
    totalDuration: 90
  })
  
  const [display, setDisplay] = React.useState<TimerDisplay>({
    remainingMs: 0,
    progress: 0
  })
  
  const [timerControl, setTimerControl] = React.useState<TimerControl>({
    startTimeMs: 0,
    elapsedAtStart: 0,
    totalDuration: 90,
    isRunning: false
  })

  // Self-contained timer that runs independently
  React.useEffect(() => {
    if (!timerControl.isRunning) return

    let rafId: number
    const animate = () => {
      const now = performance.now()
      const elapsed = timerControl.elapsedAtStart + (now - timerControl.startTimeMs)
      const remainingMs = Math.max(0, timerControl.totalDuration * 1000 - elapsed)
      const progress = timerControl.totalDuration > 0 ? elapsed / (timerControl.totalDuration * 1000) : 0

      setDisplay({
        remainingMs,
        progress
      })

      if (elapsed < timerControl.totalDuration * 1000) {
        rafId = requestAnimationFrame(animate)
      } else {
        setTimerControl(prev => ({ ...prev, isRunning: false }))
      }
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [timerControl.isRunning, timerControl.startTimeMs, timerControl.elapsedAtStart, timerControl.totalDuration])

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'TIMER_UPDATE') {
        const payload = event.data.payload
        setState({
          topic: payload.topic,
          totalDuration: payload.totalDuration
        })
        
        // Always update display when not running
        setDisplay({
          remainingMs: payload.remainingMs,
          progress: payload.progress
        })
      } else if (event.data.type === 'TIMER_START') {
        const totalDuration = event.data.totalDuration || 90
        setTimerControl({
          startTimeMs: performance.now(),
          elapsedAtStart: event.data.elapsedMs || 0,
          totalDuration: totalDuration,
          isRunning: true
        })
      } else if (event.data.type === 'TIMER_PAUSE') {
        setTimerControl(prev => ({ ...prev, isRunning: false }))
      }
    }

    window.addEventListener('message', handleMessage)
    
    // Let the parent know we're ready
    if (window.opener) {
      window.opener.postMessage({ type: 'PRESENTER_READY' }, '*')
    }

    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <PresenterView
      topic={state.topic}
      remainingMs={display.remainingMs}
      progress={display.progress}
      totalDuration={state.totalDuration}
    />
  )
}

ReactDOM.createRoot(document.getElementById('presenter-root')!).render(
  <React.StrictMode>
    <PresenterApp />
  </React.StrictMode>,
)
