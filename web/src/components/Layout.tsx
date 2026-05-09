import { Outlet, Link, useLocation } from 'react-router-dom'

const Layout = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/subjects', label: '科目管理', icon: '📚' },
    { path: '/vouchers', label: '凭证管理', icon: '📝' },
    { path: '/ledgers', label: '账簿查询', icon: '📖' },
    { path: '/reports', label: '报表管理', icon: '📊' },
    { path: '/settings', label: '系统设置', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-gradient-to-b from-primary-dark to-primary text-white">
          <div className="p-6 border-b border-white/20">
            <h1 className="text-xl font-bold">党费记账</h1>
            <p className="text-sm opacity-80 mt-1">单机版本</p>
          </div>
          <nav className="p-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  location.pathname === item.path
                    ? 'bg-white/20 font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
