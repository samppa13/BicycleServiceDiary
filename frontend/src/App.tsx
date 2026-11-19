import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import RegisterPage from './pages/RegisterPage'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AuthRequire from './components/AuthRequire'
import { BicyclesProvider } from './context/BicyclesContext'
import BicycleFormPage from './pages/BicycleFormPage'
import BicyclePage from './pages/Bicyclepage'

const App = () => {
  return (
    <AuthProvider>
      <BicyclesProvider>
        <BrowserRouter>
          <div>
            <Header />
            <Routes>
              <Route element={<AuthRequire />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/bicycles/new' element={<BicycleFormPage />} />
                <Route path='/bicycles/:id' element={<BicyclePage />} />
                <Route path='/bicycles/:id/edit' element={<BicycleFormPage />} />
              </Route>
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/login' element={<LoginPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </BicyclesProvider>
    </AuthProvider>
  )
}

export default App
