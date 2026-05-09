import { useEffect, useState } from 'react'
import { useAppStore } from '../store'
import { getLedgerBySubject } from '../services/ledgerService'
import type { LedgerEntry } from '../types'

const Ledgers = () => {
  const { subjects, loadSubjects } = useAppStore()
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [ledger, setLedger] = useState<LedgerEntry[]>([])

  useEffect(() => {
    loadSubjects()
  }, [])

  const handleQuery = async () => {
    if (!selectedSubjectId) {
      alert('请选择科目')
      return
    }
    const data = await getLedgerBySubject(selectedSubjectId, startDate || undefined, endDate || undefined)
    setLedger(data)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">账簿查询</h1>
        <button
          onClick={handlePrint}
          className="no-print bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          打印
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">科目</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">选择科目</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
              ))}
            </select>
          </div>
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
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              查询
            </button>
          </div>
        </div>
      </div>

      {ledger.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold">
              {subjects.find(s => s.id === selectedSubjectId)?.code} - {subjects.find(s => s.id === selectedSubjectId)?.name}
            </h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">凭证号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">摘要</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">借方</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">贷方</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">余额</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ledger.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{entry.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono">{entry.voucherNo}</td>
                  <td className="px-6 py-4">{entry.summary || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-mono">{entry.debit > 0 ? entry.debit.toFixed(2) : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-mono">{entry.credit > 0 ? entry.credit.toFixed(2) : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-semibold">{entry.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Ledgers
