import { Request, Response, Router } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { verifyToken } from '../middleware/auth'
import { Bicycle, IBicycle } from '../models/Bicycle'

const router: Router = Router()

interface AuthRequest extends Request {
    user?: JwtPayload
}

// Create a new bicycle
router.post('/', verifyToken, async (request: AuthRequest, response: Response) => {
    try {
        const { make, modelYear } = request.body
        const userId = request.user?.id

        if (!make || !modelYear) {
            response.status(400).json({ error: 'Bicycle must have a make and a model year' })
            return
        }

        const newBicycle: IBicycle = new Bicycle({
            make,
            modelYear,
            owner: userId
        })
        await newBicycle.save()
        response.status(201).json(newBicycle)
    } catch (error) {
        response.status(500).json({ error: 'Error creating bicycle' })
    }
})

// Get a bicycle by ID
router.get('/:id', verifyToken, async (request: AuthRequest, response: Response) => {
    try {
        const bicycle: IBicycle | null = await Bicycle.findOne({
            _id: request.params.id,
            owner: request.user?.id
        })
        if (!bicycle) {
            response.status(404).json({ error: 'Bicycle not found' })
            return
        }

        response.status(200).json(bicycle)
    } catch (error) {
        response.status(500).json({ error: 'Error fetching bicycle'})
    }
})

// Update a bicycle by ID
router.put('/:id', verifyToken, async (request: AuthRequest, response: Response) => {
    try {
        const { make, modelYear } = request.body
        if (!make || !modelYear) {
            response.status(400).json({ error: 'Bicycle must have a make and a model year'})
            return
        }
    
        const updatedBicycle: IBicycle | null = await Bicycle.findOneAndUpdate(
            {
                _id: request.params.id,
                owner: request.user?.id
            },
            { make, modelYear },
            { returnDocument: 'after' }
        )
        if (!updatedBicycle) {
            response.status(404).json({ error: 'Bicycle not found' })
            return
        }
    
        response.status(200).json(updatedBicycle)
    } catch (error) {
        response.status(500).json({ error: 'Error updating bicycle' })
    }
})

// Delete a bicycle by ID
router.delete('/:id', verifyToken, async (request: AuthRequest, response: Response) => {
    try {
        const bicycle: IBicycle | null = await Bicycle.findOne({
            _id: request.params.id,
            owner: request.user?.id
        })
        if (!bicycle) {
            response.status(404).json({ error: 'Bicycle not found'})
            return
        }

        await bicycle.deleteOne()

        response.status(200).json({ message: 'Bicycle deleted successfully' })
    } catch (error) {
        response.status(500).json({ error: 'Error deleting bicycle' })
    }
})

export default router
