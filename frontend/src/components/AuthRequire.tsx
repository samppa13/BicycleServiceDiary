import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const AuthRequire = () => {
    const { user, loading } = useAuth()

    // Render loading text while authentication state is being checked
    if (loading) {
        return <p>Loading...</p>
    }

    // If user is not logged in, redirect to login page
    if (!user) {
        return <Navigate to='/login' replace />
    }

    // If user is authenticated, render child routes
    return <Outlet />
}

export default AuthRequire
