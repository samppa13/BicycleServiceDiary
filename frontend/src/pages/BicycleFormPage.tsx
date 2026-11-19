import { useEffect, useState } from 'react'
import type { IBicycle } from '../types/types'
import { useNavigate, useParams } from 'react-router-dom'
import { useBicycles } from '../hooks/useBicycles'
import BicycleForm from '../components/BicycleForm'

const BicycleFormPage = () => {
    const [bicycle, setBicycle] = useState<IBicycle | undefined>(undefined)
    const [notFound, setNotFound] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')

    const { id } = useParams()
    const navigate = useNavigate()
    const { fetchBicycle, createBicycle, updateBicycle } = useBicycles()

     // Clear success message after 2 seconds
    useEffect(() => {
        if (!message) {
            return
        }

        const timer = setTimeout(() => {
            setMessage('')
        }, 2000)
        return () => clearTimeout(timer)
    }, [message])

    // Clear error message after 2 seconds
    useEffect(() => {
        if (!errorMessage) {
            return
        }

        const timer = setTimeout(() => {
            setErrorMessage('')
        }, 2000)
        return () => clearTimeout(timer)
    }, [errorMessage])

    // Fetch bicycle when id changes
    useEffect(() => {
        if (!id) {
            return
        }

        const fetchCycle = async () => {
            try {
                const bicycle: IBicycle = await fetchBicycle(id)
                setBicycle(bicycle)
                setNotFound(false)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    if (error.message === 'Bicycle not found') {
                        setNotFound(true)
                    }
                    else {
                        setErrorMessage(error.message)
                    }
                }
                else {
                    setErrorMessage('Error fetching bicycle')
                }
            }
        }

        fetchCycle()
    }, [id])

    // Create a new bicycle or update an existing one
    const handleSave = async (bicycle: IBicycle) => {
        if (!bicycle.brand || !bicycle.modelName || !bicycle.bicycleType) {
            setErrorMessage('Bicycle must have a brand, model and type')
            return
        }
        try {
            if (!id) {
                const createdBicycle = await createBicycle(bicycle)
                setMessage('Bicycle created successfully')
                setTimeout(() => {
                    navigate(`/bicycles/${createdBicycle._id}`)
                }, 2000)
            }
            else {
                const updatedBicycle = await updateBicycle(bicycle)
                setMessage('Bicycle saved successfully')
                setTimeout(() => {
                    navigate(`/bicycles/${updatedBicycle._id}`)
                }, 2000)
            }
        } catch (error: unknown) {
            setErrorMessage(error instanceof Error
                ? error.message
                : 'Error creating or saving bicycle'
            )
        }
    }

    // Render form for new bicycle
    if (!id) {
        return (
            <BicycleForm
                message={message}
                errorMessage={errorMessage}
                handleSave={handleSave}
            />
        )
    }

    // Render message if bicycle not found
    if (notFound) {
        return (
            <div>
                <h2>
                    Bicycle not found!
                </h2>
            </div>
        )
    }

    // Render form for existing bicycle
    return (
        <BicycleForm
            bicycle={bicycle}
            message={message}
            errorMessage={errorMessage}
            handleSave={handleSave}
        />
    )
}

export default BicycleFormPage
