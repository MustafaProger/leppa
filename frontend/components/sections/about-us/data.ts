import contentBlocks from "@/data/about-us.json";

import type { AboutSubsection } from "./types";

export const aboutSubsections = [...(contentBlocks as AboutSubsection[])].sort(
	(a, b) => a.order - b.order,
);
