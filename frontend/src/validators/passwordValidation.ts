interface ValidatePasswordResult {
    isValid: boolean
    errors: string[]
}

// Validate password requirements
const validatePassword = (password: string): ValidatePasswordResult => {
    const errors: string[] = []
    
    if (password.length < 8) {
        errors.push('At least 8 characters')
    }
    if (!/[a-z]/.test(password)) {
        errors.push('At least one lowercase letter')
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('At least one uppercase letter')
    }
    if (!/[0-9]/.test(password)) {
        errors.push('At least one number')
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
        errors.push('At least one special character')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

export { validatePassword }
