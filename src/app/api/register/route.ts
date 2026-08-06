import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { assertSameOrigin } from '@/lib/security'
import { registerSchema, isCommonPassword } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    if (!assertSameOrigin(req)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
    }

    const rl = rateLimit({ key: `register:${getClientIp(req)}`, windowMs: 60 * 60 * 1000, max: 5 })
    if (rl.limited) {
      return NextResponse.json(
        { error: 'Too many sign-up attempts from this IP. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) },
        }
      )
    }

    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Invalid registration data'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { name, email, password } = parsed.data

    if (isCommonPassword(password)) {
      return NextResponse.json(
        { error: 'That password is too common. Please choose a stronger one.' },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}