import { useState } from 'react'
import { createPortal } from 'react-dom'
import './css/MovieCard.css'
import { useMovieContext } from '../contexts/MovieContext'

const Moviecard = ({ movie }) => {
  const { addFavorite, removeFavorite, isFavorite } = useMovieContext()
  const favorite = isFavorite(movie.id)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const ClickOnHeart = (e) => {
    e.stopPropagation()
    if (favorite) {
      removeFavorite(movie.id)
    } else {
      addFavorite(movie)
    }
  }

  const openModal = (e) => {
    e.stopPropagation()
    setIsModalOpen(true)
  }

  const closeModal = (e) => {
    if (e) e.stopPropagation()
    setIsModalOpen(false)
  }

  return (
    <>
      <article className='movie-card'>
        <div className='movie-poster'>
          <img src={movie.url || '/placeholder.svg'} alt={movie.title || movie.name || 'Movie poster'} />
          <div className='movie-overlay'>
            <button className={`favorite-btn ${favorite ? 'active' : ''}`} onClick={ClickOnHeart}>
              ❤
            </button>
          </div>
        </div>
        <div className='movie-info'>
          <h3 className='movie-title'>{movie.title || movie.name || 'Untitled'}</h3>
          <div className='movie-meta'>
            <span>{movie.release_date?.split('-')[0] || 'TBA'}</span>
            {movie.vote_average != null && <span>⭐ {movie.vote_average.toFixed(1)}</span>}
          </div>
          {movie.overview && (
            <div className='movie-description-wrapper'>
              <p className='movie-description'>{movie.overview}</p>
              <button className='read-more-btn' onClick={openModal}>
                Read More &rarr;
              </button>
            </div>
          )}
        </div>
      </article>

      {/* Portal Details Modal */}
      {isModalOpen && createPortal(
        <div className='modal-backdrop' onClick={closeModal}>
          <div className='modal-container' onClick={(e) => e.stopPropagation()}>
            <button className='modal-close-btn' onClick={closeModal} aria-label='Close details'>
              &times;
            </button>
            <div className='modal-body'>
              <div className='modal-poster-side'>
                <img src={movie.url || '/placeholder.svg'} alt={movie.title || movie.name} />
              </div>
              <div className='modal-info-side'>
                <h2 className='modal-title'>{movie.title || movie.name}</h2>
                <div className='modal-meta-row'>
                  <span className='modal-meta-pill'>📅 Release: {movie.release_date || 'TBA'}</span>
                  {movie.vote_average != null && (
                    <span className='modal-meta-pill'>⭐ Rating: {movie.vote_average.toFixed(1)} / 10</span>
                  )}
                </div>
                {movie.overview && (
                  <div className='modal-overview-section'>
                    <h4>Overview</h4>
                    <p className='modal-overview'>{movie.overview}</p>
                  </div>
                )}
                <div className='modal-actions'>
                  <button 
                    className={`modal-fav-btn ${favorite ? 'active' : ''}`}
                    onClick={ClickOnHeart}
                  >
                    <span className='modal-heart'>{favorite ? '❤' : '♡'}</span>
                    {favorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default Moviecard
