/**
 * Script to grant welcome credits to existing users who didn't receive them
 * Run with: npx tsx scripts/grant-welcome-credits.ts
 */

import { db } from '../src/server/db';

async function grantWelcomeCredits() {
  console.log('🔍 Checking for users without welcome credits...\n');

  try {
    // Find all users
    const users = await db.user.findMany({
      include: {
        transactions: {
          where: {
            type: 'credit',
            description: 'Welcome bonus - Free credits',
          },
        },
      },
    });

    console.log(`Found ${users.length} total users\n`);

    let updatedCount = 0;

    for (const user of users) {
      // Check if user already has welcome bonus transaction
      const hasWelcomeBonus = user.transactions.length > 0;

      if (!hasWelcomeBonus) {
        console.log(`📝 User ${user.email} (${user.id}) - No welcome bonus found`);
        console.log(`   Current credits: ${user.credits}`);

        // Grant 3 credits if user has 0 credits
        if (user.credits === 0) {
          await db.$transaction(async (tx) => {
            // Update user credits
            await tx.user.update({
              where: { id: user.id },
              data: { credits: 3 },
            });

            // Create transaction record
            await tx.transaction.create({
              data: {
                userId: user.id,
                type: 'credit',
                amount: 3,
                description: 'Welcome bonus - Free credits',
              },
            });
          });

          console.log(`   ✅ Granted 3 welcome credits\n`);
          updatedCount++;
        } else {
          console.log(`   ⏭️  User already has ${user.credits} credits, skipping\n`);
        }
      } else {
        console.log(`✅ User ${user.email} - Already has welcome bonus\n`);
      }
    }

    console.log(`\n🎉 Done! Updated ${updatedCount} users`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
grantWelcomeCredits()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

