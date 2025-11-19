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
  const animationFrameRef = useRef<number | undefined>(undefined)

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

    const animate = () => {
      const now = performance.now()
      const elapsed = now - startTimeRef.current
      setElapsedMs(elapsed)

      if (elapsed < totalDuration * 1000) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setIsRunning(false)
        setElapsedMs(totalDuration * 1000)
      }
    }

    startTimeRef.current = performance.now() - elapsedMs
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isRunning, totalDuration, elapsedMs])

  const handleFileLoad = (loadedTopics: Topic[]) => {
    setTopics(loadedTopics)
    setCurrentTopicIndex(0)
    setElapsedMs(0)
    setIsRunning(false)
  }

  const handleClearTopics = () => {
    if (isRunning) {
      if (!window.confirm('Timer is running! Are you sure you want to clear all topics?')) {
        return
      }
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
      setCurrentTopicIndex(currentTopicIndex + 1)
      setElapsedMs(0)
      setIsRunning(false)
    }
  }

  const handlePrevious = () => {
    if (currentTopicIndex > 0) {
      setCurrentTopicIndex(currentTopicIndex - 1)
      setElapsedMs(0)
      setIsRunning(false)
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
          <div className="navigation desktop-navigation">
            <button 
              onClick={handlePrevious} 
              disabled={currentTopicIndex === 0}
              className="nav-btn"
              title="Arrow Left"
            >
              ← Previous
            </button>
            <span className="topic-counter">
              {currentTopicIndex + 1} / {topics.length}
            </span>
            <button 
              onClick={handleNext} 
              disabled={currentTopicIndex === topics.length - 1}
              className="nav-btn"
              title="Arrow Right"
            >
              Next →
            </button>
          </div>
          <div className="keyboard-hints-desktop">
            ← → : Navigate • Space: Play/Pause • R: Reset
          </div>
          <button 
            onClick={handleClearTopics}
            className="clear-btn"
            title="Clear all topics and start over"
          >
            Clear Topics
          </button>
        </>
      )}
    </div>
  )
}

export default App
