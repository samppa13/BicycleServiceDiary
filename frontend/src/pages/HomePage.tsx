import MyBicycles from '../components/MyBicycles'
import { useAuth } from '../hooks/useAuth'

const HomePage = () => {
    const { user } = useAuth()

    // HomePage component that shows a welcome message
    // and the MyBicycles component
    return (
        <div>
            <h3>
                Welcome to your Bicycle Service Diary, {user?.username}!
            </h3>
            <MyBicycles />
        </div>
    )
}

export default HomePage
