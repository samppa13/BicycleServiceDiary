// Interface for a bicycle
export interface IBicycle {
    _id: string
    brand: string
    modelName: string
    bicycleType: string
    modelYear?: number
    description?: string
    serialNumber?: string
    purchaseDate?: string
    purchasePrice?: number
    color?: string
    frameSize?: string
    wheelSize?: string
    createdAt?: string
    updatedAt?: string
}
