import { useState } from 'react'
import api from '../../utils/api'
import Card from '../Shared/Card'

export default function ReportGenerator() {
    const [reportType, setReportType] = useState('production')
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    })
    const [loading, setLoading] = useState(false)
    const [reportData, setReportData] = useState(null)

    const reportTypes = [
        { value: 'production', label: 'Egg Production Report', icon: '🥚' },
        { value: 'feed', label: 'Feed Stock Report', icon: '🌾' },
        { value: 'mortality', label: 'Mortality Report', icon: '📋' },
        { value: 'financial', label: 'Financial Summary', icon: '💰' },
        { value: 'comprehensive', label: 'Comprehensive Report', icon: '📊' },
    ]

    const handleGenerateReport = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/reports/generate`, {
                params: {
                    type: reportType,
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                }
            })
            setReportData(response.data)
        } catch (error) {
            console.error('Error generating report:', error)
            // Mock report data
            setReportData({
                type: reportType,
                dateRange: dateRange,
                summary: getMockReportData(reportType)
            })
        } finally {
            setLoading(false)
        }
    }

    const getMockReportData = (type) => {
        switch (type) {
            case 'production':
                return {
                    totalEggs: 1425,
                    brokenEggs: 38,
                    averagePerDay: 203,
                    successRate: 97.3
                }
            case 'feed':
                return {
                    totalStock: 1000,
                    totalConsumption: 842,
                    averageConsumption: 120,
                    stockValue: 42100
                }
            case 'mortality':
                return {
                    totalDeaths: 12,
                    byAge: { Chick: 3, Juvenile: 2, Adult: 7 },
                    mortalityRate: 2.4,
                    commonCause: 'Natural causes'
                }
            case 'financial':
                return {
                    revenue: 8250,
                    expenses: 4210,
                    netProfit: 4040,
                    profitMargin: 49
                }
            default:
                return {}
        }
    }

    const handleExport = async (format) => {
        try {
            const response = await api.get(`/reports/export/${format}`, {
                params: {
                    type: reportType,
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                },
                responseType: 'blob'
            })

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${reportType}-report.${format}`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error('Error exporting report:', error)
            alert(`Export to ${format.toUpperCase()} will be available when backend is connected`)
        }
    }

    return (
        <div className="space-y-6 fade-in">
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>

            {/* Report Configuration */}
            <Card title="Generate Report">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-group md:col-span-3">
                        <label className="form-label">Report Type</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {reportTypes.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => setReportType(type.value)}
                                    className={`p-4 rounded-lg border-2 transition-all text-left ${reportType === type.value
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <span className="text-3xl mr-3">{type.icon}</span>
                                        <span className="font-medium">{type.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input
                            type="date"
                            className="input"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">End Date</label>
                        <input
                            type="date"
                            className="input"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        />
                    </div>

                    <div className="form-group flex items-end">
                        <button
                            onClick={handleGenerateReport}
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <span className="spinner mr-2"></span>
                                    Generating...
                                </span>
                            ) : (
                                'Generate Report'
                            )}
                        </button>
                    </div>
                </div>
            </Card>

            {/* Report Results */}
            {reportData && (
                <Card title={`${reportTypes.find(t => t.value === reportType)?.label}`}>
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Report Period</p>
                            <p className="font-semibold">
                                {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Report Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(reportData.summary).map(([key, value]) => (
                                <div key={key} className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </p>
                                    <p className="text-2xl font-bold text-primary-700">
                                        {typeof value === 'object' ? JSON.stringify(value) : value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Export Options */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4">Export Options</h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => handleExport('pdf')}
                                    className="btn btn-primary"
                                >
                                    📄 Export to PDF
                                </button>
                                <button
                                    onClick={() => handleExport('excel')}
                                    className="btn btn-success"
                                >
                                    📊 Export to Excel
                                </button>
                                <button
                                    onClick={() => handleExport('csv')}
                                    className="btn btn-secondary"
                                >
                                    📋 Export to CSV
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Recent Activity">
                    <ul className="space-y-3">
                        <li className="flex items-center text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                            <span>220 eggs collected today</span>
                        </li>
                        <li className="flex items-center text-sm">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                            <span>Feed stock updated</span>
                        </li>
                        <li className="flex items-center text-sm">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                            <span>Low stock alert: Layer Mash</span>
                        </li>
                    </ul>
                </Card>

                <Card title="Performance">
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Production Rate</span>
                                <span className="font-semibold">97%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '97%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Feed Efficiency</span>
                                <span className="font-semibold">85%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Alerts">
                    <div className="space-y-2">
                        <div className="flex items-start bg-yellow-50 p-3 rounded-lg">
                            <span className="text-yellow-600 mr-2">⚠️</span>
                            <div className="text-sm">
                                <p className="font-medium">Low Feed Stock</p>
                                <p className="text-gray-600">Layer Mash below 100kg</p>
                            </div>
                        </div>
                        <div className="flex items-start bg-green-50 p-3 rounded-lg">
                            <span className="text-green-600 mr-2">✅</span>
                            <div className="text-sm">
                                <p className="font-medium">All systems normal</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
