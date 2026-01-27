import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from 'axios'
import Card from '../Shared/Card'

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalEggs: 0,
        feedStock: 0,
        mortality: 0,
        activeBirds: 0
    })
    const [chartData, setChartData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/dashboard/stats', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setStats(response.data.stats || {
                totalEggs: 1250,
                feedStock: 850,
                mortality: 12,
                activeBirds: 500
            })
            setChartData(response.data.chartData || generateMockData())
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            // Use mock data if API fails
            setStats({
                totalEggs: 1250,
                feedStock: 850,
                mortality: 12,
                activeBirds: 500
            })
            setChartData(generateMockData())
        } finally {
            setLoading(false)
        }
    }

    const generateMockData = () => {
        return [
            { date: 'Mon', eggs: 180, feed: 120 },
            { date: 'Tue', eggs: 200, feed: 115 },
            { date: 'Wed', eggs: 195, feed: 118 },
            { date: 'Thu', eggs: 210, feed: 122 },
            { date: 'Fri', eggs: 205, feed: 119 },
            { date: 'Sat', eggs: 220, feed: 125 },
            { date: 'Sun', eggs: 215, feed: 121 },
        ]
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 fade-in">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm font-medium">Total Eggs (This Week)</p>
                            <p className="text-4xl font-bold mt-2">{stats.totalEggs}</p>
                        </div>
                        <div className="text-5xl opacity-20">🥚</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm font-medium">Feed Stock (kg)</p>
                            <p className="text-4xl font-bold mt-2">{stats.feedStock}</p>
                        </div>
                        <div className="text-5xl opacity-20">🌾</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm font-medium">Mortality (This Month)</p>
                            <p className="text-4xl font-bold mt-2">{stats.mortality}</p>
                        </div>
                        <div className="text-5xl opacity-20">📋</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm font-medium">Active Birds</p>
                            <p className="text-4xl font-bold mt-2">{stats.activeBirds}</p>
                        </div>
                        <div className="text-5xl opacity-20">🐔</div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Egg Production Trend">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="eggs" stroke="#0ea5e9" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                <Card title="Feed Consumption">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="feed" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card title="Quick Actions">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="btn btn-primary p-4 flex flex-col items-center">
                        <span className="text-2xl mb-2">➕</span>
                        <span>Add Production</span>
                    </button>
                    <button className="btn btn-success p-4 flex flex-col items-center">
                        <span className="text-2xl mb-2">🌾</span>
                        <span>Update Feed</span>
                    </button>
                    <button className="btn btn-secondary p-4 flex flex-col items-center">
                        <span className="text-2xl mb-2">📊</span>
                        <span>View Reports</span>
                    </button>
                    <button className="btn btn-primary p-4 flex flex-col items-center">
                        <span className="text-2xl mb-2">📋</span>
                        <span>Add Record</span>
                    </button>
                </div>
            </Card>
        </div>
    )
}
