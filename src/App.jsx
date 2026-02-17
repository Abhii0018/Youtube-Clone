
import { Route } from 'react-router-dom'
import About from './pages/About'
import Home from './pages/Home'
import Layout from './components/Layout'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Upload from './pages/Upload'
import { Routes } from 'react-router-dom'
import './App.css'

function App() {
  
  return (
    <>
      <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/watch/:id' element={<About />} />
            <Route path='/upload' element={<Upload />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/search' element={<Search />} />
          </Routes>
      </Layout>
    </>
  )
}

export default App
