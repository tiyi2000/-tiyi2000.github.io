import { useEffect, useState } from 'react'
import { useAppStore } from '../store'
import { exportToExcel } from '../services/dataService'
import { loadSubjectBalances } from '../services/ledgerService'

const Reports = () => {
  const { subjectBalances, loadSubjectBalances } = useAppStore()
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  useEffect(() => {
    loadSubjectBalances()
  }, [])

  const handleQuery = async () => {
    await loadSubjectBalances(startDate || undefined, endDate || undefined)
  }

  const handleExport = () => {
    exportToExcel(subjectBalances, `科目余额表_${new Date().toISOString().split('T')[0]}`)
  }

  const handlePrint = () => {
    window.print()
  }

  const typeLabels = { asset: '资产', income: '收入', expense: '支出' }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">报表管理</h1>
        <div className="flex gap-3 no-print">
          <button
            onClick={handlePrint}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            打印
          </button>
          <button
            onClick={handleExport}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            导出Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleQuery}
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors no-print"
            >
              查询
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold">科目余额表</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">科目编码</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">科目名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">期初余额</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">本期借方</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">本期贷方</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">期末余额</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subjectBalances.map((balance, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-mono">{balance.code}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{balance.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    balance.type === 'asset' ? 'bg-blue-100 text-blue-800' :
                    balance.type === 'income' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {typeLabels[balance.type as keyof typeof typeLabels]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-mono">{balance.beginningBalance.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-mono">{balance.currentDebit.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-mono">{balance.currentCredit.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-semibold">{balance.endingBalance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reports
