import type React from 'react'
import type { IBicycle } from '../types/types'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface BicycleFormProps {
    bicycle?: IBicycle
    message: string
    errorMessage: string
    handleSave: (bicycle: IBicycle) => void
}

const BicycleForm: React.FC<BicycleFormProps> = ({ bicycle, message, errorMessage, handleSave }) => {
    const [formData, setFormData] = useState<Partial<IBicycle>>(bicycle ?? {})

    const navigate = useNavigate()

    // Update form data when the bicycle prop changes
    useEffect(() => {
        setFormData(bicycle ?? {})
    }, [bicycle])

    const id = bicycle?._id

    // Handle changes in form inputs
    const handleFormData = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target

        setFormData((prev) => ({
            ...prev,
            [name]: event.target.type === 'number'
                ? value === '' ? undefined : Number(value)
                : value
        }))
    }

    // Render the bicycle form
    return (
        <div>
            {/* Bicycle information fields */}
            <form>
                <div>
                    <label htmlFor='brand'>Brand</label>
                    <input
                        type='text'
                        name='brand'
                        id='brand'
                        value={formData.brand ?? ''}
                        onChange={handleFormData}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='modelName'>Model</label>
                    <input
                        type='text'
                        name='modelName'
                        id='modelName'
                        value={formData.modelName ?? ''}
                        onChange={handleFormData}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='bicycleType'>Type</label>
                    <input
                        type='text'
                        name='bicycleType'
                        id='bicycleType'
                        value={formData.bicycleType ?? ''}
                        onChange={handleFormData}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='modelYear'>Model year</label>
                    <input
                        type='number'
                        name='modelYear'
                        id='modelYear'
                        value={formData.modelYear ?? ''}
                        onChange={handleFormData}
                    />
                </div>
                <div>
                    <label htmlFor='description'>Description</label>
                    <textarea
                        name='description'
                        id='description'
                        value={formData.description ?? ''}
                        onChange={handleFormData}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor='serialNumber'>Serial number</label>
                    <input
                        type='text'
                        name='serialNumber'
                        id='serialNumber'
                        value={formData.serialNumber ?? ''}
                        onChange={handleFormData}
                    />
                </div>
                <div>
                    <label htmlFor='purchaseDate'>Purchase date</label>
                    <input
                        type='date'
                        name='purchaseDate'
                        id='purchaseDate'
                        value={formData.purchaseDate ?? ''}
                        onChange={handleFormData}
                    />
                </div>
                <div>
                    <label htmlFor='purchasePrice'>Purchase price</label>
                    <input
                        type='number'
                        name='purchasePrice'
                        id='purchasePrice'
                        value={formData.purchasePrice ?? ''}
                        onChange={handleFormData}
                    />
                </div>
                <div>
                    <label htmlFor='color'>Color</label>
                    <input
                        type='text'
                        name='color'
                        id='color'
                        value={formData.color ?? ''}
                        onChange={handleFormData}
                    />
                </div>
                <div>
                    <label htmlFor='frameSize'>Frame size</label>
                    <input
                        type='text'
                        name='frameSize'
                        id='frameSize'
                        value={formData.frameSize ?? ''}
                        onChange={handleFormData}
                    />
                </div>
                <div>
                    <label htmlFor='wheelSize'>Wheel size</label>
                    <input
                        type='text'
                        name='wheelSize'
                        id='wheelSize'
                        value={formData.wheelSize ?? ''}
                        onChange={handleFormData}
                    />
                </div>
            </form>

            {/* Form actions */}
            <button onClick={() => id ? navigate(`/bicycles/${id}`) : navigate('/')}>
                Cancel
            </button>
            <button onClick={() => handleSave({
                ...formData,
                _id: bicycle?._id ?? '',
                brand: formData.brand ?? '',
                modelName: formData.modelName ?? '',
                bicycleType: formData.bicycleType ?? ''
            })}>
                Save
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
        </div>
    )
}

export default BicycleForm
