import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from '../Shared/Card'

export default function ProductionTracker() {
    const [productions, setProductions] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        totalEggs: '',
        brokenEggs: '',
        collectionTime: 'Morning',
        notes: ''
    })

    useEffect(() => {
        fetchProductions()
    }, [])

    const fetchProductions = async () => {
        try {
            const response = await axios.get('/api/eggs/production', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setProductions(response.data)
        } catch (error) {
            console.error('Error fetching productions:', error)
            // Mock data for demonstration
            setProductions([
                { _id: '1', date: '2026-01-25', totalEggs: 220, brokenEggs: 5, collectionTime: 'Morning', notes: 'Good production' },
                { _id: '2', date: '2026-01-24', totalEggs: 215, brokenEggs: 3, collectionTime: 'Evening', notes: '' },
                { _id: '3', date: '2026-01-23', totalEggs: 210, brokenEggs: 7, collectionTime: 'Morning', notes: 'Slight decrease' },
            ])
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/api/eggs/production', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            fetchProductions()
            setShowForm(false)
            setFormData({
                date: new Date().toISOString().split('T')[0],
                totalEggs: '',
                brokenEggs: '',
                collectionTime: 'Morning',
                notes: ''
            })
        } catch (error) {
            console.error('Error adding production:', error)
            alert('Failed to add production record')
        }
    }

    const calculateTotals = () => {
        return productions.reduce((acc, prod) => ({
            total: acc.total + prod.totalEggs,
            broken: acc.broken + prod.brokenEggs
        }), { total: 0, broken: 0 })
    }

    const totals = calculateTotals()

    return (
        <div className="space-y-6 fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Egg Production</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary"
                >
                    {showForm ? 'Cancel' : '+ Add Production'}
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Eggs (Week)</p>
                            <p className="text-3xl font-bold text-primary-600">{totals.total}</p>
                        </div>
                        <div className="text-4xl">🥚</div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Broken Eggs</p>
                            <p className="text-3xl font-bold text-red-600">{totals.broken}</p>
                        </div>
                        <div className="text-4xl">💔</div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Success Rate</p>
                            <p className="text-3xl font-bold text-green-600">
                                {totals.total > 0 ? ((totals.total - totals.broken) / totals.total * 100).toFixed(1) : 0}%
                            </p>
                        </div>
                        <div className="text-4xl">✅</div>
                    </div>
                </Card>
            </div>

            {/* Add Production Form */}
            {showForm && (
                <Card title="Add New Production Record">
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
                            <label className="form-label">Collection Time</label>
                            <select
                                className="input"
                                value={formData.collectionTime}
                                onChange={(e) => setFormData({ ...formData, collectionTime: e.target.value })}
                            >
                                <option>Morning</option>
                                <option>Afternoon</option>
                                <option>Evening</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Total Eggs</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.totalEggs}
                                onChange={(e) => setFormData({ ...formData, totalEggs: e.target.value })}
                                required
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Broken Eggs</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.brokenEggs}
                                onChange={(e) => setFormData({ ...formData, brokenEggs: e.target.value })}
                                required
                                min="0"
                            />
                        </div>
                        <div className="form-group md:col-span-2">
                            <label className="form-label">Notes (Optional)</label>
                            <textarea
                                className="input"
                                rows="3"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any observations or notes..."
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="btn btn-primary">
                                Save Production Record
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Production History Table */}
            <Card title="Production History">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Total Eggs</th>
                                <th>Broken</th>
                                <th>Good Eggs</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productions.map((prod) => (
                                <tr key={prod._id}>
                                    <td>{new Date(prod.date).toLocaleDateString()}</td>
                                    <td><span className="badge badge-info">{prod.collectionTime}</span></td>
                                    <td className="font-semibold">{prod.totalEggs}</td>
                                    <td className="text-red-600">{prod.brokenEggs}</td>
                                    <td className="text-green-600 font-semibold">{prod.totalEggs - prod.brokenEggs}</td>
                                    <td className="text-gray-600">{prod.notes || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
