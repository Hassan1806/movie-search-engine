import { useMovieContext } from '../../contexts/MovieContext'
import Moviecard from '../Moviecard'
import '../css/Favorites.css'


const Favorites = () => {
    const {favorites} = useMovieContext();
    if(!favorites || favorites.length === 0){
        return (
        <div className='favorites-empty'>
            <h2>You got some taste...</h2>
            <p> Search throught movies, your favorites will appear here 👌</p> 
          
        </div>
      )
    } else{ 

        return (
             <div className="movies-grid">
            {favorites.map((movie) =>  <Moviecard key={movie.id} movie={movie} />)}
        </div>
    )}
    
    
}

export default Favorites
