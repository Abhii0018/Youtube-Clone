import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const Home = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const page = Number(searchParams.get('page')) || 1
  const [nextToken, setNextToken] = useState(null)
  
  // Store tokens for each page to enable backward navigation
  const [tokens, setTokens] = useState({})

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const apiKey = import.meta.env.VITE_API_KEY
        
        // Get the page token for the current page from stored tokens
        let pageToken = ''
        if (page > 1 && tokens[page]) {
          pageToken = tokens[page]
        }
        
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=US&maxResults=20${pageToken ? `&pageToken=${pageToken}` : ''}&key=${apiKey}`
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos')
        }
        
        const data = await response.json()
        setVideos(data.items || [])
        
        // Store next page token
        setNextToken(data.nextPageToken || null)
        
        // Store the next page token for future navigation
        if (data.nextPageToken) {
          setTokens(prev => ({
            ...prev,
            [page + 1]: data.nextPageToken
          }))
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-rose-500"></div>
          <p className="text-sm text-slate-400">Loading videos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-red-500/20 bg-red-950/30 p-6 text-center">
          <p className="text-lg font-semibold text-red-300">Error loading videos</p>
          <p className="mt-2 text-sm text-slate-400">{error}</p>
        </div>
      </div>
    )
  }



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Home</h1>
        <p className="mt-1 text-sm text-slate-400">Trending videos from around the world</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <Link
            key={video.id}
            to={`/watch/${video.id}`}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 transition hover:border-rose-300/40 hover:bg-slate-900/70"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
              <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                {video.contentDetails?.duration?.replace('PT', '').toLowerCase() || 'N/A'}
              </div>
            </div>

            <div className="p-3">
              <h3 className="line-clamp-2 text-sm font-semibold text-white">
                {video.snippet.title}
              </h3>
              <p className="mt-1 text-xs text-slate-400">{video.snippet.channelTitle}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                <span>{parseInt(video.statistics.viewCount).toLocaleString()} views</span>
                <span>•</span>
                <span>{new Date(video.snippet.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4 pb-8">
        <button
          onClick={() => navigate(`/?page=${page - 1}`)}
          disabled={page === 1}
          className="rounded-lg border border-white/10 bg-slate-900/50 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-900/50"
        >
          ← Previous
        </button>
        
        <span className="text-sm text-slate-400">
          Page {page}
        </span>
        
        <button
          onClick={() => navigate(`/?page=${page + 1}`)}
          disabled={!nextToken}
          className="rounded-lg border border-white/10 bg-slate-900/50 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-900/50"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default Home
