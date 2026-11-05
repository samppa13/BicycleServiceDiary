import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const LoginPage = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [message, setMessage] = useState<string>('')

    const navigate = useNavigate()
    const { user, loading, login, logout } = useAuth()

    // Show loading text if auth is still loading
    if (loading) {
        return <p>Loading...</p>
    }

    // If user is already logged in, show info and options
    if (user) {
        return (
            <div>
                <p>You are logged in as {user.username}, you must log out before you can log in as another user.</p>
                {/* Navigate back to home */}
                <button onClick={() => navigate('/')}>
                    Cancel
                </button>
                {/* Logout current user */}
                <button onClick={() => logout()}>
                    Logout
                </button>
            </div>
        )
    }

    // Function to handle form submission and login
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault()
        setMessage('')

        try {
            await login(username, password)
            navigate('/')
        } catch (error: unknown) {
            setMessage(error instanceof Error
                ? error.message
                : 'Registration failed'
            )
        }
    }

    return (
        <div>
            <h2>
                Sign in
            </h2>
            {/* Show error message if exists */}
            {
                message
                && <p
                    style={{
                        color: message === 'User registered successfully'
                            ? 'green'
                            : 'red'
                    }}
                >
                    {message}
                </p>
            }
            {/* Login form */}
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor='username'>Username</label>
                    <input
                        type='text'
                        name='username'
                        id='username'
                        onChange={(event) => setUsername(event.target.value)}
                        value={username}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="passwor">Password</label>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                        required
                    />
                </div>
                {/* Submit button */}
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default LoginPage
