import { useState } from 'react'
import { exportData, importData } from '../services/dataService'

const Settings = () => {
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupInterval, setBackupInterval] = useState(30)

  const handleExport = async () => {
    const blob = await exportData()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `党费备份_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (confirm('导入将覆盖所有现有数据，确定要继续吗？')) {
        await importData(file)
        alert('导入成功！请刷新页面。')
      }
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">系统设置</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">数据备份</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">自动备份</div>
                <div className="text-sm text-gray-500">定期自动保存数据</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoBackup}
                  onChange={(e) => setAutoBackup(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">备份间隔（分钟）</label>
              <input
                type="number"
                value={backupInterval}
                onChange={(e) => setBackupInterval(Number(e.target.value))}
                className="w-full md:w-32 border rounded-lg px-3 py-2"
                disabled={!autoBackup}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">数据管理</h2>
          <div className="space-y-4">
            <div>
              <div className="font-medium mb-2">导出数据</div>
              <div className="text-sm text-gray-500 mb-3">将所有数据导出为 JSON 文件备份</div>
              <button
                onClick={handleExport}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                导出备份
              </button>
            </div>
            <div className="border-t pt-4">
              <div className="font-medium mb-2">导入数据</div>
              <div className="text-sm text-gray-500 mb-3">从 JSON 文件恢复数据（将覆盖现有数据）</div>
              <label className="inline-block cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <div className="px-4 py-2 border rounded-lg hover:bg-gray-50 inline-block">
                  选择文件导入
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">关于</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>党费记账软件</strong></p>
            <p>版本：1.0.0</p>
            <p>技术栈：React + TypeScript + Vite + IndexedDB</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
