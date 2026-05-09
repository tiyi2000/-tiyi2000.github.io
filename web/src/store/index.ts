import { create } from 'zustand'
import type { AccountSubject, Voucher, VoucherWithEntries, SubjectBalance } from '../types'
import * as subjectService from '../services/subjectService'
import * as voucherService from '../services/voucherService'
import * as ledgerService from '../services/ledgerService'

interface AppState {
  subjects: AccountSubject[]
  vouchers: Voucher[]
  currentVoucher: VoucherWithEntries | null
  subjectBalances: SubjectBalance[]
  loading: boolean
  error: string | null
  
  loadSubjects: () => Promise<void>
  addSubject: (subject: Omit<AccountSubject, 'createdAt' | 'updatedAt'>) => Promise<void>
  updateSubject: (id: string, updates: Partial<Omit<AccountSubject, 'id' | 'createdAt'>>) => Promise<void>
  deleteSubject: (id: string) => Promise<void>
  
  loadVouchers: () => Promise<void>
  loadVoucherById: (id: string) => Promise<void>
  addVoucher: (voucher: Omit<Voucher, 'createdAt' | 'updatedAt'>, entries: any[]) => Promise<void>
  updateVoucher: (id: string, updates: any, entries?: any[]) => Promise<void>
  deleteVoucher: (id: string) => Promise<void>
  
  loadSubjectBalances: (startDate?: string, endDate?: string) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  subjects: [],
  vouchers: [],
  currentVoucher: null,
  subjectBalances: [],
  loading: false,
  error: null,

  loadSubjects: async () => {
    set({ loading: true, error: null })
    try {
      const subjects = await subjectService.getAllSubjects()
      set({ subjects, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  addSubject: async (subject) => {
    await subjectService.createSubject(subject)
    await get().loadSubjects()
  },

  updateSubject: async (id, updates) => {
    await subjectService.updateSubject(id, updates)
    await get().loadSubjects()
  },

  deleteSubject: async (id) => {
    await subjectService.deleteSubject(id)
    await get().loadSubjects()
  },

  loadVouchers: async () => {
    set({ loading: true, error: null })
    try {
      const vouchers = await voucherService.getAllVouchers()
      set({ vouchers, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  loadVoucherById: async (id) => {
    const voucher = await voucherService.getVoucherById(id)
    set({ currentVoucher: voucher })
  },

  addVoucher: async (voucher, entries) => {
    await voucherService.createVoucher(voucher, entries)
    await get().loadVouchers()
  },

  updateVoucher: async (id, updates, entries) => {
    await voucherService.updateVoucher(id, updates, entries)
    await get().loadVouchers()
  },

  deleteVoucher: async (id) => {
    await voucherService.deleteVoucher(id)
    await get().loadVouchers()
  },

  loadSubjectBalances: async (startDate?, endDate?) => {
    const balances = await ledgerService.getSubjectBalances(startDate, endDate)
    set({ subjectBalances: balances })
  },
}))
