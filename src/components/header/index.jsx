import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    const menuItems = userLoggedIn
        ? [
            { label: 'Profile', to: '/profile' },
            { label: 'Logout', onClick: () => { doSignOut().then(() => { navigate('/login') }) } },
            { label: 'About', to: '/about' },
            { label: 'Privacy Policy', to: '/privacy_policy' },
          ]
        : [
            { label: 'Login', to: '/login' },
            { label: 'Sign Up', to: '/register' },
            { label: 'About ViveStat', to: '/about' },
            { label: 'Privacy Policy', to: '/privacy_policy' },
          ]

    return (
        <div>
        <nav style={{ '--header-height': '4rem' }} className='flex items-center justify-between w-full z-20 fixed top-0 left-0 h-[var(--header-height)] px-4 border-b bg-white shadow-sm'>
            <Link to="/" className="text-xl font-bold text-blue-600">ViveStat</Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
                {menuItems.map((item, index) => (
                    item.to ? (
                        <Link key={index} to={item.to} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <button key={index} onClick={item.onClick} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                            {item.label}
                        </button>
                    )
                ))}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden relative">
                <div className="flex items-center space-x-2">
                    <button onClick={toggleMenu} className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                        {menuItems.map((item, index) => (
                            item.to ? (
                                <Link 
                                    key={index} 
                                    to={item.to} 
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={toggleMenu}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <button 
                                    key={index} 
                                    onClick={() => {
                                        item.onClick();
                                        toggleMenu();
                                    }} 
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {item.label}
                                </button>
                            )
                        ))}
                    </div>
                )}
            </div>
        </nav>
        <div>~{"\n"}</div>
        </div>
    )
}

export default Header