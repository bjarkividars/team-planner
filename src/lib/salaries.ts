export type LocationKey = "SF" | "NYC" | "AUS_DEN" | "REMOTE_US" | "OFFSHORE";

export type RoleKey =
  | "ENG_SOFTWARE"
  | "ENG_SENIOR"
  | "ENG_STAFF"
  | "ENG_MANAGER"
  | "SALES_SDR"
  | "SALES_AE"
  | "SALES_MANAGER"
  | "DESIGN_PD"
  | "DESIGN_LEAD"
  | "OPS_PEOPLE"
  | "OPS_FINANCE";

export type SalaryBand = { min: number; max: number; default: number };

export const LOCATIONS: Record<LocationKey, { label: string }> = {
  SF: { label: "SF" },
  NYC: { label: "NYC" },
  AUS_DEN: { label: "Austin / Denver" },
  REMOTE_US: { label: "Remote (US)" },
  OFFSHORE: { label: "Offshore" },
};

export const ROLE_CATALOG: Record<
  RoleKey,
  {
    label: string;
    function: "Engineering" | "Sales" | "Design" | "Operations";
    salary: Record<LocationKey, SalaryBand>;
  }
> = {
  ENG_SOFTWARE: {
    label: "Software Engineer",
    function: "Engineering",
    salary: {
      SF: { min: 140_000, max: 190_000, default: 165_000 },
      NYC: { min: 135_000, max: 185_000, default: 160_000 },
      AUS_DEN: { min: 120_000, max: 165_000, default: 145_000 },
      REMOTE_US: { min: 115_000, max: 165_000, default: 140_000 },
      OFFSHORE: { min: 45_000, max: 80_000, default: 60_000 },
    },
  },
  ENG_SENIOR: {
    label: "Senior Software Engineer",
    function: "Engineering",
    salary: {
      SF: { min: 180_000, max: 260_000, default: 220_000 },
      NYC: { min: 175_000, max: 250_000, default: 210_000 },
      AUS_DEN: { min: 155_000, max: 220_000, default: 185_000 },
      REMOTE_US: { min: 150_000, max: 220_000, default: 180_000 },
      OFFSHORE: { min: 60_000, max: 110_000, default: 85_000 },
    },
  },
  ENG_STAFF: {
    label: "Staff Engineer",
    function: "Engineering",
    salary: {
      SF: { min: 240_000, max: 360_000, default: 300_000 },
      NYC: { min: 230_000, max: 340_000, default: 285_000 },
      AUS_DEN: { min: 200_000, max: 300_000, default: 245_000 },
      REMOTE_US: { min: 195_000, max: 300_000, default: 240_000 },
      OFFSHORE: { min: 80_000, max: 150_000, default: 115_000 },
    },
  },
  ENG_MANAGER: {
    label: "Engineering Manager",
    function: "Engineering",
    salary: {
      SF: { min: 220_000, max: 340_000, default: 280_000 },
      NYC: { min: 210_000, max: 330_000, default: 270_000 },
      AUS_DEN: { min: 185_000, max: 285_000, default: 235_000 },
      REMOTE_US: { min: 180_000, max: 285_000, default: 230_000 },
      OFFSHORE: { min: 75_000, max: 140_000, default: 105_000 },
    },
  },

  SALES_SDR: {
    label: "Sales Development Rep (SDR)",
    function: "Sales",
    salary: {
      SF: { min: 70_000, max: 95_000, default: 85_000 },
      NYC: { min: 70_000, max: 95_000, default: 85_000 },
      AUS_DEN: { min: 60_000, max: 85_000, default: 75_000 },
      REMOTE_US: { min: 55_000, max: 85_000, default: 70_000 },
      OFFSHORE: { min: 25_000, max: 45_000, default: 35_000 },
    },
  },
  SALES_AE: {
    label: "Account Executive (AE)",
    function: "Sales",
    salary: {
      SF: { min: 110_000, max: 160_000, default: 135_000 },
      NYC: { min: 110_000, max: 160_000, default: 135_000 },
      AUS_DEN: { min: 95_000, max: 140_000, default: 120_000 },
      REMOTE_US: { min: 90_000, max: 140_000, default: 115_000 },
      OFFSHORE: { min: 35_000, max: 70_000, default: 50_000 },
    },
  },
  SALES_MANAGER: {
    label: "Sales Manager",
    function: "Sales",
    salary: {
      SF: { min: 150_000, max: 230_000, default: 190_000 },
      NYC: { min: 145_000, max: 225_000, default: 185_000 },
      AUS_DEN: { min: 130_000, max: 200_000, default: 165_000 },
      REMOTE_US: { min: 125_000, max: 200_000, default: 160_000 },
      OFFSHORE: { min: 55_000, max: 100_000, default: 75_000 },
    },
  },

  DESIGN_PD: {
    label: "Product Designer",
    function: "Design",
    salary: {
      SF: { min: 130_000, max: 190_000, default: 160_000 },
      NYC: { min: 125_000, max: 185_000, default: 155_000 },
      AUS_DEN: { min: 110_000, max: 160_000, default: 135_000 },
      REMOTE_US: { min: 105_000, max: 160_000, default: 130_000 },
      OFFSHORE: { min: 40_000, max: 80_000, default: 60_000 },
    },
  },
  DESIGN_LEAD: {
    label: "Design Lead",
    function: "Design",
    salary: {
      SF: { min: 170_000, max: 260_000, default: 215_000 },
      NYC: { min: 165_000, max: 250_000, default: 205_000 },
      AUS_DEN: { min: 145_000, max: 220_000, default: 180_000 },
      REMOTE_US: { min: 140_000, max: 220_000, default: 175_000 },
      OFFSHORE: { min: 65_000, max: 120_000, default: 90_000 },
    },
  },

  OPS_PEOPLE: {
    label: "People Ops / HR Generalist",
    function: "Operations",
    salary: {
      SF: { min: 90_000, max: 140_000, default: 115_000 },
      NYC: { min: 90_000, max: 140_000, default: 115_000 },
      AUS_DEN: { min: 75_000, max: 120_000, default: 95_000 },
      REMOTE_US: { min: 70_000, max: 120_000, default: 90_000 },
      OFFSHORE: { min: 30_000, max: 55_000, default: 42_000 },
    },
  },
  OPS_FINANCE: {
    label: "Finance / Ops Generalist",
    function: "Operations",
    salary: {
      SF: { min: 100_000, max: 160_000, default: 130_000 },
      NYC: { min: 100_000, max: 160_000, default: 130_000 },
      AUS_DEN: { min: 85_000, max: 140_000, default: 110_000 },
      REMOTE_US: { min: 80_000, max: 140_000, default: 105_000 },
      OFFSHORE: { min: 35_000, max: 65_000, default: 50_000 },
    },
  },
};
