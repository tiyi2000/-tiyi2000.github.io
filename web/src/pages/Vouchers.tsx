import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store'
import { getNextVoucherNo } from '../services/voucherService'

const Vouchers = () => {
  const { vouchers, loadVouchers, deleteVoucher } = useAppStore()

  useEffect(() => {
    loadVouchers()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个凭证吗？')) {
      await deleteVoucher(id)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">凭证管理</h1>
        <Link
          to="/vouchers/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          + 新增凭证
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">凭证号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">摘要</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vouchers.map((voucher) => (
              <tr key={voucher.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-mono">{voucher.voucherNo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{voucher.date}</td>
                <td className="px-6 py-4">{voucher.summary || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-2">
                    {voucher.isAudited && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">已审核</span>
                    )}
                    {voucher.isPosted && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">已记账</span>
                    )}
                    {!voucher.isAudited && !voucher.isPosted && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">草稿</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Link
                    to={`/vouchers/${voucher.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    编辑
                  </Link>
                  <button
                    onClick={() => handleDelete(voucher.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Vouchers
