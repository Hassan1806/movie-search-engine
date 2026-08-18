import { createContext, useEffect, useState, useContext } from "react"

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({ children }) => {
        const [favorites, setFavorites] = useState(() => {
            const storedFavorites = localStorage.getItem('favorites');
            return storedFavorites ? JSON.parse(storedFavorites) : [];
        })

        useEffect(() => {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }, [favorites])


        const addFavorite = (movie) => {
            setFavorites(prev => [...prev, movie])
        }

        const removeFavorite = (movieId) =>{
            setFavorites(prev => prev.filter(movie=>movie.id !== movieId))
        }

        const isFavorite = (movieId) => {
            return favorites.some(movie => movie.id === movieId)
        }

        const clearFavorites = () => {
            setFavorites([])
        }

        const value = {
            favorites,
            addFavorite,
            removeFavorite,
            isFavorite,
            clearFavorites
        }

        return <MovieContext.Provider   value={value}>
            {children}
        </MovieContext.Provider>
}


export default MovieContext
