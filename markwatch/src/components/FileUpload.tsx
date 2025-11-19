import React, { useRef, useState } from 'react'
import './FileUpload.css'
import type { Topic } from '../types'

interface FileUploadProps {
  onFileLoad: (topics: Topic[]) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parseFile = (content: string): Topic[] => {
    const lines = content.split('\n').filter(line => line.trim())
    const topics: Topic[] = []

    for (const line of lines) {
      const parts = line.split('|')
      if (parts.length !== 2) {
        throw new Error(`Invalid format on line: "${line}". Expected format: "Topic Name|Duration"`)
      }

      const name = parts[0].trim()
      const duration = parseInt(parts[1].trim(), 10)

      if (!name) {
        throw new Error(`Empty topic name on line: "${line}"`)
      }

      if (isNaN(duration) || duration <= 0) {
        throw new Error(`Invalid duration on line: "${line}". Duration must be a positive number.`)
      }

      topics.push({ name, duration })
    }

    if (topics.length === 0) {
      throw new Error('No topics found in file')
    }

    return topics
  }

  const handleFile = (file: File) => {
    setError(null)

    if (!file.name.endsWith('.txt')) {
      setError('Please upload a .txt file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const topics = parseFile(content)
        onFileLoad(topics)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse file')
      }
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  return (
    <div className="file-upload-container">
      <div className="branding">
        <h1 className="app-title">MarkWatch</h1>
        <p className="app-subtitle">Presentation Timer</p>
      </div>

      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="upload-icon"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>

        <h2 className="upload-title">Drop your topics file here</h2>
        <p className="upload-description">or click to browse</p>
        <div className="upload-hint">Supports .txt files</div>
      </div>

      {error && (
        <div className="error-message">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <div className="format-guide">
        <h3 className="guide-title">File Format</h3>
        <div className="guide-content">
          <code className="format-example">
            Topic Name|Duration in Seconds<br />
            Introduction|90<br />
            Problem Statement|120<br />
            Solution Overview|90
          </code>
        </div>
      </div>
    </div>
  )
}

export default FileUpload
