import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Auth/Login'
import Dashboard from './components/Dashboard/Dashboard'
import ProductionTracker from './components/EggProduction/ProductionTracker'
import StockList from './components/FeedStock/StockList'
import MortalityRecords from './components/Mortality/MortalityRecords'
import ReportGenerator from './components/Reports/ReportGenerator'
import Navbar from './components/Shared/Navbar'
import Sidebar from './components/Shared/Sidebar'

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token')
        if (token) {
            setIsAuthenticated(true)
        }
    }, [])

    const handleLogin = () => {
        setIsAuthenticated(true)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
    }

    if (!isAuthenticated) {
        return (
            <Router>
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        )
    }

    return (
        <Router>
            <div className="flex h-screen bg-gray-50">
                <Sidebar isOpen={sidebarOpen} />
                <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
                    <Navbar onLogout={handleLogout} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <main className="flex-1 overflow-y-auto p-6">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/egg-production" element={<ProductionTracker />} />
                            <Route path="/feed-stock" element={<StockList />} />
                            <Route path="/mortality" element={<MortalityRecords />} />
                            <Route path="/reports" element={<ReportGenerator />} />
                            <Route path="*" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    )
}

export default App
