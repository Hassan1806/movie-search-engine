import { useState } from 'react'
import './App.css'
import Home from './components/pages/Home.jsx'
import Favorites from './components/pages/favorites.jsx'
import {Routes, Route } from 'react-router'
import Navbar from './components/Navbar.jsx'
import { MovieProvider } from './contexts/MovieContext.jsx'

function App() {

  return (
    <MovieProvider>
      <Navbar />
    <main className='main_content'>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='favorites' element={<Favorites/>} />
      </Routes>
    </main>
    </MovieProvider>
 
  )
}

export default App
