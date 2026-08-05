import { NextResponse } from "next/server";
import { FixtureQueueSource } from "../../../lib/queues/fixture-source";
import { buildQueueDashboard, hasAvailableQueue } from "../../../lib/queues/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await buildQueueDashboard(new FixtureQueueSource());
  const status = hasAvailableQueue(response) ? 200 : 503;

  return NextResponse.json(response, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
