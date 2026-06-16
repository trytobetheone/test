import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleRemoveBg = async () => {
    if (!file) {
      setError('이미지를 선택해주세요')
      return
    }

    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('http://localhost:8000/remove-bg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        setResult(response.data.file_id)
      }
    } catch (err) {
      setError(err.response?.data?.detail || '배경 제거에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      const downloadUrl = `http://localhost:8000/download/${result}`
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `no-background-${result}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="container">
      <div className="card">
        <h1>📸 사진 누끼 제거</h1>
        <p className="subtitle">배경을 자동으로 제거하세요</p>

        {!result ? (
          <div className="upload-section">
            <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="fileInput"
                className="file-input"
              />
              <label htmlFor="fileInput" className="upload-label">
                <span className="upload-icon">📁</span>
                <span>클릭하여 이미지 선택</span>
                <span className="upload-hint">또는 드래그하여 업로드</span>
              </label>
            </div>

            {preview && (
              <div className="preview-section">
                <h3>미리보기</h3>
                <img src={preview} alt="미리보기" className="preview-image" />
              </div>
            )}

            {error && <div className="error">{error}</div>}

            <button
              onClick={handleRemoveBg}
              disabled={!file || loading}
              className="btn btn-primary"
            >
              {loading ? '처리 중...' : '배경 제거'}
            </button>
          </div>
        ) : (
          <div className="result-section">
            <div className="success-message">✅ 배경이 제거되었습니다!</div>
            <p className="result-hint">아래 버튼으로 이미지를 다운로드하세요</p>

            <div className="button-group">
              <button onClick={handleDownload} className="btn btn-success">
                📥 다운로드
              </button>
              <button onClick={handleReset} className="btn btn-secondary">
                🔄 다시 시작
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
