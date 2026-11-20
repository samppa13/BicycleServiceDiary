import { useAuth } from './useAuth'

export const useApi = () => {
    const { accessToken, logout, refreshAuth } = useAuth()

    const apiFetch = async (url: string, options: RequestInit = {}) => {
        if (!accessToken) {
            throw new Error('Not authenticated')
        }

        // Send API request with the provided access token
        const makeRequest = (token: string) => {
            const headers = new Headers(options.headers)
            headers.set('Authorization', `Bearer ${token}`)

            return fetch(url, {
                ...options,
                headers
            })
        }

        let response: Response = await makeRequest(accessToken)

        // If access token has expired, refresh it
        if (response.status === 401) {
            try {
                const newAccessToken = await refreshAuth()

                // Retry original request with new token
                response = await makeRequest(newAccessToken)
            } catch (error: unknown) {
                // Log out the user if token refresh fails
                logout()
                throw new Error('Session expired. Please log in again.')
            }
        }

        return response
    }

    return { apiFetch }
}
