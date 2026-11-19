import type React from 'react'
import type { IBicycle } from '../types/types'
import { useNavigate } from 'react-router-dom'

interface BicycleProps {
    bicycle: IBicycle
    message: string
    errorMessage: string
    handleDelete: (id: string) => void
}

const Bicycle: React.FC<BicycleProps> = ({ bicycle, message, errorMessage, handleDelete }) => {
    const navigate = useNavigate()

    // Render bicycle information
    return (
        <div>
            <h1>
                {bicycle.brand} {bicycle.modelName}
            </h1>

            {/* Display bicycle details */}
            <table>
                <tbody>
                    <tr>
                        <th>Brand</th>
                        <td>
                            {bicycle.brand}
                        </td>
                    </tr>
                    <tr>
                        <th>Model</th>
                        <td>
                            {bicycle.modelName}
                        </td>
                    </tr>
                    <tr>
                        <th>Type</th>
                        <td>
                            {bicycle.bicycleType}
                        </td>
                    </tr>
                    <tr>
                        <th>Model year</th>
                        <td>
                            {bicycle.modelYear ?? '-'}
                        </td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>
                            {bicycle.description || '-'}
                        </td>
                    </tr>
                    <tr>
                        <th>Serial number</th>
                        <td>
                            {bicycle.serialNumber || '-'}
                        </td>
                    </tr>
                    <tr>
                        <th>Purchase date</th>
                        <td>
                            {
                                bicycle.purchaseDate
                                    ? new Date(bicycle.purchaseDate).toLocaleDateString()
                                    : '-'
                            }
                        </td>
                    </tr>
                    <tr>
                        <th>Purchase price</th>
                        <td>
                            {
                                bicycle.purchasePrice != null
                                    ? `${bicycle.purchasePrice} €`
                                    : '-'
                            }
                        </td>
                    </tr>
                    <tr>
                        <th>Color</th>
                        <td>
                            {bicycle.color || '-'}
                        </td>
                    </tr>
                    <tr>
                        <th>Frame size</th>
                        <td>
                            {bicycle.frameSize || '-'}
                        </td>
                    </tr>
                    <tr>
                        <th>Wheel size</th>
                        <td>
                            {bicycle.wheelSize || '-'}
                        </td>
                    </tr>
                    <tr>
                        <th>Created</th>
                        <td>
                            {
                                bicycle.createdAt
                                    ? new Date(bicycle.createdAt).toLocaleString()
                                    : '-'
                            }
                        </td>
                    </tr>
                    <tr>
                        <th>Last updated</th>
                        <td>
                            {
                                bicycle.updatedAt
                                    ? new Date(bicycle.updatedAt).toLocaleString()
                                    : '-'
                            }
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Navigation and bicycle action buttons */}
            <div>
                <button onClick={() => navigate('/')}>
                    Back to home
                </button>
                <button onClick={() => navigate(`/bicycles/${bicycle._id}/edit`)}>
                    Edit bicycle
                </button>
                <button onClick={() => handleDelete(bicycle._id)}>
                    Delete bicycle
                </button>
            </div>

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
        </div>
    )
}

export default Bicycle
