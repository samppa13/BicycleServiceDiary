import { useEffect, useState } from 'react'
import { useBicycles } from '../hooks/useBicycles'
import { useNavigate } from 'react-router-dom'

const MyBicycles = () => {
    const [message, setMessage] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')

    const { bicycles, loading, fetchBicycles } = useBicycles()
    const navigate = useNavigate()

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

    // Fetch owned bicycles when component mounts
    useEffect(() => {
        const fetchCycles = async () => {
            try {
                await fetchBicycles()
            } catch (error: unknown) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    setErrorMessage(error.message)
                }
            }
        }
        fetchCycles()
    }, [fetchBicycles])

    return (
        <div>
            {/* Bicycle creation */}
            <button
                onClick={() => navigate(`/bicycles/new`)}
            >
                Create a new bicycle
            </button>

            {/* Display messages */}
            {
                message
                && <p style={{ color: 'green' }}>
                    {message}
                </p>
            }
            {
                errorMessage
                && <p style={{ color: 'red' }}>
                    {errorMessage}
                </p>
            }

            {/* Bicycles cards or empty state */}
            {loading ? (
                <p>Loading bicycles...</p>
            ) : !bicycles || bicycles?.length === 0 ? (
                <h2>
                    You have not any bicycles.
                </h2>
            ) : (
                <>
                    {
                        bicycles?.map((bicycle) => (
                            <div
                                key={bicycle._id}
                                onClick={() => navigate(`/bicycles/${bicycle._id}`)}
                            >
                                <h2>
                                    {bicycle.brand} {bicycle.modelName}
                                </h2>
                                <h4>
                                    {bicycle.bicycleType}
                                </h4>
                            </div>
                        ))
                    }
                </>
            )}
        </div>
    )
}

export default MyBicycles
