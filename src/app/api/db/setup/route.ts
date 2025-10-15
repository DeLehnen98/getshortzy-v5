import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET() {
  try {
    // Test database connection
    await db.$connect();
    
    // Try to query users table to verify schema exists
    const userCount = await db.user.count();
    const projectCount = await db.project.count();
    
    return NextResponse.json({
      success: true,
      message: "Database is connected and schema is set up!",
      stats: {
        users: userCount,
        projects: projectCount,
      },
      tables: [
        "User",
        "Project",
        "Clip",
        "Job",
        "Transaction",
        "UsageLog",
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        hint: "Make sure DATABASE_URL is set in environment variables and run 'npx prisma db push' to create tables.",
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

