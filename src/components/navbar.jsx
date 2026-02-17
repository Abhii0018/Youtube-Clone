import SearchBar from './search'
import { Link } from 'react-router-dom'

const Navbar = () => {
	return (
		<div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
			<Link to="/" className="flex items-center gap-3">
				<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500 text-sm font-bold uppercase tracking-widest text-white">
					yt
				</div>
				<div>
					<p className="text-xs uppercase tracking-[0.3em] text-rose-300">Stream</p>
					<p className="text-lg font-semibold text-white">PulseTube</p>
				</div>
			</Link>

			<div className="w-full max-w-xl flex-1">
				<SearchBar />
			</div>

			<div className="flex items-center gap-3">
				<Link
					to="/upload"
					className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-rose-300/60 hover:bg-white/10"
				>
					<span className="text-rose-200">+</span>
					Upload
				</Link>
				<Link
					to="/profile"
					className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-rose-400 text-sm font-semibold text-slate-950"
					aria-label="Profile"
				>
					AK
				</Link>
			</div>
		</div>
	)
}

export default Navbar
