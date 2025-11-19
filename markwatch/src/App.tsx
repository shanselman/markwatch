import { useState, useEffect, useRef } from 'react'
import './App.css'
import Stopwatch from './components/Stopwatch'
import FileUpload from './components/FileUpload'
import type { Topic } from './types'

const STORAGE_KEY = 'markwatch_topics'
const CURRENT_INDEX_KEY = 'markwatch_current_index'

function App() {
  const [topics, setTopics] = useState<Topic[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [currentTopicIndex, setCurrentTopicIndex] = useState<number>(() => {
    const saved = localStorage.getItem(CURRENT_INDEX_KEY)
    return saved ? parseInt(saved, 10) : 0
  })
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const startTimeRef = useRef<number>(0)
  const presenterWindowRef = useRef<Window | null>(null)

  const currentTopic = topics[currentTopicIndex]
  const totalDuration = currentTopic?.duration || 90

  // Save topics to localStorage whenever they change
  useEffect(() => {
    if (topics.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(topics))
    }
  }, [topics])

  // Save current topic index to localStorage
  useEffect(() => {
    localStorage.setItem(CURRENT_INDEX_KEY, currentTopicIndex.toString())
  }, [currentTopicIndex])

  // Warn before leaving if timer is running
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isRunning])

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle keys when not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          handlePrevious()
          break
        case 'ArrowRight':
          e.preventDefault()
          handleNext()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentTopicIndex, topics.length])

  useEffect(() => {
    if (!isRunning) return

    startTimeRef.current = performance.now() - elapsedMs
    
    const updateTimer = () => {
      const elapsed = performance.now() - startTimeRef.current
      if (elapsed < totalDuration * 1000) {
        setElapsedMs(elapsed)
      } else {
        setIsRunning(false)
        setElapsedMs(totalDuration * 1000)
      }
    }

    // Use setInterval for consistent updates even when window loses focus
    const intervalId = setInterval(updateTimer, 16) // ~60fps
    
    // Also use RAF for smooth updates when in focus
    let rafId: number
    const animate = () => {
      updateTimer()
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      clearInterval(intervalId)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [isRunning, totalDuration, elapsedMs])

  // Update presenter window when state changes
  useEffect(() => {
    if (presenterWindowRef.current && !presenterWindowRef.current.closed) {
      const remainingMs = Math.max(0, totalDuration * 1000 - elapsedMs)
      const progress = totalDuration > 0 ? elapsedMs / (totalDuration * 1000) : 0
      
      presenterWindowRef.current.postMessage({
        type: 'TIMER_UPDATE',
        payload: {
          topic: currentTopic?.name || 'Loading...',
          remainingMs,
          progress,
          totalDuration
        }
      }, '*')
    }
  }, [currentTopic, elapsedMs, totalDuration])

  const handleFileLoad = (loadedTopics: Topic[], showPresenter: boolean) => {
    setTopics(loadedTopics)
    setCurrentTopicIndex(0)
    setElapsedMs(0)
    setIsRunning(false)

    if (showPresenter && loadedTopics.length > 0) {
      // Open presenter with the loaded data directly
      requestAnimationFrame(() => {
        openPresenterWindow(loadedTopics[0])
      })
    }
  }

  const openPresenterWindow = (initialTopic?: Topic) => {
    const width = 800
    const height = 800
    const left = window.screen.width - width - 100
    const top = 100

    const presenterWindow = window.open(
      '/presenter.html',
      'MarkWatch Presenter',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no`
    )

    if (presenterWindow) {
      presenterWindowRef.current = presenterWindow
      
      // Send initial state once presenter is ready
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'PRESENTER_READY') {
          // Use initialTopic if provided, otherwise use current state
          const topic = initialTopic ? initialTopic.name : (currentTopic?.name || 'Loading...')
          const duration = initialTopic ? initialTopic.duration : (currentTopic?.duration || 90)
          const remainingMs = Math.max(0, duration * 1000 - elapsedMs)
          const progress = duration > 0 ? elapsedMs / (duration * 1000) : 0
          
          presenterWindow.postMessage({
            type: 'TIMER_UPDATE',
            payload: {
              topic,
              remainingMs,
              progress,
              totalDuration: duration
            }
          }, '*')
          window.removeEventListener('message', handleMessage)
        }
      }
      
      window.addEventListener('message', handleMessage)
      
      // Cleanup
      const checkClosed = setInterval(() => {
        if (presenterWindow.closed) {
          clearInterval(checkClosed)
          presenterWindowRef.current = null
        }
      }, 1000)
    }
  }

  const handleClearTopics = () => {
    if (isRunning) {
      if (!window.confirm('Timer is running! Are you sure you want to clear all topics?')) {
        return
      }
    }
    
    // Close presenter window if open
    if (presenterWindowRef.current && !presenterWindowRef.current.closed) {
      presenterWindowRef.current.close()
      presenterWindowRef.current = null
    }
    
    setTopics([])
    setCurrentTopicIndex(0)
    setElapsedMs(0)
    setIsRunning(false)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(CURRENT_INDEX_KEY)
  }

  const handleStart = () => {
    if (!currentTopic) return
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setElapsedMs(0)
  }

  const handleNext = () => {
    if (currentTopicIndex < topics.length - 1) {
      const nextIndex = currentTopicIndex + 1
      setCurrentTopicIndex(nextIndex)
      setElapsedMs(0)
      setIsRunning(true)
    }
  }

  const handlePrevious = () => {
    if (currentTopicIndex > 0) {
      const prevIndex = currentTopicIndex - 1
      setCurrentTopicIndex(prevIndex)
      setElapsedMs(0)
      setIsRunning(true)
    }
  }

  const remainingMs = Math.max(0, totalDuration * 1000 - elapsedMs)
  const progress = totalDuration > 0 ? elapsedMs / (totalDuration * 1000) : 0

  return (
    <div className="app">
      {topics.length === 0 ? (
        <FileUpload onFileLoad={handleFileLoad} />
      ) : (
        <>
          <Stopwatch
            topic={currentTopic.name}
            remainingMs={remainingMs}
            progress={progress}
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />
          <div className="main-controls">
            <button 
              onClick={handlePrevious} 
              disabled={currentTopicIndex === 0}
              className="control-btn nav-btn"
              title="Previous (← Arrow Left)"
            >
              ←
            </button>
            {!isRunning ? (
              <button onClick={handleStart} className="control-btn start-btn" title="Start (Space)">
                ▶
              </button>
            ) : (
              <button onClick={handlePause} className="control-btn pause-btn" title="Pause (Space)">
                ⏸
              </button>
            )}
            <button onClick={handleReset} className="control-btn reset-btn" title="Reset (R)">
              ↻
            </button>
            <button 
              onClick={handleNext} 
              disabled={currentTopicIndex === topics.length - 1}
              className="control-btn nav-btn"
              title="Next (→ Arrow Right)"
            >
              →
            </button>
            <button 
              onClick={handleClearTopics}
              className="control-btn clear-btn"
              title="Clear all topics"
            >
              ✕
            </button>
          </div>
          <div className="status-bar">
            <span className="topic-counter">
              {currentTopicIndex + 1} / {topics.length}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default App
