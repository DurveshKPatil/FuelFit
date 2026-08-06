const { PrismaClient } = require('@prisma/client')
const { products } = require('../src/lib/seed-data')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        ...p,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
      },
      create: {
        ...p,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
      },
    })
    console.log(`Created/updated: ${p.name}`)
  }

  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@fuelfit.com' },
  })

  if (!adminExists) {
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash('admin12345', 10)
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@fuelfit.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    })
    console.log('Created admin user: admin@fuelfit.com / admin12345')
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })