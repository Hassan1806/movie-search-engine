import Moviecard from '../Moviecard'
import { SearchMovie, fetchPopularMovie, fetchUpcomingMovie } from '../../services/api'
import '../css/Home.css'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get('q') || ''
  const tabParam = searchParams.get('tab') || ''

  const [searchTerm, setSearchTerm] = useState('')
  const [moviesList, setMoviesList] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [mode, setMode] = useState('popular')
  const [lastQuery, setLastQuery] = useState('')
  const loadMoreButtonRef = useRef(null)

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem('recent_searches')
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      return []
    }
  })

  const addRecentSearch = (query) => {
    if (!query) return
    const trimmed = query.trim()
    if (!trimmed) return
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase())
      const updated = [trimmed, ...filtered].slice(0, 5)
      localStorage.setItem('recent_searches', JSON.stringify(updated))
      return updated
    })
  }

  const clearRecentSearches = (e) => {
    e.stopPropagation()
    setRecentSearches([])
    localStorage.removeItem('recent_searches')
  }

  // Sync search input and load data when URL parameters change
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      setError(null)
      try {
        if (tabParam === 'upcoming') {
          const data = await fetchUpcomingMovie(1)
          const results = data?.results || []
          const withUrls = results.map(m => ({
            ...m,
            url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
          }))
          setMoviesList(withUrls)
          setPage(data.page || 1)
          setTotalPages(data.total_pages || 1)
          setMode('upcoming')
          setLastQuery('')
          setSearchTerm('')
        } else if (queryParam) {
          const data = await SearchMovie(queryParam, 1)
          const results = data?.results || []
          const withUrls = results.map(m => ({
            ...m,
            url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
          }))
          setMoviesList(withUrls)
          setPage(data.page || 1)
          setTotalPages(data.total_pages || 1)
          setMode('search')
          setLastQuery(queryParam)
          setSearchTerm(queryParam)
          addRecentSearch(queryParam)
        } else {
          const data = await fetchPopularMovie(1)
          const results = data?.results || []
          const withUrls = results.map(m => ({
            ...m,
            url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
          }))
          setMoviesList(withUrls)
          setPage(data.page || 1)
          setTotalPages(data.total_pages || 1)
          setMode('popular')
          setLastQuery('')
          setSearchTerm('')
        }
      } catch (err) {
        setError(queryParam ? 'Search failed to fetch results.' : 'Failed to load movies.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [queryParam, tabParam])

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmed = searchTerm.trim()
    if (trimmed) {
      setSearchParams({ q: trimmed })
    } else {
      setSearchParams({})
    }
  }

  const loadMore = async () => {
    if (loading) return
    const nextPage = page + 1
    if (nextPage > totalPages) return

    const currentCount = moviesList.length
    setLoading(true)
    setError(null)

    try {
      const data = mode === 'popular'
        ? await fetchPopularMovie(nextPage)
        : mode === 'upcoming'
        ? await fetchUpcomingMovie(nextPage)
        : await SearchMovie(lastQuery, nextPage)

      const results = data?.results || []
      const withUrls = results.map(m => ({
        ...m,
        url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      }))
      setMoviesList(prev => [...prev, ...withUrls])
      setPage(data.page || nextPage)
      setTotalPages(data.total_pages || totalPages)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const movieGrid = document.querySelector('.movies-grid')
          if (movieGrid) {
            const firstNewMovie = movieGrid.children[currentCount]
            if (firstNewMovie) {
              firstNewMovie.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }
        })
      })
    } catch (err) {
      console.error(err)
      setError('Failed to load more movies.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='home'>
      <div className='home-hero'>
        <div className='hero-copy-wrapper'>
          <p className='eyebrow'>Movie discovery, simplified</p>
          <h1>Find the next movie to watch</h1>
          <p className='hero-copy'>Search millions of films, explore today’s popular titles, and save favorites for later.</p>
        </div>

        <div className='search-block'>
          <div className='hero-tabs'>
            <button 
              className={`hero-tab ${mode === 'popular' ? 'active' : ''}`}
              onClick={() => setSearchParams({})}
            >
              🔥 Popular
            </button>
            <button 
              className={`hero-tab ${mode === 'upcoming' ? 'active' : ''}`}
              onClick={() => setSearchParams({ tab: 'upcoming' })}
            >
              📅 Upcoming
            </button>
            {mode === 'search' && (
              <button className='hero-tab active'>
                🔍 Search Results
              </button>
            )}
          </div>

          <form onSubmit={handleSearch} className='search-form'>
            <label htmlFor='movie-search' className='visually-hidden'>Search movies</label>
            <input
              id='movie-search'
              type='text'
              placeholder='Search movies...'
              className='search-input'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type='submit' className='search-button'>Search</button>
          </form>

          {/* Status Row with Recent Searches and Upcoming Movies Button */}
          <div className='status-row recent-searches-row'>
            <div className='recent-searches-container'>
              {recentSearches.length > 0 ? (
                <div className='recent-tags-wrapper'>
                  <span className='recent-label'>Recent:</span>
                  <div className='recent-tags'>
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        className='recent-search-tag'
                        onClick={() => setSearchParams({ q: term })}
                      >
                        {term}
                      </button>
                    ))}
                    <button className='clear-recent-tag' onClick={clearRecentSearches} title="Clear history">
                      &times;
                    </button>
                  </div>
                </div>
              ) : (
                <span className='recent-label-empty'>No recent searches</span>
              )}
            </div>
            
            <button
              className={`upcoming-btn-toggle ${mode === 'upcoming' ? 'active' : ''}`}
              onClick={() => setSearchParams(mode === 'upcoming' ? {} : { tab: 'upcoming' })}
            >
              📅 Upcoming Movies
            </button>
          </div>
        </div>
      </div>

      <div className='movies-container'>
        {/* Skeleton loading grid during initial load */}
        {loading && moviesList.length === 0 && (
          <div className='movies-grid-skeleton'>
            {[...Array(8)].map((_, i) => (
              <div key={i} className='movie-card-skeleton'>
                <div className='skeleton-poster pulse'></div>
                <div className='skeleton-info'>
                  <div className='skeleton-title pulse'></div>
                  <div className='skeleton-meta pulse'></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error message when there are no movies */}
        {error && moviesList.length === 0 && (
          <div className='status-message error'>{error}</div>
        )}

        {/* Empty state when query returns no results */}
        {!loading && !error && moviesList.length === 0 && (
          <div className='status-message empty'>No movies found.</div>
        )}

        {/* Movies grid is always visible once loaded, preventing blinking */}
        {moviesList.length > 0 && (
          <div className='movies-grid'>
            {moviesList.map((movie) => <Moviecard key={movie.id} movie={movie} />)}
          </div>
        )}

        {/* Pagination loading indicator at the bottom */}
        {loading && moviesList.length > 0 && (
          <div className='pagination-loader'>
            <div className='spinner'></div>
            <span>Loading next page...</span>
          </div>
        )}

        {/* Non-intrusive pagination error message */}
        {error && moviesList.length > 0 && (
          <div className='status-message error error-inline'>{error}</div>
        )}
      </div>

      {!loading && !error && page < totalPages && (
        <div className='load-more-row'>
          <button ref={loadMoreButtonRef} className='load-more-button' onClick={loadMore}>Load more</button>
        </div>
      )}
    </section>
  )
}

export default Home
