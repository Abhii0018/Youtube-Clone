import { Link } from 'react-router-dom'

const iconStyles =
	'h-5 w-5 text-rose-200 transition group-hover:text-rose-100'

const sidebarLinks = [
	{
		label: 'Home',
		to: '/',
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={iconStyles}
			>
				<path d="M3 10.5L12 3l9 7.5" />
				<path d="M5 10v10h14V10" />
			</svg>
		),
	},
	{
		label: 'Trending',
		to: '/search',
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={iconStyles}
			>
				<path d="M4 16l6-6 4 4 6-6" />
				<path d="M20 8v6h-6" />
			</svg>
		),
	},
	{
		label: 'Library',
		to: '/profile',
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={iconStyles}
			>
				<rect x="4" y="4" width="7" height="16" rx="2" />
				<rect x="13" y="7" width="7" height="13" rx="2" />
			</svg>
		),
	},
	{
		label: 'Uploads',
		to: '/upload',
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={iconStyles}
			>
				<path d="M12 3v12" />
				<path d="M7 8l5-5 5 5" />
				<rect x="4" y="14" width="16" height="7" rx="2" />
			</svg>
		),
	},
]

const Sidebar = ({ collapsed, onToggle }) => {
	return (
		<div
			className={`flex h-full flex-col gap-6 border-r border-white/10 bg-slate-950/80 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.35)] transition-all duration-300 ${
				collapsed ? 'w-24' : 'w-60'
			}`}
		>
			<div className="flex items-center justify-between">
				<div className={collapsed ? 'hidden' : ''}>
					<p className="text-xs uppercase tracking-[0.3em] text-slate-400">Explore</p>
					<h2 className="mt-2 text-xl font-semibold text-white">Discover</h2>
				</div>
				<button
					type="button"
					onClick={onToggle}
					className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-widest text-white transition hover:border-rose-300/60"
					aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				>
					{collapsed ? '>>' : '<<'}
				</button>
			</div>

			<nav className="flex flex-col gap-2">
				{sidebarLinks.map((link) => (
					<Link
						key={link.label}
						to={link.to}
						className={`group flex items-center gap-3 rounded-2xl border border-transparent bg-white/0 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-rose-300/40 hover:bg-white/5 ${
							collapsed ? 'justify-center' : 'justify-between'
						}`}
					>
						<div className="flex items-center gap-3">
							{link.icon}
							<span
								className={`text-xs uppercase tracking-[0.2em] text-slate-300 ${
									collapsed ? 'block text-[10px]' : 'block'
								}`}
							>
								{link.label}
							</span>
						</div>
						<span
							className={`text-xs text-rose-200/0 transition group-hover:text-rose-200/80 ${
								collapsed ? 'hidden' : 'block'
							}`}
						>
							Go
						</span>
					</Link>
				))}
			</nav>

			<div
				className={`rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/20 via-slate-950/60 to-rose-500/20 p-4 ${
					collapsed ? 'hidden' : 'block'
				}`}
			>
				<p className="text-sm font-semibold text-white">Start a new upload</p>
				<p className="mt-2 text-xs text-slate-300">
					Share your latest footage with the community and build momentum.
				</p>
				<Link
					to="/upload"
					className="mt-4 inline-flex items-center justify-center rounded-full bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-400"
				>
					Upload now
				</Link>
			</div>
		</div>
	)
}

export default Sidebar
