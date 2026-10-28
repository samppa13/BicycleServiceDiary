import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordField from '../components/PasswordField'
import { validatePassword } from '../validators/passwordValidation'

const RegisterPage = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [message, setMessage] = useState<string>('')

    const navigate = useNavigate()

    // Function to handle user registration
    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault()

        if (username.trim().length < 3 || username.trim().length > 25) {
            setMessage('Username must be 3-25 characters long')
            return
        }

        const passwordValidation = validatePassword(password)
        if (!passwordValidation.isValid) {
            setMessage('Password does not meet the requirements')
            return
        }

        try {
            const response: Response = await fetch('http://localhost:1234/api/auth/register', {
                method: 'POST',
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
                const errorMessage =
                    data.error
                    || data.errors?.map((error: { msg: string }) => error.msg).join(', ')
                    || 'Registration failed'
                
                throw new Error(errorMessage)
            }

            setMessage(data.message)
            setUsername('')
            setPassword('')
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (error: unknown) {
            setMessage(error instanceof Error
                ? error.message
                : 'Registration failed'
            )
        }
    }

    // Render the registration form and messages
    return (
        <div>
            <h2>
                Register
            </h2>
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
            <form onSubmit={handleRegister}>
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
                <PasswordField password={password} handlePassword={setPassword}/>
                <button type='submit'>Register</button>
            </form>
        </div>
    )
}

export default RegisterPage
