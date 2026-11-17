import mongoose, { Document, Schema } from 'mongoose'

// Interface for Bicycle
interface IBicycle extends Document {
    make: string
    modelYear: number
    owner: mongoose.Types.ObjectId
}

// Define the Mongoose schema for a Bicycle
const bicycleSchema: Schema = new Schema(
    {
        make: { type: String, required: true },
        modelYear: { type: String, required: true },
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
