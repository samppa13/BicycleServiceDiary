import type React from 'react'
import { useState } from 'react'
import { validatePassword } from '../validators/passwordValidation'

interface PasswordFieldProps {
    password: string,
    handlePassword: (password: string) => void
}

const PasswordField: React.FC<PasswordFieldProps> = ({ password, handlePassword }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const validation = validatePassword(password)

    // Render the password input and display password requirements
    return (
        <div>
            <label htmlFor='password'>Password</label>
            <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                id='password'
                onChange={(event) => handlePassword(event.target.value)}
                value={password}
                required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? 'Hide password' : 'Show password'}
            </button>
            <ul
                style={{
                    listStyle: 'none',
                    alignItems: 'center'
                }}
            >
                {[
                    'At least 8 characters',
                    'At least one lowercase letter',
                    'At least one uppercase letter',
                    'At least one number',
                    'At least one special character'
                ].map((requirement) => {
                    const passed = !validation.errors.includes(requirement)

                    return (
                        <li key={requirement}>
                            {passed ? '✓' : '○'} {requirement}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default PasswordField
