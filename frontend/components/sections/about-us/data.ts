import contentBlocks from "@/data/contentBlocks.json";

import type { AboutSubsection } from "./types";

export const aboutSubsections = [...(contentBlocks as AboutSubsection[])]
  .sort((a, b) => a.order - b.order)
  .slice(0, 4);
