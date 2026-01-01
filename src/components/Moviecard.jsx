import React from 'react'
import './css/MovieCard.css'

import {useMovieContext} from '../contexts/MovieContext'


const Moviecard = ({movie}) => {

  const {addFavorite, removeFavorite, isFavorite} = useMovieContext();
  const favorite = isFavorite(movie.id);

    const ClickOnHeart = (e)=> {
        e.stopPropagation();
        if(favorite){
            removeFavorite(movie.id);
        }else{
            addFavorite(movie);
        }
    }

  return (
    <div className='movie-card'>
      <div className="movie-poster">
        <img src={movie.url || '/placeholder.svg'} alt={movie.title} />
        <div className="movie-overlay">
            <button className={`favorite-btn ${favorite ? 'active' : ''}`} onClick={ClickOnHeart}>
                ❤
            </button>
        </div>
      </div>
      <div className="movie-info">
        <h3 className='movie-title'>{movie.title}</h3>
        <p className='movie-release_date'>{movie.release_date?.split('-')[0]}</p>
      </div>
    </div>
  )
}

export default Moviecard
