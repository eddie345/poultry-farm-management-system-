import { Link } from 'react-router-dom'

export default function Sidebar({ isOpen }) {
    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Egg Production', path: '/egg-production', icon: '🥚' },
        { name: 'Feed Stock', path: '/feed-stock', icon: '🌾' },
        { name: 'Mortality Records', path: '/mortality', icon: '📋' },
        { name: 'Reports', path: '/reports', icon: '📈' },
    ]

    if (!isOpen) return null

    return (
        <aside className="sidebar">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-2">🐔</span>
                    Poultry Farm
                </h1>
            </div>
            <nav className="mt-6">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="sidebar-item"
                    >
                        <span className="text-2xl mr-3">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    )
}
