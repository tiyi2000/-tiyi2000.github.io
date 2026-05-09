import { getDB } from '../db'
import type { AccountSubject } from '../types'

export async function getAllSubjects(): Promise<AccountSubject[]> {
  const db = getDB()
  return await db.getAllFromIndex('subjects', 'by-code')
}

export async function getSubjectById(id: string): Promise<AccountSubject | undefined> {
  const db = getDB()
  return await db.get('subjects', id)
}

export async function createSubject(subject: Omit<AccountSubject, 'createdAt' | 'updatedAt'>): Promise<void> {
  const db = getDB()
  const now = new Date().toISOString()
  await db.add('subjects', { ...subject, createdAt: now, updatedAt: now })
}

export async function updateSubject(id: string, updates: Partial<Omit<AccountSubject, 'id' | 'createdAt'>>): Promise<void> {
  const db = getDB()
  const subject = await getSubjectById(id)
  if (!subject) throw new Error('Subject not found')
  
  await db.put('subjects', { ...subject, ...updates, updatedAt: new Date().toISOString() })
}

export async function deleteSubject(id: string): Promise<void> {
  const db = getDB()
  await db.delete('subjects', id)
}
