import { getDB } from '../db'
import * as XLSX from 'xlsx'
import type { AccountSubject, Voucher, VoucherEntry, SubjectBalance } from '../types'

export async function exportData(): Promise<Blob> {
  const db = getDB()
  const subjects = await db.getAll('subjects')
  const vouchers = await db.getAll('vouchers')
  const voucherEntries = await db.getAll('voucherEntries')

  const data = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    subjects,
    vouchers,
    voucherEntries,
  }

  return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
}

export async function importData(file: File): Promise<void> {
  const text = await file.text()
  const data = JSON.parse(text)

  const db = getDB()
  const tx = db.transaction(['subjects', 'vouchers', 'voucherEntries'], 'readwrite')

  await tx.store('subjects').clear()
  await tx.store('vouchers').clear()
  await tx.store('voucherEntries').clear()

  for (const item of data.subjects || []) {
    await tx.store('subjects').add(item)
  }
  for (const item of data.vouchers || []) {
    await tx.store('vouchers').add(item)
  }
  for (const item of data.voucherEntries || []) {
    await tx.store('voucherEntries').add(item)
  }

  await tx.done
}

export function exportToExcel(balances: SubjectBalance[], name: string): void {
  const worksheetData = balances.map(b => ({
    '科目编码': b.code,
    '科目名称': b.name,
    '科目类型': b.type === 'asset' ? '资产' : b.type === 'income' ? '收入' : '支出',
    '期初余额': b.beginningBalance,
    '本期借方': b.currentDebit,
    '本期贷方': b.currentCredit,
    '期末余额': b.endingBalance,
  }))

  const ws = XLSX.utils.json_to_sheet(worksheetData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, name)
  XLSX.writeFile(wb, `${name}.xlsx`)
}
