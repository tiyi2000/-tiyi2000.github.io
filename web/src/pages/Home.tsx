import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store'

const Home = () => {
  const { subjects, vouchers, loadSubjects, loadVouchers } = useAppStore()

  useEffect(() => {
    loadSubjects()
    loadVouchers()
  }, [])

  const stats = [
    { label: '科目数量', value: subjects.length, icon: '📚' },
    { label: '凭证数量', value: vouchers.length, icon: '📝' },
    { label: '已审核', value: vouchers.filter(v => v.isAudited).length, icon: '✅' },
    { label: '已记账', value: vouchers.filter(v => v.isPosted).length, icon: '📖' },
  ]

  const quickActions = [
    { path: '/vouchers/new', label: '新建凭证', icon: '➕', bg: 'bg-green-500' },
    { path: '/subjects', label: '科目管理', icon: '📚', bg: 'bg-blue-500' },
    { path: '/ledgers', label: '查询账簿', icon: '📖', bg: 'bg-purple-500' },
    { path: '/settings', label: '系统设置', icon: '⚙️', bg: 'bg-gray-500' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">欢迎使用党费记账</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="text-4xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-primary">{stat.value}</div>
            <div className="text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">快捷操作</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className={`${action.bg} text-white rounded-xl p-6 text-center hover:opacity-90 transition-opacity`}
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <div className="font-semibold">{action.label}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
