import { useContext } from 'react'
import { BicyclesContext } from '../context/BicyclesContext'

// Custom hook for accessing the bicycles context
export const useBicycles = () => {
    const bicyclesContext = useContext(BicyclesContext)

    // Throw an error if the hook is used outside BicyclesProvider
    if (bicyclesContext === undefined) {
        throw new Error('useBicycles must be used within a BicyclesProvider')
    }

    return bicyclesContext
}
