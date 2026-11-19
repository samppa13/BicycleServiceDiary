import { useEffect, useState } from 'react'
import type { IBicycle } from '../types/types'
import { useNavigate, useParams } from 'react-router-dom'
import { useBicycles } from '../hooks/useBicycles'
import Bicycle from '../components/Bicycle'

const BicyclePage = () => {
    const [bicycle, setBicycle] = useState<IBicycle | undefined>(undefined)
    const [notFound, setNotFound] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')

    const { id } = useParams()
    const navigate = useNavigate()
    const { fetchBicycle, deleteBicycle } = useBicycles()

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

    // Delete bicycle and navigate back to home page
    const handleDelete = async (id: string) => {
        try {
            const mess: string = await deleteBicycle(id)
            setMessage(mess)
            setNotFound(true)
            setTimeout(() => {
                navigate('/')
            }, 2000)
        } catch (error: unknown) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : 'Error deleting bicycle'
            )
        }
    }

    // Render message if bicycle not found
    if (notFound) {
        return (
            <div>
                {
                    message === 'Bicycle deleted successfully'
                    ? (
                        <p style={{ color: 'green' }}>{message}</p>
                    ) : (
                        <h2>
                            Bicycle not found
                        </h2>
                    )
                }
            </div>
        )
    }

    // Render loading indicator while fetching bicycle
    if (!bicycle) {
        return (
            <p>
                Loading bicycle...
            </p>
        )
    }

    // Render bicycle
    return (
        <Bicycle
            bicycle={bicycle}
            message={message}
            errorMessage={errorMessage}
            handleDelete={handleDelete}
        />
    )
}

export default BicyclePage
