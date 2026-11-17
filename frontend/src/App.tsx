import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import RegisterPage from './pages/RegisterPage'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AuthRequire from './components/AuthRequire'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          <Header />
          <Routes>
            <Route element={<AuthRequire />}>
              <Route path='/' element={<HomePage />} />
            </Route>
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/login' element={<LoginPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
