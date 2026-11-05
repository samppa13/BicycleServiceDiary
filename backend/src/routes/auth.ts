import { CookieOptions, Request, Response, Router } from 'express'
import { IUser, User } from '../models/User'
import bcrypt from 'bcryptjs'
import { registerValidation } from '../validators/authValidation'
import { Result, ValidationError, validationResult } from 'express-validator'
import jwt, { JwtPayload } from 'jsonwebtoken'

const router: Router = Router()

// Secret keys used for signing access and refresh tokens
const SECRET: string = process.env.JWT_SECRET as string
const REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET as string

// Cookie options for storing the refresh token securely
const COOKIE_AUTH_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'strict'
}

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

// Login a user and generate access and refresh tokens
router.post('/login', async (request: Request, response: Response) => {
    try {
        const { username, password } = request.body
        if (!username || !password) {
            response.status(400).json({ error: 'Please enter username and password' })
            return
        }

        const user: IUser | null = await User.findOne({ username })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            response.status(400).json({ error: 'Incorrect username or password' })
            return
        }

        const jwtPayload: JwtPayload = {
            id: user._id,
            username: user.username
        }

        const accessToken = jwt.sign(
            jwtPayload,
            SECRET,
            { expiresIn: '15m' }
        )
        const refreshToken = jwt.sign(
            jwtPayload,
            REFRESH_SECRET,
            { expiresIn: '24h' }
        )

        response.cookie('refreshToken', refreshToken, COOKIE_AUTH_OPTIONS)
        response.status(200).json({ accessToken, user: { id: user._id, username: user.username } })
    } catch (error: unknown) {
        response.status(500).json({ error: 'Error logging in' })
    }
})

// Refresh access token using the refresh token stored in cookies
router.post('/refresh', (request: Request, response: Response) => {
    const token = request.cookies.refreshToken
    if (!token) {
        response.status(403).json({ error: 'Invalid refresh token' })
        return
    }

    try {
        const verified = jwt.verify(token, REFRESH_SECRET) as { id: string, username: string }
        const jwtPayload: JwtPayload = {
            id: verified.id,
            username: verified.username
        }
        const newAccessToken = jwt.sign(
            jwtPayload,
            SECRET,
            { expiresIn: '15m' }
        )
        
        response.status(200).json({ accessToken: newAccessToken, user: { id: verified.id, username: verified.username } })
    } catch (error) {
        response.status(403).json({ error: 'Invalid refresh token' })
    }
})

// Log out user and clear refresh token cookie
router.post('/logout', (request: Request, response: Response) => {
    response.clearCookie('refreshToken', COOKIE_AUTH_OPTIONS)
    response.status(200).json({ message: 'Logged out' })
})

export default router
