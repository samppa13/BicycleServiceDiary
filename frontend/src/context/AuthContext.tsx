import React, { createContext, useEffect, useState, type ReactNode } from 'react'

interface AuthContextSettings {
    user: { id: string, username: string } | null
    accessToken: string | null
    loading: boolean
    login: (username: string, password: string) => Promise<void>
    logout: () => void
}

// Create authentication context for sharing user data and authentication functions
export const AuthContext = createContext<AuthContextSettings | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<{ id: string, username: string } | null>(null)
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    // Refresh access token and restore user session
    const refreshAuth = async () => {
        try {
            const response: Response = await fetch('http://localhost:1234/api/auth/refresh', {
                method: 'POST',
                credentials: 'include'
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.error || 'Invalid refresh token')
            }

            // Update access token and user data
            setAccessToken(data.accessToken)
            setUser(data.user)
        } catch (error) {
            // Clear authentication data if token refresh fails
            setUser(null)
            setAccessToken(null)
        } finally {
            // Finish loading after authentication check
            setLoading(false)
        }
    }

    // Check and restore authentication when the app starts
    useEffect(() => {
        refreshAuth()
    }, [])

    // Log in user and update authentication state
    const login = async (username: string, password: string) => {
        const response: Response = await fetch('http://localhost:1234/api/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })

        const data = await response.json()
        if (!response.ok) {
            throw new Error(data.error || 'Login failed')
        }

        // Store access token and user data in state
        setAccessToken(data.accessToken)
        setUser(data.user)
        setLoading(false)
    }

    // Log out user and clear authentication data
    const logout = async () => {
        await fetch('http://localhost:1234/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        })
        setUser(null)
        setAccessToken(null)
    }

    // Provide authentication data and functions to child components
    return (
        <AuthContext.Provider value={{
            user,
            accessToken,
            loading,
            login,
            logout
        }}>
            { children }
        </AuthContext.Provider>
    )
}
