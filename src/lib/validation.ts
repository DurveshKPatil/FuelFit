import { z } from 'zod'

const passwordPolicy = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

const commonPasswords = new Set([
  'password', 'password1', 'password123', '12345678', '123456789',
  'qwerty123', 'letmein', 'admin123', 'iloveyou', 'welcome1',
])

export function isCommonPassword(pw: string): boolean {
  return commonPasswords.has(pw.toLowerCase())
}

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().trim().toLowerCase().email('Invalid email address').max(254),
  password: passwordPolicy,
})

export const productSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with dashes')
    .max(200),
  description: z.string().trim().min(1).max(5000),
  shortDesc: z.string().trim().max(300).optional().nullable(),
  price: z.coerce.number().min(0).max(100000),
  compareAtPrice: z.coerce.number().min(0).max(100000).optional().nullable(),
  images: z.array(z.string().trim().max(500)).max(8).optional(),
  category: z.string().trim().min(1).max(100),
  flavor: z.string().trim().max(100).optional().nullable(),
  size: z.string().trim().max(100).optional().nullable(),
  weight: z.string().trim().max(100).optional().nullable(),
  proteinPerServing: z.coerce.number().int().min(0).max(500).optional().nullable(),
  servingsPerContainer: z.coerce.number().int().min(0).max(10000).optional().nullable(),
  ingredients: z.string().trim().max(2000).optional().nullable(),
  tags: z.array(z.string().trim().max(50)).max(20).optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  inventory: z.coerce.number().int().min(0).max(100000),
  amazonAsin: z.string().trim().max(20).optional().nullable(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
