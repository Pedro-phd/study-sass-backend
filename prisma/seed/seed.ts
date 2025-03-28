import { PrismaClient } from '@prisma/client';
import { planSeed } from './plan';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting seed...');
    
    // Seed plans
    await prisma.plan.createMany({
      data: planSeed,
    });
    
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
