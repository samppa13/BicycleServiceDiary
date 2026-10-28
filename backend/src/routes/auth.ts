import { Request, Response, Router } from 'express'
import { IUser, User } from '../models/User'
import bcrypt from 'bcryptjs'
import { registerValidation } from '../validators/authValidation'
import { Result, ValidationError, validationResult } from 'express-validator'

const router: Router = Router()

// Register a new user
router.post('/register', registerValidation, async (request: Request, response: Response) => {
    try {
        const errors: Result<ValidationError> = validationResult(request)
        if (!errors.isEmpty()) {
            response.status(400).json({ errors: errors.array() })
            return
        }

        const { username, password } = request.body
        const existingUser: IUser | null = await User.findOne({ username })
        if (existingUser) {
            response.status(403).json({ error: 'Username is already taken'})
            return
        }

        const hashedPassword: string = await bcrypt.hash(password, 10)

        await User.create({
            username: username,
            password: hashedPassword
        })

        response.status(200).json({ message: 'User registered successfully'})
    } catch (error: unknown) {
        response.status(500).json({ error: 'Error registering user'})
    }
})

export default router
