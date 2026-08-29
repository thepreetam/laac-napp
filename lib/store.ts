import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { expressionsOfInterest, profiles } from '@/lib/db/schema'

export type ProfileInput = {
  persona: 'student' | 'employer'
  displayName?: string
  region?: string
  practiceAreas?: string[]
  languages?: string[]
}

export const profileStore = {
  async upsert(userId: string, input: ProfileInput) {
    const now = new Date()
    const id = `${userId}-profile`
    const [profile] = await db.insert(profiles).values({ ...input, id, userId, practiceAreas: input.practiceAreas ?? [], languages: input.languages ?? [], updatedAt: now }).onConflictDoUpdate({ target: profiles.userId, set: { ...input, practiceAreas: input.practiceAreas ?? [], languages: input.languages ?? [], updatedAt: now } }).returning()
    return profile
  },
  async get(userId: string) {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
    return profile ?? null
  },
}

export const eoiStore = {
  async list(userId: string) {
    return db.select().from(expressionsOfInterest).where(eq(expressionsOfInterest.userId, userId))
  },
  async create(userId: string, roleId: string) {
    const [eoi] = await db.insert(expressionsOfInterest).values({ id: crypto.randomUUID(), userId, roleId }).returning()
    return eoi
  },
}
