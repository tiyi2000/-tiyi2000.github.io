export interface AccountSubject {
  id: string
  code: string
  name: string
  type: 'asset' | 'income' | 'expense'
  parentId: string | null
  level: number
  balance: number
  isLeaf: boolean
  createdAt: string
  updatedAt: string
}

export interface Voucher {
  id: string
  voucherNo: number
  date: string
  summary: string | null
  isAudited: boolean
  isPosted: boolean
  createdAt: string
  updatedAt: string
}

export interface VoucherEntry {
  id: string
  voucherId: string
  subjectId: string
  summary: string | null
  debit: number
  credit: number
  createdAt: string
}

export interface VoucherWithEntries extends Voucher {
  entries: VoucherEntry[]
}

export interface LedgerEntry {
  id: string
  date: string
  voucherNo: number
  summary: string | null
  subjectCode: string
  subjectName: string
  debit: number
  credit: number
  balance: number
}

export interface SubjectBalance {
  id: string
  code: string
  name: string
  type: string
  beginningBalance: number
  currentDebit: number
  currentCredit: number
  endingBalance: number
}
