import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const EMPLOYEES = [
  { id: 'EMP001', name: 'Syed Ashfaqul Haque', designation: 'Editor', department: 'Editorial', joining_date: '2025-10-01', basic: 150000, house_rent: 75000, conveyance: 30000, medical: 22500, food_mobile: 22500, cash: 143000, gross: 443000, tax: 43000, net: 400000, bank_account: 'Bank T/F', ref_code: 'TBH-46077' },
  { id: 'BH0003', name: 'Md. Mahmudul Hasan', designation: 'Senior Reporter', department: 'Editorial', joining_date: '2025-11-01', basic: 45000, house_rent: 22500, conveyance: 10000, medical: 6750, food_mobile: 6750, cash: 60000, gross: 145000, tax: 12000, net: 133000, bank_account: 'Bank T/F', ref_code: 'TBH-46078' },
  { id: 'BH0004', name: 'Md. Sabbir Khan', designation: 'Reporter', department: 'Editorial', joining_date: '2025-11-15', basic: 35000, house_rent: 17500, conveyance: 8000, medical: 5250, food_mobile: 5250, cash: 45000, gross: 115000, tax: 9000, net: 106000, bank_account: 'Bank T/F', ref_code: 'TBH-46079' },
  { id: 'BH0005', name: 'Md. Aowlad Hosen Sarker', designation: 'Junior Reporter', department: 'Editorial', joining_date: '2025-12-01', basic: 25000, house_rent: 12500, conveyance: 6000, medical: 3750, food_mobile: 3750, cash: 35000, gross: 85000, tax: 6000, net: 79000, bank_account: 'Bank T/F', ref_code: 'TBH-46080' },
  { id: 'BH0008', name: 'Adnan Akib', designation: 'IT Executive', department: 'IT', joining_date: '2026-01-01', basic: 40000, house_rent: 20000, conveyance: 10000, medical: 6000, food_mobile: 6000, cash: 55000, gross: 135000, tax: 10000, net: 125000, bank_account: 'Bank T/F', ref_code: 'TBH-46081' },
  { id: 'BH0009', name: 'Sayed Alvi Haque', designation: 'Graphic Designer', department: 'Creative', joining_date: '2026-01-15', basic: 30000, house_rent: 15000, conveyance: 7000, medical: 4500, food_mobile: 4500, cash: 40000, gross: 100000, tax: 8000, net: 92000, bank_account: 'Bank T/F', ref_code: 'TBH-46082' },
  { id: 'BH0010', name: 'Md. Nur Mohammad', designation: 'Accounts Executive', department: 'Accounts', joining_date: '2026-02-01', basic: 35000, house_rent: 17500, conveyance: 8000, medical: 5250, food_mobile: 5250, cash: 50000, gross: 120000, tax: 9000, net: 111000, bank_account: 'Bank T/F', ref_code: 'TBH-46083' },
  { id: 'BH0011', name: 'Md. Turab Hossain', designation: 'HR Executive', department: 'HR', joining_date: '2026-02-01', basic: 35000, house_rent: 17500, conveyance: 8000, medical: 5250, food_mobile: 5250, cash: 45000, gross: 115000, tax: 9000, net: 106000, bank_account: 'Bank T/F', ref_code: 'TBH-46084' },
  { id: 'BH0012', name: 'Efte Ahmed Nerob', designation: 'Office Assistant', department: 'Administration', joining_date: '2026-02-15', basic: 15000, house_rent: 7500, conveyance: 4000, medical: 2250, food_mobile: 2250, cash: 20000, gross: 50000, tax: 3000, net: 47000, bank_account: 'Bank T/F', ref_code: 'TBH-46085' },
  { id: 'BH0013', name: 'Md. Mahiuddin', designation: 'Office Assistant', department: 'Administration', joining_date: '2026-03-01', basic: 15000, house_rent: 7500, conveyance: 4000, medical: 2250, food_mobile: 2250, cash: 20000, gross: 50000, tax: 3000, net: 47000, bank_account: 'Bank T/F', ref_code: 'TBH-46086' },
]

async function main() {
  await prisma.companyConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' },
  })

  const existing = await prisma.employee.count()
  if (existing === 0) {
    for (const emp of EMPLOYEES) {
      await prisma.employee.create({ data: emp })
    }
    console.log(`✅ Seeded ${EMPLOYEES.length} employees`)
  } else {
    console.log(`ℹ️  ${existing} employees already exist, skipping seed`)
  }

  console.log('✅ Seed complete')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
