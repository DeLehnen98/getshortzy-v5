const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function createUser() {
  try {
    // Get Clerk user ID from environment or argument
    const clerkUserId = process.argv[2] || 'user_2qGdxLqYXrWNovMf1ehc3KsjR0n'; // Default from Clerk keys
    const email = process.argv[3] || 'lehnenf98@gmail.com';
    const name = process.argv[4] || 'Fabian Lehnen';

    console.log('Creating user...');
    console.log('Clerk ID:', clerkUserId);
    console.log('Email:', email);
    console.log('Name:', name);

    const user = await prisma.user.create({
      data: {
        clerkId: clerkUserId,
        email: email,
        name: name,
        credits: 100, // Welcome credits
        
      },
    });

    console.log('✅ User created successfully!');
    console.log('User ID:', user.id);
    console.log('Credits:', user.credits);

    // Create welcome transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: 100,
        type: 'CREDIT',
        description: 'Welcome bonus credits',
      },
    });

    console.log('✅ Welcome credits transaction created!');
    console.log('Transaction ID:', transaction.id);

  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    if (error.code === 'P2002') {
      console.log('ℹ️  User already exists in database');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createUser();

