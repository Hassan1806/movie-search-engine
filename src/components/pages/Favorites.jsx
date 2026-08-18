import { useState } from 'react'
import { useMovieContext } from '../../contexts/MovieContext'
import Moviecard from '../Moviecard'
import { Link } from 'react-router-dom'
import '../css/Favorites.css'

const Favorites = () => {
  const { favorites, clearFavorites } = useMovieContext()
  const [sortBy, setSortBy] = useState('date-added')
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  const handleClearAll = () => {
    clearFavorites()
    setShowConfirmClear(false)
  }

  const getSortedFavorites = () => {
    if (!favorites) return []
    const favsCopy = [...favorites]
    switch (sortBy) {
      case 'title-asc':
        return favsCopy.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''))
      case 'rating-desc':
        return favsCopy.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
      case 'release-year-desc':
        return favsCopy.sort((a, b) => {
          const yearA = parseInt(a.release_date?.split('-')[0]) || 0
          const yearB = parseInt(b.release_date?.split('-')[0]) || 0
          return yearB - yearA
        })
      default:
        return favsCopy // 'date-added' (order of inclusion)
    }
  }

  const sortedFavorites = getSortedFavorites()

  if (!favorites || favorites.length === 0) {
    return (
      <section className='favorites-empty-container'>
        <div className='favorites-empty-card'>
          <div className='pulse-heart-container'>
            <svg className='empty-heart-icon' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z' fill='url(#emptyHeartGradient)'/>
              <defs>
                <linearGradient id='emptyHeartGradient' x1='2' y1='3' x2='22' y2='21.35' gradientUnits='userSpaceOnUse'>
                  <stop offset='0%' stopColor='#5669ff' />
                  <stop offset='100%' stopColor='#ff4d6d' />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2>Your Watchlist is Empty</h2>
          <p>Explore our library, discover movies you love, and bookmark them. They will appear here for easy access later.</p>
          <Link to='/' className='explore-btn'>
            Explore Movies
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className='favorites-dashboard'>
      <div className='favorites-dashboard-header'>
        <div className='header-left'>
          <h2>Saved Favorites</h2>
          <div className='favorites-badge'>
            <span>{favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved</span>
          </div>
        </div>

        <div className='header-actions'>
          <div className='sort-wrapper'>
            <label htmlFor='favorites-sort'>Sort by:</label>
            <select
              id='favorites-sort'
              className='sort-select'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value='date-added'>Date Added</option>
              <option value='title-asc'>Title (A-Z)</option>
              <option value='rating-desc'>Rating (High-Low)</option>
              <option value='release-year-desc'>Release Year (Newest)</option>
            </select>
          </div>

          <div className='clear-watchlist-wrapper'>
            {!showConfirmClear ? (
              <button className='clear-all-btn' onClick={() => setShowConfirmClear(true)}>
                Clear Watchlist
              </button>
            ) : (
              <div className='confirm-clear-group'>
                <span className='confirm-text'>Are you sure?</span>
                <button className='confirm-btn yes' onClick={handleClearAll}>Yes</button>
                <button className='confirm-btn no' onClick={() => setShowConfirmClear(false)}>No</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='movies-grid'>
        {sortedFavorites.map((movie) => <Moviecard key={movie.id} movie={movie} />)}
      </div>
    </section>
  )
}

export default Favorites
