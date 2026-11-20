import React, { createContext, useEffect, useRef, useState, type ReactNode } from 'react'

interface AuthContextSettings {
    user: { id: string, username: string } | null
    accessToken: string | null
    loading: boolean
    login: (username: string, password: string) => Promise<void>
    logout: () => void
    refreshAuth: () => Promise<string>
}

// Create authentication context for sharing user data and authentication functions
export const AuthContext = createContext<AuthContextSettings | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<{ id: string, username: string } | null>(null)
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const refreshPromise = useRef<Promise<string> | null>(null)

    // Refresh access token and restore user session
    const refreshAuth = async () => {
        // Reuse an ongoing refresh request to prevent duplicate requests
        if (refreshPromise.current) {
            return refreshPromise.current
        }

        refreshPromise.current = (async () => {
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

                return data.accessToken
            } catch (error) {
                // Clear authentication data if token refresh fails
                setUser(null)
                setAccessToken(null)
                throw error
            } finally {
                // Mark authentication check as complete
                setLoading(false)
                refreshPromise.current = null
            }
        })()

        return refreshPromise.current
    }

    // Check and restore authentication when the app starts
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await refreshAuth()
            } catch (error) {
                // No valid refresh token found
            }
        }

        checkAuth()
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
        setUser(null)
        setAccessToken(null)

        await fetch('http://localhost:1234/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        })
    }

    // Provide authentication data and functions to child components
    return (
        <AuthContext.Provider value={{
            user,
            accessToken,
            loading,
            login,
            logout,
            refreshAuth
        }}>
            { children }
        </AuthContext.Provider>
    )
}
