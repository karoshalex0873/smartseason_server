import prisma from "../src/lib/prisma"

// function to seed the roles
async function seedRoles() {
  const roles = [
    { name: 'Admin' },
    { name: 'Agent' },
  ]

  for (const role of roles){
    await prisma.role.upsert({
      where: {name: role.name},
      update: {},
      create: role
    })
  }
}

console.log('Seeding roles...')
seedRoles()
  .then(async ()=>{
    await prisma.$disconnect()
    console.log('Seeding completed successfully.')
  })
  .catch(async (error)=>{
    console.error('Error seeding data:', error)
    await prisma.$disconnect()
    process.exit(1)
  })