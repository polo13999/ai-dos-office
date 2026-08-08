import { NextResponse } from "next/server";
import { buildCapabilityDashboard } from "../../../lib/capabilities/service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await buildCapabilityDashboard();
    return NextResponse.json(response, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      {
        generatedAt: new Date().toISOString(),
        mode: "FIXTURE",
        error: error instanceof Error ? error.message : "Capability fixture source failed.",
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
