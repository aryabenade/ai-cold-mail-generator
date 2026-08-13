import { Toaster } from "react-hot-toast"
import { useAuth } from "./context/AuthContext"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import VerifyOtp from "./pages/VerifyOtp"
import Dashboard from "./pages/Dashboard"

const App = () => {

  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-primary-500">Loading...</div>
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )

}

export default App