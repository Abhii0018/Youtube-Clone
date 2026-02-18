import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveToSearchHistory, getSearchHistory } from '../utils/searchHistory'

const SearchBar = () => {
	const [query, setQuery] = useState('')
	const [showSuggestions, setShowSuggestions] = useState(false)
	// Lazy initialization - load search history only once on mount
	const [searchHistory, setSearchHistory] = useState(() => getSearchHistory())
	const navigate = useNavigate()

	// Filter suggestions based on query
	const filteredSuggestions = useMemo(() => {
		if (!query.trim()) {
			// If no query, show all search history
			return searchHistory
		}
		// Filter history based on query match
		const filtered = searchHistory.filter(item =>
			item.query.toLowerCase().includes(query.toLowerCase())
		)
		return filtered
	}, [query, searchHistory])

	const saveAndUpdateHistory = (searchQuery) => {
		saveToSearchHistory(searchQuery)
		// Update local state to reflect changes
		setSearchHistory(getSearchHistory())
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		if (query.trim()) {
			saveAndUpdateHistory(query)
			navigate(`/search?q=${encodeURIComponent(query.trim())}`)
			setShowSuggestions(false)
			setQuery('')
		}
	}

	const handleSuggestionClick = (suggestion) => {
		setQuery(suggestion)
		saveAndUpdateHistory(suggestion)
		setShowSuggestions(false)
		// Optionally, auto-search on click:
		// navigate(`/search?q=${encodeURIComponent(suggestion)}`)
	}

	const handleFocus = () => {
		setShowSuggestions(true)
	}

	const handleBlur = () => {
		// Delay to allow mousedown event on suggestions
		setTimeout(() => {
			setShowSuggestions(false)
		}, 150)
	}

	return (
		<div className="relative w-full">
			<form onSubmit={handleSubmit} className="group relative flex items-center">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={handleFocus}
					onBlur={handleBlur}
					placeholder="Search creators, clips, or playlists"
					className="w-full rounded-full border border-white/10 bg-slate-900/70 px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-400 shadow-[0_0_30px_rgba(76,29,149,0.2)] outline-none transition focus:border-rose-300/70 focus:bg-slate-900"
					aria-label="Search"
				/>
				<button
					type="submit"
					className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white transition hover:bg-rose-400"
					aria-label="Submit search"
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
						<circle cx="11" cy="11" r="7" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
				</button>
			</form>

			{/* Search Suggestions Dropdown */}
			{showSuggestions && filteredSuggestions.length > 0 && (
				<div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
					<div className="max-h-80 overflow-y-auto">
						{filteredSuggestions.map((item, index) => (
							<button
								key={`${item.query}-${index}`}
								type="button"
								onMouseDown={(e) => {
									// Prevent blur event
									e.preventDefault()
									handleSuggestionClick(item.query)
								}}
								className="flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left text-sm text-white transition hover:bg-white/5 last:border-b-0"
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="h-4 w-4 flex-shrink-0 text-slate-400"
								>
									<circle cx="12" cy="12" r="9" />
									<polyline points="12 7 12 12 15 15" />
								</svg>
								<span className="flex-1">{item.query}</span>
								<span className="text-xs text-slate-500">
									{new Date(item.timestamp).toLocaleDateString()}
								</span>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default SearchBar
