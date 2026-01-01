import Moviecard from '../Moviecard';
import { SearchMovie, fetchPopularMovie } from '../../services/api';
import '../css/Home.css'
import { useState, useEffect, useRef } from 'react';

const Home = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [moviesList, setMoviesList] = useState([]);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [mode, setMode] = useState('popular') 
    const [lastQuery, setLastQuery] = useState('')
    const loadMoreButtonRef = useRef(null)

    useEffect(() => {
    const getPopularMovies = async () => {
        try {
        const data = await fetchPopularMovie(1);
        const results = data?.results || [];
        const withUrls = results.map(m => ({
            ...m,
            url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null
        }));
        setMoviesList(withUrls);
        setPage(data.page || 1);
        setTotalPages(data.total_pages || 1);
        setMode('popular');
        } catch (err)   {
                setError("Failed to load movies...")
                console.log(err);
        }
        finally{
            setLoading(false)
        } 
    
    }

    getPopularMovies();

    }, [])

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const data = await SearchMovie(searchTerm.trim(), 1);
            const results = data?.results || [];
            const withUrls = results.map(m => ({
                ...m,
                url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null
            }));
            setMoviesList(withUrls);
            setPage(data.page || 1);
            setTotalPages(data.total_pages || 1);
            setMode('search');
            setLastQuery(searchTerm.trim());
        } catch (err) {
            console.error(err);
            setError('Search failed');
        } finally {
            setLoading(false);
            setSearchTerm('');
        }
    }

    const loadMore = async () => {
        if (loading) return;
        const nextPage = page + 1;
        if (nextPage > totalPages) return;
        
        const prevMovieCount = moviesList.length;
        
        setLoading(true);
        setError(null);
        try {
            let data;
            if (mode === 'popular') {
                data = await fetchPopularMovie(nextPage);
            } else {
                data = await SearchMovie(lastQuery, nextPage);
            }
            const results = data?.results || [];
            const withUrls = results.map(m => ({
                ...m,
                url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null
            }));
            setMoviesList(prev => [...prev, ...withUrls]);
            setPage(data.page || nextPage);
            setTotalPages(data.total_pages || totalPages);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const movieGrid = document.querySelector('.movies-grid');
                    if (movieGrid) {
                        const firstNewMovie = movieGrid.children[prevMovieCount];
                        if (firstNewMovie) {
                            firstNewMovie.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                });
            });
        } catch (err) {
            console.error(err);
            setError('Failed to load more');
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className='home'>
        <form onSubmit={handleSearch} className='search-form'>
            <input type="text" placeholder="Search movies..." className='search-input'  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            <button type="submit" className='search-button'>Search</button>
        </form>

        <div className="movies-grid">
            {loading && <div className="loading">Loading movies...</div>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && moviesList.length === 0 && (
                <div className="empty">No movies found.</div>
            )}
            {!loading && !error && moviesList.map((movie) =>  <Moviecard key={movie.id} movie={movie} />)}
        </div>

        {!loading && !error && page < totalPages && (
            <div style={{textAlign: 'center', margin: '1.5rem 0'}}>
                <button ref={loadMoreButtonRef} className="search-button" onClick={loadMore}>Load more</button>
            </div>
        )}
    </div>
  )
}

export default Home
