import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// Custom hook for accessing authentication context
export const useAuth = () => {
    const authContext = useContext(AuthContext)

    // Throw an error if the hook is used outside AuthProvider
    if (authContext === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return authContext
}
