import mongoose, { Document, Schema } from 'mongoose'

// Define the interface for a User
interface IUser extends Document {
    username: string
    password: string
}

// Define the schema for a User
const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// Define User model
const User: mongoose.Model<IUser> = mongoose.model<IUser>('User', userSchema)

export {User, IUser}
