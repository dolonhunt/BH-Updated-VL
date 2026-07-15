import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed default company config
  await prisma.companyConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' },
  })

  // Seed default employee
  const existing = await prisma.employee.count()
  if (existing === 0) {
    await prisma.employee.create({
      data: {
        id: 'EMP001',
        name: 'Syed Ashfaqul Haque',
        designation: 'Editor',
        department: 'Editorial',
        joining_date: '2025-10-01',
        basic: 150000,
        house_rent: 75000,
        conveyance: 30000,
        medical: 22500,
        food_mobile: 22500,
        cash: 143000,
        gross: 443000,
        tax: 43000,
        net: 400000,
        bank_account: 'Bank T/F',
        status: 'active',
        ref_code: 'TBH-46077',
      },
    })
  }

  console.log('✅ Seed complete')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
