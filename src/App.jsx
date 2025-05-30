import { Routes, Route } from 'react-router-dom'
import Header from './components/header'
import Home from './components/home'
import Login from './components/auth/login'
import Register from './components/auth/register'
import Profile from './components/profile/profile'
import About from './components/about'
import Privacy from './components/p_and_t/privaterms'
import CategoryDetail from './components/detail/category_detail'
import PrivateRoute from './components/auth/private_route'

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy_policy" element={<Privacy />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/category/:id"
            element={
              <PrivateRoute>
                <CategoryDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App 