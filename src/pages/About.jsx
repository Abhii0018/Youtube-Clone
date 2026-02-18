import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const About = () => {
  const { id } = useParams()
  const [videoData, setVideoData] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true)
        const apiKey = import.meta.env.VITE_API_KEY
        
        // Fetch video details
        const videoResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${id}&key=${apiKey}`
        )
        
        if (!videoResponse.ok) {
          throw new Error('Failed to fetch video')
        }
        
        const videoResult = await videoResponse.json()
        setVideoData(videoResult.items?.[0] || null)
        
        // Save to watch history
        if (videoResult.items?.[0]) {
          const video = videoResult.items[0]
          const watchHistory = JSON.parse(localStorage.getItem('watchHistory')) || []
          const historyItem = {
            videoId: id,
            title: video.snippet.title,
            channelTitle: video.snippet.channelTitle,
            thumbnail: video.snippet.thumbnails.medium.url,
            duration: video.contentDetails?.duration?.replace('PT', '').toLowerCase() || 'N/A',
            timestamp: new Date().toISOString()
          }
          
          // Remove duplicate if exists and add to beginning, keep only last 50
          const updatedHistory = [
            historyItem,
            ...watchHistory.filter(item => item.videoId !== id)
          ].slice(0, 50)
          
          localStorage.setItem('watchHistory', JSON.stringify(updatedHistory))
        }
        
        // Fetch related videos
        const relatedResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${id}&type=video&maxResults=10&key=${apiKey}`
        )
        
        if (relatedResponse.ok) {
          const relatedResult = await relatedResponse.json()
          setRelatedVideos(relatedResult.items || [])
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchVideoData()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-rose-500"></div>
          <p className="text-sm text-slate-400">Loading video...</p>
        </div>
      </div>
    )
  }

  if (error || !videoData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-red-500/20 bg-red-950/30 p-6 text-center">
          <p className="text-lg font-semibold text-red-300">Video not found</p>
          <p className="mt-2 text-sm text-slate-400">{error || 'Could not load video'}</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50">
        <div className="relative aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1`}
            title={videoData.snippet.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Video Info */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-white">
          {videoData.snippet.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
          <span>{parseInt(videoData.statistics.viewCount).toLocaleString()} views</span>
          <span>•</span>
          <span>{new Date(videoData.snippet.publishedAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{parseInt(videoData.statistics.likeCount).toLocaleString()} likes</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-rose-400 text-sm font-semibold text-slate-950">
              {videoData.snippet.channelTitle.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-white">{videoData.snippet.channelTitle}</p>
              <p className="text-xs text-slate-400">Content Creator</p>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-slate-300">
            <p className="whitespace-pre-wrap">{videoData.snippet.description}</p>
          </div>
        </div>
      </div>

      {/* Related Videos */}
      {relatedVideos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Related Videos</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {relatedVideos.map((video) => (
              <Link
                key={video.id.videoId}
                to={`/watch/${video.id.videoId}`}
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
                  <p className="mt-2 text-xs text-slate-500">
                    {new Date(video.snippet.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default About
