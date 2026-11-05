import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Header = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    // Logout user and redirect to home page
    const handleLogout = () => {
        logout()
        navigate('/')
    }

    // Render navigation bar
    return (
        <div>
            <h2>Bicycle Service Diary App</h2>
            {user
                ? (
                    <>
                        {/* Render links for logged in user */}
                        <div>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </>
                )
                : (
                    <>
                        {/* Render links for guest user */}
                        <div>
                            <Link to='/register'>Register</Link>
                        </div>
                        <div>
                            <Link to='/login'>Login</Link>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default Header
