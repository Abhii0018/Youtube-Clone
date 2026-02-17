const SearchBar = () => {
	return (
		<form className="group relative flex items-center">
			<input
				type="text"
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
	)
}

export default SearchBar
