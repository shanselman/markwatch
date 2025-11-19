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
  remainingMs: number
  progress: number
  totalDuration: number
  shrinkMode?: boolean
}

function PresenterApp() {
  const [state, setState] = React.useState<TimerState>({
    topic: 'Loading...',
    remainingMs: 0,
    progress: 0,
    totalDuration: 90,
    shrinkMode: true
  })

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'TIMER_UPDATE') {
        const payload = event.data.payload
        setState({
          topic: payload.topic,
          remainingMs: payload.remainingMs,
          progress: payload.progress,
          totalDuration: payload.totalDuration,
          shrinkMode: payload.shrinkMode ?? true
        })
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
      remainingMs={state.remainingMs}
      progress={state.progress}
      totalDuration={state.totalDuration}
      shrinkMode={state.shrinkMode}
    />
  )
}

ReactDOM.createRoot(document.getElementById('presenter-root')!).render(
  <React.StrictMode>
    <PresenterApp />
  </React.StrictMode>,
)
