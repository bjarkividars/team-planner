import type { RateTier } from "../../lib/localStorage";
import type { LocationKey } from "./types";

export const RATE_TIER_LABELS: Record<RateTier, string> = {
  min: "Below Market",
  default: "Mid Market",
  max: "Above Market",
};

export const LOCATION_KEYS: LocationKey[] = [
  "SF",
  "NYC",
  "AUS_DEN",
  "REMOTE_US",
  "OFFSHORE",
];

export const ROW_HEIGHT = 48;
export const ROW_GAP = 8;
export const HEADER_HEIGHT = 32;
export const TOP_PADDING = 12;
