import { getDB } from '../db'
import type { LedgerEntry, SubjectBalance } from '../types'
import { getAllSubjects, getSubjectById } from './subjectService'

export async function getLedgerBySubject(subjectId: string, startDate?: string, endDate?: string): Promise<LedgerEntry[]> {
  const db = getDB()
  const subject = await getSubjectById(subjectId)
  if (!subject) return []

  const allEntries = await db.getAllFromIndex('voucherEntries', 'by-subjectId', subjectId)
  const voucherIds = [...new Set(allEntries.map(e => e.voucherId))]

  const entries: LedgerEntry[] = []
  let balance = 0

  for (const voucherId of voucherIds) {
    const voucher = await db.get('vouchers', voucherId)
    if (!voucher) continue

    if (startDate && new Date(voucher.date) < new Date(startDate)) continue
    if (endDate && new Date(voucher.date) > new Date(endDate)) continue

    const voucherEntries = await db.getAllFromIndex('voucherEntries', 'by-voucherId', voucherId)
    const subjectEntries = voucherEntries.filter(e => e.subjectId === subjectId)

    for (const entry of subjectEntries) {
      balance += entry.debit - entry.credit
      entries.push({
        id: entry.id,
        date: voucher.date,
        voucherNo: voucher.voucherNo,
        summary: entry.summary || voucher.summary,
        subjectCode: subject.code,
        subjectName: subject.name,
        debit: entry.debit,
        credit: entry.credit,
        balance: balance,
      })
    }
  }

  return entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export async function getSubjectBalances(startDate?: string, endDate?: string): Promise<SubjectBalance[]> {
  const subjects = await getAllSubjects()
  const db = getDB()
  const allVouchers = await db.getAll('vouchers')
  const balances: SubjectBalance[] = []

  for (const subject of subjects) {
    const entries = await db.getAllFromIndex('voucherEntries', 'by-subjectId', subject.id)
    let currentDebit = 0
    let currentCredit = 0

    for (const entry of entries) {
      const voucher = await db.get('vouchers', entry.voucherId)
      if (!voucher) continue

      if (startDate && new Date(voucher.date) < new Date(startDate)) continue
      if (endDate && new Date(voucher.date) > new Date(endDate)) continue

      currentDebit += entry.debit
      currentCredit += entry.credit
    }

    balances.push({
      id: subject.id,
      code: subject.code,
      name: subject.name,
      type: subject.type,
      beginningBalance: 0,
      currentDebit,
      currentCredit,
      endingBalance: currentDebit - currentCredit,
    })
  }

  return balances
}
