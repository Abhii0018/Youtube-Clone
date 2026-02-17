import { useState } from 'react'
import Navbar from './navbar'
import Sidebar from './sidebar'

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.2),_rgba(15,23,42,0.95)_40%,_rgba(2,6,23,1)_80%)] text-slate-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <Navbar />
      </header>

      <div className="relative w-full">
        <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] md:block">
          <Sidebar
            collapsed={isSidebarCollapsed}
            onToggle={handleToggleSidebar}
          />
        </aside>

        <main
          className={`min-h-[calc(100vh-4rem)] min-w-0 border-y border-white/10 bg-slate-900/60 p-6 shadow-[0_40px_80px_rgba(15,23,42,0.45)] transition-all duration-300 ${
            isSidebarCollapsed ? 'md:ml-24' : 'md:ml-60'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
