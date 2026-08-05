import type { QueueSourceDocument } from "./types";

export interface QueueSource {
  readWorkQueue(): Promise<QueueSourceDocument>;
  readResearchQueue(): Promise<QueueSourceDocument>;
}

export class QueueSourceError extends Error {
  constructor(
    readonly code: "SOURCE_UNAVAILABLE" | "SOURCE_INVALID",
    message: string,
  ) {
    super(message);
    this.name = "QueueSourceError";
  }
}
