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
        const {
            brand,
            modelName,
            bicycleType,
            modelYear,
            description,
            serialNumber,
            purchaseDate,
            purchasePrice,
            color,
            frameSize,
            wheelSize
        } = request.body
        const userId = request.user?.id

        if (!brand || !modelName || !bicycleType) {
            response.status(400).json({ error: 'Bicycle must have a brand, model and type' })
            return
        }

        const newBicycle: IBicycle = new Bicycle({
            brand,
            modelName,
            bicycleType,
            modelYear,
            description,
            serialNumber,
            purchaseDate,
            purchasePrice,
            color,
            frameSize,
            wheelSize,
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

// Get all bicycles by the logged in user
router.get('/', verifyToken, async (request: AuthRequest, response: Response) => {
    try {
        const bicycles = await Bicycle.find(
            { owner: request.user?.id }
        ).select('brand modelName bicycleType')

        response.status(200).json(bicycles)
    } catch (error) {
        response.status(500).json({ error: 'Error fetching bicycles' })
    }
})

// Update a bicycle by ID
router.put('/:id', verifyToken, async (request: AuthRequest, response: Response) => {
    try {
        const {
            brand,
            modelName,
            bicycleType,
            modelYear,
            description,
            serialNumber,
            purchaseDate,
            purchasePrice,
            color,
            frameSize,
            wheelSize
        } = request.body
        if (!brand || !modelName || !bicycleType) {
            response.status(400).json({ error: 'Bicycle must have a brand, model and type' })
            return
        }
    
        const updatedBicycle: IBicycle | null = await Bicycle.findOneAndUpdate(
            {
                _id: request.params.id,
                owner: request.user?.id
            },
            {
                brand,
                modelName,
                bicycleType,
                modelYear,
                description,
                serialNumber,
                purchaseDate,
                purchasePrice,
                color,
                frameSize,
                wheelSize
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
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
