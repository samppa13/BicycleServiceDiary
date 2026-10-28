import { body, ValidationChain } from 'express-validator'

// Validate registration fields
const registerValidation: ValidationChain[] = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 25 })
        .withMessage('Username must be 3-25 characters long'),
    body('password')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
        .withMessage('Password must be at least 8 characters long and include a lowercase letter, an uppercase letter, a number and a special character')
]

export { registerValidation }
