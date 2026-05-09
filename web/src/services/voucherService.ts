import { getDB } from '../db'
import type { Voucher, VoucherEntry, VoucherWithEntries } from '../types'

export async function getAllVouchers(): Promise<Voucher[]> {
  const db = getDB()
  const vouchers = await db.getAll('vouchers')
  return vouchers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getVoucherById(id: string): Promise<VoucherWithEntries | undefined> {
  const db = getDB()
  const voucher = await db.get('vouchers', id)
  if (!voucher) return undefined

  const entries = await db.getAllFromIndex('voucherEntries', 'by-voucherId', id)
  return { ...voucher, entries }
}

export async function getNextVoucherNo(): Promise<number> {
  const db = getDB()
  const vouchers = await db.getAllFromIndex('vouchers', 'by-voucherNo')
  if (vouchers.length === 0) return 1
  return Math.max(...vouchers.map(v => v.voucherNo)) + 1
}

export async function createVoucher(voucher: Omit<Voucher, 'createdAt' | 'updatedAt'>, entries: Omit<VoucherEntry, 'id' | 'createdAt'>[]): Promise<void> {
  const db = getDB()
  const now = new Date().toISOString()

  const tx = db.transaction(['vouchers', 'voucherEntries'], 'readwrite')
  await tx.store('vouchers').add({ ...voucher, createdAt: now, updatedAt: now })
  
  for (let i = 0; i < entries.length; i++) {
    const entryId = `${voucher.id}-${i}-${Date.now()}`
    await tx.store('voucherEntries').add({ ...entries[i], id: entryId, createdAt: now })
  }
  await tx.done
}

export async function updateVoucher(id: string, updates: Partial<Omit<Voucher, 'id' | 'createdAt'>>, entries?: Omit<VoucherEntry, 'id' | 'createdAt'>[]): Promise<void> {
  const db = getDB()
  const now = new Date().toISOString()

  const tx = db.transaction(['vouchers', 'voucherEntries'], 'readwrite')
  const voucher = await tx.store('vouchers').get(id)
  if (!voucher) throw new Error('Voucher not found')

  await tx.store('vouchers').put({ ...voucher, ...updates, updatedAt: now })

  if (entries) {
    const oldEntries = await db.getAllFromIndex('voucherEntries', 'by-voucherId', id)
    for (const entry of oldEntries) {
      await tx.store('voucherEntries').delete(entry.id)
    }

    for (let i = 0; i < entries.length; i++) {
      const entryId = `${id}-${i}-${Date.now()}`
      await tx.store('voucherEntries').add({ ...entries[i], id: entryId, createdAt: now })
    }
  }
  await tx.done
}

export async function deleteVoucher(id: string): Promise<void> {
  const db = getDB()
  const tx = db.transaction(['vouchers', 'voucherEntries'], 'readwrite')

  const entries = await db.getAllFromIndex('voucherEntries', 'by-voucherId', id)
  for (const entry of entries) {
    await tx.store('voucherEntries').delete(entry.id)
  }
  await tx.store('vouchers').delete(id)
  await tx.done
}
