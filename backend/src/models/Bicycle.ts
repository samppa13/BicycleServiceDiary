import mongoose, { Document, Schema } from 'mongoose'

// Interface for Bicycle
interface IBicycle extends Document {
    brand: string
    modelName: string
    bicycleType: string
    modelYear: number
    description: string
    serialNumber: string
    purchaseDate: string
    purchasePrice: number
    color: string
    frameSize: string
    wheelSize: string
    owner: mongoose.Types.ObjectId
}

// Define the Mongoose schema for a Bicycle
const bicycleSchema: Schema = new Schema(
    {
        brand: { type: String, required: true },
        modelName: { type: String, required: true },
        bicycleType: { type: String, required: true },
        modelYear: { type: Number },
        description: { type: String },
        serialNumber: { type: String },
        purchaseDate: { type: String },
        purchasePrice: { type: Number },
        color: { type: String },
        frameSize: { type: String },
        wheelSize: { type: String },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    },
    {
        timestamps: true
    }
)

// Create Mongoose model for Bicycle
const Bicycle: mongoose.Model<IBicycle> = mongoose.model<IBicycle>('Bicycle', bicycleSchema)

// Export the model and interface
export { Bicycle, IBicycle }
