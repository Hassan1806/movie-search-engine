import './App.css'
import Home from './components/pages/Home.jsx'
import Favorites from './components/pages/Favorites.jsx'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { MovieProvider } from './contexts/MovieContext.jsx'

function App() {
  return (
    <MovieProvider>
      <div className='app-shell'>
        <Navbar />
        <main className='main-content'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='favorites' element={<Favorites />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </MovieProvider>
  )
}

export default App
