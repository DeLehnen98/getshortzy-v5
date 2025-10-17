const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function updateUser() {
  try {
    const newClerkId = process.argv[2] || 'user_348z6kLS28wUNmquQCVYEEFfwg';
    const email = process.argv[3] || 'lehnenf98@gmail.com';

    console.log('Updating user...');
    console.log('New Clerk ID:', newClerkId);
    console.log('Email:', email);

    // Update user with new Clerk ID
    const user = await prisma.user.update({
      where: { email: email },
      data: { clerkId: newClerkId },
    });

    console.log('✅ User updated successfully!');
    console.log('User ID:', user.id);
    console.log('Clerk ID:', user.clerkId);
    console.log('Credits:', user.credits);

  } catch (error) {
    console.error('❌ Error updating user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateUser();

