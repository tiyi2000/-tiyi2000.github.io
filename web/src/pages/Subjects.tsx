import { useEffect, useState } from 'react'
import { useAppStore } from '../store'
import type { AccountSubject } from '../types'

const Subjects = () => {
  const { subjects, loadSubjects, addSubject, updateSubject, deleteSubject } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    code: '',
    name: '',
    type: 'asset' as const,
    parentId: null,
    level: 1,
    balance: 0,
    isLeaf: true,
  })

  useEffect(() => {
    loadSubjects()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      await updateSubject(editingId, form)
    } else {
      await addSubject({ ...form, id: Date.now().toString() })
    }
    resetForm()
  }

  const handleEdit = (subject: AccountSubject) => {
    setEditingId(subject.id)
    setForm(subject)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个科目吗？')) {
      await deleteSubject(id)
    }
  }

  const resetForm = () => {
    setForm({ code: '', name: '', type: 'asset', parentId: null, level: 1, balance: 0, isLeaf: true })
    setEditingId(null)
    setShowForm(false)
  }

  const typeLabels = { asset: '资产', income: '收入', expense: '支出' }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">科目管理</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          {showForm ? '取消' : '+ 新增科目'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">{editingId ? '编辑科目' : '新增科目'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">科目编码</label>
              <input
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">科目名称</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">科目类型</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="asset">资产</option>
                <option value="income">收入</option>
                <option value="expense">支出</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark">
                保存
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg border hover:bg-gray-50">
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">编码</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">余额</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subjects.map((subject) => (
              <tr key={subject.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{subject.code}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{subject.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    subject.type === 'asset' ? 'bg-blue-100 text-blue-800' :
                    subject.type === 'income' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {typeLabels[subject.type]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-mono">{subject.balance.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button onClick={() => handleEdit(subject)} className="text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button onClick={() => handleDelete(subject.id)} className="text-red-600 hover:text-red-800">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Subjects
