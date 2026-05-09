import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { getNextVoucherNo } from '../services/voucherService'

interface EntryForm {
  subjectId: string
  summary: string
  debit: number
  credit: number
}

const VoucherForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { subjects, currentVoucher, loadSubjects, loadVoucherById, addVoucher, updateVoucher } = useAppStore()
  
  const [voucherNo, setVoucherNo] = useState(0)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [summary, setSummary] = useState('')
  const [isAudited, setIsAudited] = useState(false)
  const [isPosted, setIsPosted] = useState(false)
  const [entries, setEntries] = useState<EntryForm[]>([
    { subjectId: '', summary: '', debit: 0, credit: 0 }
  ])

  useEffect(() => {
    loadSubjects()
    if (id) {
      loadVoucherById(id)
    } else {
      getNextVoucherNo().then(setVoucherNo)
    }
  }, [id])

  useEffect(() => {
    if (currentVoucher && id) {
      setVoucherNo(currentVoucher.voucherNo)
      setDate(currentVoucher.date)
      setSummary(currentVoucher.summary || '')
      setIsAudited(currentVoucher.isAudited)
      setIsPosted(currentVoucher.isPosted)
      setEntries(
        currentVoucher.entries.map(e => ({
          subjectId: e.subjectId,
          summary: e.summary || '',
          debit: e.debit,
          credit: e.credit,
        }))
      )
    }
  }, [currentVoucher])

  const addEntry = () => {
    setEntries([...entries, { subjectId: '', summary: '', debit: 0, credit: 0 }])
  }

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index))
    }
  }

  const updateEntry = (index: number, field: keyof EntryForm, value: any) => {
    const newEntries = [...entries]
    newEntries[index] = { ...newEntries[index], [field]: value }
    setEntries(newEntries)
  }

  const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0)
  const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0)
  const isBalanced = totalDebit === totalCredit && totalDebit > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isBalanced) {
      alert('借贷不平衡！')
      return
    }

    const voucherData = {
      id: id || Date.now().toString(),
      voucherNo,
      date,
      summary: summary || null,
      isAudited,
      isPosted,
    }

    const entriesData = entries
      .filter(e => e.subjectId && (e.debit > 0 || e.credit > 0))
      .map(e => ({
        voucherId: id || Date.now().toString(),
        subjectId: e.subjectId,
        summary: e.summary || null,
        debit: e.debit,
        credit: e.credit,
      }))

    if (id) {
      await updateVoucher(id, voucherData, entriesData)
    } else {
      await addVoucher(voucherData, entriesData)
    }

    navigate('/vouchers')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{id ? '编辑凭证' : '新增凭证'}</h1>
        <button
          onClick={() => navigate('/vouchers')}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          返回
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">凭证号</label>
              <input
                type="number"
                required
                value={voucherNo}
                onChange={(e) => setVoucherNo(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
              <input
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="可选"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAudited}
                onChange={(e) => setIsAudited(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">已审核</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPosted}
                onChange={(e) => setIsPosted(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">已记账</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">分录</h2>
            <button
              type="button"
              onClick={addEntry}
              className="text-primary hover:text-primary-dark"
            >
              + 添加行
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">科目</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">摘要</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">借方</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">贷方</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-3 py-2">
                      <select
                        value={entry.subjectId}
                        onChange={(e) => updateEntry(index, 'subjectId', e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      >
                        <option value="">选择科目</option>
                        {subjects.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.code} - {s.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={entry.summary}
                        onChange={(e) => updateEntry(index, 'summary', e.target.value)}
                        className="w-full border rounded px-2 py-1"
                        placeholder="可选"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={entry.debit}
                        onChange={(e) => updateEntry(index, 'debit', Number(e.target.value))}
                        className="w-full border rounded px-2 py-1 text-right"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={entry.credit}
                        onChange={(e) => updateEntry(index, 'credit', Number(e.target.value))}
                        className="w-full border rounded px-2 py-1 text-right"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeEntry(index)}
                        className="text-red-600 hover:text-red-800"
                        disabled={entries.length <= 1}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td colSpan={2} className="px-3 py-2 text-right">合计：</td>
                  <td className="px-3 py-2 text-right">{totalDebit.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right">{totalCredit.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className={`mt-4 text-sm ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
            {isBalanced ? '✓ 借贷平衡' : '✗ 借贷不平衡'}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!isBalanced}
            className={`px-6 py-2 rounded-lg ${isBalanced ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            保存
          </button>
          <button
            type="button"
            onClick={() => navigate('/vouchers')}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}

export default VoucherForm
