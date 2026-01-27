import { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Card from '../Shared/Card'

export default function MortalityRecords() {
    const [records, setRecords] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        count: '',
        ageGroup: 'Adult',
        cause: '',
        notes: ''
    })

    useEffect(() => {
        fetchRecords()
    }, [])

    const fetchRecords = async () => {
        try {
            const response = await axios.get('/api/mortality/records', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setRecords(response.data)
        } catch (error) {
            console.error('Error fetching mortality records:', error)
            // Mock data
            setRecords([
                { _id: '1', date: '2026-01-25', count: 2, ageGroup: 'Adult', cause: 'Natural causes', notes: '' },
                { _id: '2', date: '2026-01-24', count: 1, ageGroup: 'Chick', cause: 'Disease', notes: 'Isolated immediately' },
                { _id: '3', date: '2026-01-22', count: 3, ageGroup: 'Adult', cause: 'Predator attack', notes: 'Enhanced security' },
                { _id: '4', date: '2026-01-20', count: 1, ageGroup: 'Juvenile', cause: 'Unknown', notes: 'Under investigation' },
            ])
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/api/mortality/records', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            fetchRecords()
            setShowForm(false)
            setFormData({
                date: new Date().toISOString().split('T')[0],
                count: '',
                ageGroup: 'Adult',
                cause: '',
                notes: ''
            })
        } catch (error) {
            console.error('Error adding mortality record:', error)
            alert('Failed to add mortality record')
        }
    }

    const totalMortality = records.reduce((sum, record) => sum + record.count, 0)
    const mortalityByAgeGroup = records.reduce((acc, record) => {
        acc[record.ageGroup] = (acc[record.ageGroup] || 0) + record.count
        return acc
    }, {})

    const chartData = records.slice(0, 7).reverse().map(record => ({
        date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: record.count
    }))

    return (
        <div className="space-y-6 fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Mortality Records</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-danger"
                >
                    {showForm ? 'Cancel' : '+ Add Mortality Record'}
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Mortality</p>
                            <p className="text-3xl font-bold text-red-600">{totalMortality}</p>
                        </div>
                        <div className="text-4xl">📋</div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Chicks</p>
                            <p className="text-2xl font-bold text-gray-700">{mortalityByAgeGroup['Chick'] || 0}</p>
                        </div>
                        <div className="text-3xl">🐣</div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Juveniles</p>
                            <p className="text-2xl font-bold text-gray-700">{mortalityByAgeGroup['Juvenile'] || 0}</p>
                        </div>
                        <div className="text-3xl">🐥</div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Adults</p>
                            <p className="text-2xl font-bold text-gray-700">{mortalityByAgeGroup['Adult'] || 0}</p>
                        </div>
                        <div className="text-3xl">🐔</div>
                    </div>
                </Card>
            </div>

            {/* Mortality Trend Chart */}
            <Card title="Mortality Trend (Last 7 Days)">
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#dc2626" strokeWidth={2} name="Deaths" />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            {/* Add Mortality Form */}
            {showForm && (
                <Card title="Record Mortality">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Number of Deaths</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.count}
                                onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                                required
                                min="1"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Age Group</label>
                            <select
                                className="input"
                                value={formData.ageGroup}
                                onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                            >
                                <option>Chick</option>
                                <option>Juvenile</option>
                                <option>Adult</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Cause</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.cause}
                                onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                                placeholder="e.g., Disease, Natural causes"
                                required
                            />
                        </div>
                        <div className="form-group md:col-span-2">
                            <label className="form-label">Notes (Optional)</label>
                            <textarea
                                className="input"
                                rows="3"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any additional observations or actions taken..."
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="btn btn-danger">
                                Record Mortality
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Mortality Records Table */}
            <Card title="Mortality History">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Count</th>
                                <th>Age Group</th>
                                <th>Cause</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record) => (
                                <tr key={record._id}>
                                    <td>{new Date(record.date).toLocaleDateString()}</td>
                                    <td><span className="badge badge-danger">{record.count}</span></td>
                                    <td><span className="badge badge-info">{record.ageGroup}</span></td>
                                    <td className="font-semibold">{record.cause}</td>
                                    <td className="text-gray-600">{record.notes || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
