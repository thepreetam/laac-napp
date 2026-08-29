import { boolean, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const profiles = pgTable('profile', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  persona: text('persona').notNull(),
  displayName: text('displayName'),
  region: text('region'),
  practiceAreas: jsonb('practiceAreas').$type<string[]>().notNull().default([]),
  languages: jsonb('languages').$type<string[]>().notNull().default([]),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const expressionsOfInterest = pgTable('expressionOfInterest', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  roleId: text('roleId').notNull(),
  status: text('status').notNull().default('submitted'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const auditLog = pgTable('auditLog', {
  id: text('id').primaryKey(),
  userId: text('userId'),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  ipAddress: text('ipAddress'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
