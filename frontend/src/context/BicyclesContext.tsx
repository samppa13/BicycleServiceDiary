import React, { createContext, useCallback, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { IBicycle } from '../types/types'
import { useApi } from '../hooks/useApi'

interface BicyclesContextSettings {
    bicycles: IBicycle[] | null
    loading: boolean
    fetchBicycles: () => Promise<void>
    fetchBicycle: (id: string) => Promise<IBicycle>
    createBicycle: (bicycle: IBicycle) => Promise<IBicycle>
    updateBicycle: (bicycle: IBicycle) => Promise<IBicycle>
    deleteBicycle: (id: string) => Promise<string>
}

// Create bicycle context
export const BicyclesContext = createContext<BicyclesContextSettings | undefined>(undefined)

export const BicyclesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bicycles, setBicycles] = useState<IBicycle[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const ctrlRef = useRef<AbortController | null>(null)
    const { accessToken } = useAuth()
    const { apiFetch } = useApi()

    const APIURL: string = 'http://localhost:1234/api/bicycles'

    // Fetch bicycles owned by current user
    const fetchBicycles = useCallback(async () => {
        if (!accessToken) {
            return
        }
        // Abort any previous request
        if (ctrlRef.current) {
            ctrlRef.current.abort()
        }

        const abortctrl: AbortController = new AbortController()
        ctrlRef.current = abortctrl

        setLoading(true)

        try {
            const response: Response = await apiFetch(APIURL, {
                method: 'GET',
                signal: abortctrl.signal
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.error || 'Error fetching bicycles')
            }

            setBicycles(data)
        } finally {
            if (ctrlRef.current === abortctrl) {
                ctrlRef.current = null
                setLoading(false)
            }
        }
    }, [accessToken])

    // Fetch single bicycle by id
    const fetchBicycle = async (id: string) => {
        const response: Response = await apiFetch(`${APIURL}/${id}`, {
            method: 'GET'
        })

        const data = await response.json()
        if (!response.ok) {
            throw new Error(data.error || 'Error fetching bicycle')
        }

        // Update bicycle in list
        setBicycles((prevBicycles) => prevBicycles
            ? prevBicycles.map(
                (bicycle) => bicycle._id === data._id ? data : bicycle
            )
            : prevBicycles
        )
        return data
    }

    // Create a new bicycle
    const createBicycle = async (bicycle: IBicycle) => {
        const response: Response = await apiFetch(APIURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bicycle)
        })

        const data = await response.json()
        if (!response.ok) {
            throw new Error(data.error || 'Error creating bicycle')
        }

        setBicycles((prevBicycles) =>
            prevBicycles ? [...prevBicycles, data] : [data]
        )
        return data
    }

    // Update existing bicycle
    const updateBicycle = async (bicycle: IBicycle) => {
        const response: Response = await apiFetch(`${APIURL}/${bicycle._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bicycle)
        })

        const data = await response.json()
        if (!response.ok) {
            throw new Error(data.error || 'Error updating bicycle')
        }

        // Update bicycle in list
        setBicycles((prevBicycles) => prevBicycles
            ? prevBicycles.map(
                (bike) => bike._id === data._id ? data : bike
            )
            : prevBicycles
        )
        return data
    }

    // Delete bicycle
    const deleteBicycle = async (id: string) => {
        const response: Response = await apiFetch(`${APIURL}/${id}`, {
            method: 'DELETE'
        })

        const data = await response.json()
        if (!response.ok) {
            throw new Error(data.error || 'Error deleting bicycle')
        }

        setBicycles((prevBicycles) => prevBicycles
            ? prevBicycles.filter(
                (bike) => bike._id !== id
            )
            : prevBicycles
        )
        return data.message
    }

    // Provide bicycle data and functions to child components
    return (
        <BicyclesContext.Provider value={{
            bicycles,
            loading,
            fetchBicycles,
            fetchBicycle,
            createBicycle,
            updateBicycle,
            deleteBicycle
        }}>
            { children }
        </BicyclesContext.Provider>
    )
}
