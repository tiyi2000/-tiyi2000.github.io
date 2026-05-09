import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { AccountSubject, Voucher, VoucherEntry } from '../types'

const DB_NAME = 'party-fee-accounting'
const DB_VERSION = 1

interface PartyFeeDB extends DBSchema {
  subjects: {
    key: string
    value: AccountSubject
    indexes: { 'by-code': string; 'by-type': string }
  }
  vouchers: {
    key: string
    value: Voucher
    indexes: { 'by-voucherNo': number; 'by-date': string }
  }
  voucherEntries: {
    key: string
    value: VoucherEntry
    indexes: { 'by-voucherId': string; 'by-subjectId': string }
  }
  autoSave: {
    key: string
    value: {
      id: string
      lastSavedAt: string
      data: any
    }
  }
}

let db: IDBPDatabase<PartyFeeDB> | null = null

export async function initDB(): Promise<IDBPDatabase<PartyFeeDB>> {
  if (db) return db

  db = await openDB<PartyFeeDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('subjects')) {
        const subjectStore = db.createObjectStore('subjects', { keyPath: 'id' })
        subjectStore.createIndex('by-code', 'code', { unique: true })
        subjectStore.createIndex('by-type', 'type', { unique: false })
      }

      if (!db.objectStoreNames.contains('vouchers')) {
        const voucherStore = db.createObjectStore('vouchers', { keyPath: 'id' })
        voucherStore.createIndex('by-voucherNo', 'voucherNo', { unique: true })
        voucherStore.createIndex('by-date', 'date', { unique: false })
      }

      if (!db.objectStoreNames.contains('voucherEntries')) {
        const entryStore = db.createObjectStore('voucherEntries', { keyPath: 'id' })
        entryStore.createIndex('by-voucherId', 'voucherId', { unique: false })
        entryStore.createIndex('by-subjectId', 'subjectId', { unique: false })
      }

      if (!db.objectStoreNames.contains('autoSave')) {
        db.createObjectStore('autoSave', { keyPath: 'id' })
      }
    },
  })

  await initDefaultData()
  return db
}

async function initDefaultData(): Promise<void> {
  if (!db) return

  const count = await db.count('subjects')
  if (count > 0) return

  const now = new Date().toISOString()
  const defaultSubjects: AccountSubject[] = [
    { id: '1', code: '1001', name: '库存现金', type: 'asset', parentId: null, level: 1, balance: 0, isLeaf: true, createdAt: now, updatedAt: now },
    { id: '2', code: '1002', name: '银行存款', type: 'asset', parentId: null, level: 1, balance: 0, isLeaf: true, createdAt: now, updatedAt: now },
    { id: '3', code: '2001', name: '党费收入', type: 'income', parentId: null, level: 1, balance: 0, isLeaf: true, createdAt: now, updatedAt: now },
    { id: '4', code: '2002', name: '上级补助收入', type: 'income', parentId: null, level: 1, balance: 0, isLeaf: true, createdAt: now, updatedAt: now },
    { id: '5', code: '3001', name: '党费使用', type: 'expense', parentId: null, level: 1, balance: 0, isLeaf: true, createdAt: now, updatedAt: now },
    { id: '6', code: '3002', name: '其他支出', type: 'expense', parentId: null, level: 1, balance: 0, isLeaf: true, createdAt: now, updatedAt: now },
  ]

  const tx = db.transaction('subjects', 'readwrite')
  for (const subject of defaultSubjects) {
    await tx.store.add(subject)
  }
  await tx.done
}

export function getDB(): IDBPDatabase<PartyFeeDB> {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}
