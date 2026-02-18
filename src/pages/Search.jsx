import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { saveToSearchHistory } from '../utils/searchHistory'

const Search = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query) {
      setVideos([])
      return
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true)
        setError(null)
        const apiKey = import.meta.env.VITE_API_KEY
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            query
          )}&type=video&maxResults=50&key=${apiKey}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch search results')
        }

        const data = await response.json()
        setVideos(data.items || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query])

  if (!query) {
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
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <h1 className="mt-4 text-2xl font-semibold text-white">Search for videos</h1>
          <p className="mt-2 text-sm text-slate-400">
            Use the search bar above to find videos and creators.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-rose-500"></div>
          <p className="text-sm text-slate-400">Searching for "{query}"...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-red-500/20 bg-red-950/30 p-6 text-center">
          <p className="text-lg font-semibold text-red-300">Error loading search results</p>
          <p className="mt-2 text-sm text-slate-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Search results for "{query}"
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {videos.length} {videos.length === 1 ? 'result' : 'results'} found
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-white">No results found</p>
            <p className="mt-2 text-sm text-slate-400">
              Try searching with different keywords
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <Link
              key={video.id.videoId}
              to={`/watch/${video.id.videoId}`}
              onClick={() => saveToSearchHistory(video.snippet.title)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 transition hover:border-rose-300/40 hover:bg-slate-900/70"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>

              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-white">
                  {video.snippet.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400">{video.snippet.channelTitle}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <span>{new Date(video.snippet.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search
