import prisma from "../src/lib/prisma"

// Seed small reference data without transactional helpers because
// some hosted Postgres connections can close when Prisma starts them.
async function seedRoles() {
  const roles = [
    { name: 'Admin' },
    { name: 'Agent' },
  ]

  for (const role of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: role.name },
    })

    if (!existingRole) {
      await prisma.role.create({
        data: role,
      })
    }
  }
}

console.log('Seeding roles...')

seedRoles()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Seeding completed successfully.')
  })
  .catch(async (error) => {
    console.error('Error seeding data:', error)
    await prisma.$disconnect()
    process.exit(1)
  })
