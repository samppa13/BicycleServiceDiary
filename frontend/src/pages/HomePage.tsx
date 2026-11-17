import { useAuth } from '../hooks/useAuth'

const HomePage = () => {
    const { user } = useAuth()

    return (
        <div>
            <h3>
                Welcome to your Bicycle Service Diary, {user?.username}!
            </h3>
        </div>
    )
}

export default HomePage
