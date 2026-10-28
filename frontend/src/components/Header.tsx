import { Link } from 'react-router-dom'

const Header = () => {
    // Render navigation bar
    return (
        <div>
            <h2>Bicycle Service Diary App</h2>
            <Link to='/register'>Register</Link>
        </div>
    )
}

export default Header
