import { NavLink } from 'react-router-dom'
import './css/Navbar.css'

const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className='navbar-brand'>
        <NavLink to='/' className='brand-link'>
          <svg className='brand-icon' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2C12 2ZM10 16.5V7.5L16 12L10 16.5Z' fill='url(#brandGradient)'/>
            <defs>
              <linearGradient id='brandGradient' x1='2' y1='2' x2='22' y2='22' gradientUnits='userSpaceOnUse'>
                <stop offset='0%' stopColor='#5669ff' />
                <stop offset='100%' stopColor='#ff4d6d' />
              </linearGradient>
            </defs>
          </svg>
          <span className='brand-text'>MovieBox</span>
        </NavLink>
      </div>
      <div className='navbar-links'>
        <NavLink to='/' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
          Home
        </NavLink>
        <NavLink to='/favorites' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Favorites
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar
