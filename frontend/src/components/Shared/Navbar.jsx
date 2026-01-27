export default function Navbar({ onLogout, toggleSidebar }) {
    const user = JSON.parse(localStorage.getItem('user') || '{"username": "Admin"}')

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
                <button
                    onClick={toggleSidebar}
                    className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h2 className="text-xl font-semibold text-gray-800">Poultry Farm Management</h2>
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500">Farm Administrator</p>
                </div>
                <button
                    onClick={onLogout}
                    className="btn btn-danger"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}
