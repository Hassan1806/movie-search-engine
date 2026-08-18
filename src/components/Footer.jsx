import { Link } from 'react-router-dom'
import './css/Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='footer'>
      <div className='footer-content'>
        <div className='footer-brand-section'>
          <Link to='/' className='footer-logo'>
            <svg className='brand-icon' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2C12 2ZM10 16.5V7.5L16 12L10 16.5Z' fill='url(#footerBrandGradient)'/>
              <defs>
                <linearGradient id='footerBrandGradient' x1='2' y1='2' x2='22' y2='22' gradientUnits='userSpaceOnUse'>
                  <stop offset='0%' stopColor='#5669ff' />
                  <stop offset='100%' stopColor='#ff4d6d' />
                </linearGradient>
              </defs>
            </svg>
            <span className='brand-text'>MovieBox</span>
          </Link>
          <p className='footer-description'>
            Discover your next cinematic experience. Explore millions of movies, keep track of your favorites, and dive into detailed ratings and reviews.
          </p>
        </div>

        <div className='footer-links-group'>
          <div className='footer-links-col'>
            <h4>Navigation</h4>
            <Link to='/'>Home / Popular</Link>
            <Link to='/favorites'>Saved Watchlist</Link>
          </div>

          <div className='footer-links-col'>
            <h4>Resources</h4>
            <a href='https://www.themoviedb.org/' target='_blank' rel='noopener noreferrer'>TMDB API</a>
            <a href='https://github.com/' target='_blank' rel='noopener noreferrer'>GitHub Repository</a>
          </div>
        </div>
      </div>

      <hr className='footer-divider' />

      <div className='footer-bottom'>
        <p className='footer-copy'>&copy; {currentYear} MovieBox. Made with &hearts; for movie lovers.</p>
        <div className='footer-attribution'>
          <span className='attribution-text'>Data provided by</span>
          <a href='https://www.themoviedb.org/' target='_blank' rel='noopener noreferrer' className='tmdb-logo-link'>
            <span className='tmdb-green'>T</span>
            <span className='tmdb-blue'>M</span>
            <span className='tmdb-green'>D</span>
            <span className='tmdb-blue'>b</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
