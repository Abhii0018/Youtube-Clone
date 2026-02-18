import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const WatchHistory = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load watch history from localStorage
    const loadHistory = () => {
      try {
        const watchHistory = JSON.parse(localStorage.getItem('watchHistory')) || []
        setHistory(watchHistory)
      } catch (err) {
        console.error('Error loading watch history:', err)
        setHistory([])
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your watch history?')) {
      localStorage.removeItem('watchHistory')
      setHistory([])
    }
  }

  const removeItem = (videoId) => {
    const updatedHistory = history.filter(item => item.videoId !== videoId)
    localStorage.setItem('watchHistory', JSON.stringify(updatedHistory))
    setHistory(updatedHistory)
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-rose-500"></div>
          <p className="text-sm text-slate-400">Loading history...</p>
        </div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto h-16 w-16 text-slate-600"
          >
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 15" />
          </svg>
          <h1 className="mt-4 text-2xl font-semibold text-white">No watch history</h1>
          <p className="mt-2 text-sm text-slate-400">
            Videos you watch will appear here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Watch History</h1>
          <p className="mt-1 text-sm text-slate-400">
            {history.length} {history.length === 1 ? 'video' : 'videos'} watched
          </p>
        </div>
        <button
          onClick={clearHistory}
          className="rounded-lg border border-red-500/20 bg-red-950/30 px-4 py-2 text-sm font-medium text-red-300 transition hover:border-red-500/40 hover:bg-red-950/50"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {history.map((item) => (
          <div key={`${item.videoId}-${item.timestamp}`} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 transition hover:border-rose-300/40 hover:bg-slate-900/70">
            <Link to={`/watch/${item.videoId}`}>
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
                <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                  {item.duration || 'N/A'}
                </div>
              </div>

              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400">{item.channelTitle}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <span>Watched {new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
            
            <button
              onClick={(e) => {
                e.preventDefault()
                removeItem(item.videoId)
              }}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100"
              aria-label="Remove from history"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WatchHistory
