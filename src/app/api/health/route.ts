import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Quick database ping
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
      uptime: process.uptime(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Database check failed";
    return NextResponse.json(
      {
        status: "degraded",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: errorMsg,
      },
      { status: 503 }
    );
  }
}
