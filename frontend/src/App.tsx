import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import RegisterPage from './pages/RegisterPage'

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path='/register' element={<RegisterPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
