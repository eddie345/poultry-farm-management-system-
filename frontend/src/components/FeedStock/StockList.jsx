import { useState, useEffect } from 'react'
import api from '../../utils/api'
import Card from '../Shared/Card'

export default function StockList() {
    const [stocks, setStocks] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        feedType: '',
        quantity: '',
        unit: 'kg',
        supplier: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        costPerUnit: ''
    })

    useEffect(() => {
        fetchStocks()
    }, [])

    const fetchStocks = async () => {
        try {
            const response = await api.get('/feed/stock')
            setStocks(response.data)
        } catch (error) {
            console.error('Error fetching stocks:', error)
            // Mock data
            setStocks([
                { _id: '1', feedType: 'Layer Mash', quantity: 500, unit: 'kg', supplier: 'ABC Feeds', purchaseDate: '2026-01-20', expiryDate: '2026-06-20', costPerUnit: 50 },
                { _id: '2', feedType: 'Grower Feed', quantity: 350, unit: 'kg', supplier: 'XYZ Suppliers', purchaseDate: '2026-01-18', expiryDate: '2026-07-18', costPerUnit: 45 },
                { _id: '3', feedType: 'Starter Feed', quantity: 150, unit: 'kg', supplier: 'ABC Feeds', purchaseDate: '2026-01-15', expiryDate: '2026-05-15', costPerUnit: 55 },
            ])
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post('/feed/stock', formData)
            fetchStocks()
            setShowForm(false)
            setFormData({
                feedType: '',
                quantity: '',
                unit: 'kg',
                supplier: '',
                purchaseDate: new Date().toISOString().split('T')[0],
                expiryDate: '',
                costPerUnit: ''
            })
        } catch (error) {
            console.error('Error adding stock:', error)
            alert('Failed to add feed stock')
        }
    }

    const getStockStatus = (quantity) => {
        if (quantity < 100) return { class: 'badge-danger', text: 'Low Stock' }
        if (quantity < 300) return { class: 'badge-warning', text: 'Medium' }
        return { class: 'badge-success', text: 'Good Stock' }
    }

    const totalStock = stocks.reduce((sum, stock) => sum + stock.quantity, 0)
    const totalValue = stocks.reduce((sum, stock) => sum + (stock.quantity * stock.costPerUnit), 0)

    return (
        <div className="space-y-6 fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Feed Stock Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary"
                >
                    {showForm ? 'Cancel' : '+ Add Feed Stock'}
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Stock</p>
                            <p className="text-3xl font-bold text-primary-600">{totalStock} kg</p>
                        </div>
                        <div className="text-4xl">🌾</div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Value</p>
                            <p className="text-3xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
                        </div>
                        <div className="text-4xl">💰</div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Feed Types</p>
                            <p className="text-3xl font-bold text-purple-600">{stocks.length}</p>
                        </div>
                        <div className="text-4xl">📦</div>
                    </div>
                </Card>
            </div>

            {/* Add Stock Form */}
            {showForm && (
                <Card title="Add New Feed Stock">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Feed Type</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.feedType}
                                onChange={(e) => setFormData({ ...formData, feedType: e.target.value })}
                                placeholder="e.g., Layer Mash"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Supplier</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.supplier}
                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                placeholder="Supplier name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                required
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Unit</label>
                            <select
                                className="input"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            >
                                <option>kg</option>
                                <option>bags</option>
                                <option>tons</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Cost Per Unit ($)</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.costPerUnit}
                                onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Purchase Date</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.purchaseDate}
                                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group md:col-span-2">
                            <label className="form-label">Expiry Date</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.expiryDate}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="btn btn-primary">
                                Add Feed Stock
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Stock Table */}
            <Card title="Current Feed Inventory">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Feed Type</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Supplier</th>
                                <th>Purchase Date</th>
                                <th>Expiry Date</th>
                                <th>Cost/Unit</th>
                                <th>Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock) => {
                                const status = getStockStatus(stock.quantity)
                                return (
                                    <tr key={stock._id}>
                                        <td className="font-semibold">{stock.feedType}</td>
                                        <td>{stock.quantity} {stock.unit}</td>
                                        <td><span className={`badge ${status.class}`}>{status.text}</span></td>
                                        <td>{stock.supplier}</td>
                                        <td>{new Date(stock.purchaseDate).toLocaleDateString()}</td>
                                        <td>{new Date(stock.expiryDate).toLocaleDateString()}</td>
                                        <td>${stock.costPerUnit}</td>
                                        <td className="font-semibold">${(stock.quantity * stock.costPerUnit).toFixed(2)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
