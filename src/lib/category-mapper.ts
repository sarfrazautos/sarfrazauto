export const ALL_CATEGORIES = [
  "All",
  "Alloy Rims & Wheels",
  "Tyres & Tubes",
  "Fuel & Oils",
  "Cylinders & Heads",
  "Engine Blocks",
  "Crankshafts",
  "Clutch Plates",
  "Carburetors",
  "Shock Absorbers",
  "Backlights",
  "Headlights",
  "Fuel Tanks",
  "Silencers",
  "Others",
]

const CATEGORY_SLUG_MAP: Record<string, string> = {
  wheels: "Alloy Rims & Wheels",
  wheel: "Alloy Rims & Wheels",
  rims: "Alloy Rims & Wheels",
  rim: "Alloy Rims & Wheels",
  "alloy-rims": "Alloy Rims & Wheels",
  "alloy-rim": "Alloy Rims & Wheels",
  "alloy rims": "Alloy Rims & Wheels",
  "alloy rims & wheels": "Alloy Rims & Wheels",

  tyres: "Tyres & Tubes",
  tyre: "Tyres & Tubes",
  tires: "Tyres & Tubes",
  tire: "Tyres & Tubes",
  "tyres & tubes": "Tyres & Tubes",
  "tyres-tubes": "Tyres & Tubes",

  fuel: "Fuel & Oils",
  oils: "Fuel & Oils",
  oil: "Fuel & Oils",
  "fuel & oils": "Fuel & Oils",
  "fuel-oils": "Fuel & Oils",
  "fuel-oil": "Fuel & Oils",
  "fuel-and-oils": "Fuel & Oils",

  silencer: "Silencers",
  silencers: "Silencers",
  "silencers & exhaust": "Silencers",
  exhaust: "Silencers",

  backlight: "Backlights",
  backlights: "Backlights",
  "back light": "Backlights",
  "back-lights": "Backlights",

  headlight: "Headlights",
  headlights: "Headlights",
  "headlights & bulbs": "Headlights",
  "head light": "Headlights",

  "fuel-tank": "Fuel Tanks",
  "fuel-tanks": "Fuel Tanks",
  "fuel tank": "Fuel Tanks",
  "fuel tanks": "Fuel Tanks",

  shocks: "Shock Absorbers",
  shock: "Shock Absorbers",
  "shock-absorber": "Shock Absorbers",
  "shock-absorbers": "Shock Absorbers",
  "shock absorbers": "Shock Absorbers",

  carburetor: "Carburetors",
  carburetors: "Carburetors",

  clutch: "Clutch Plates",
  "clutch-plates": "Clutch Plates",
  "clutch plates": "Clutch Plates",

  crankshaft: "Crankshafts",
  crankshafts: "Crankshafts",

  engine: "Engine Blocks",
  "engine-blocks": "Engine Blocks",
  "engine blocks": "Engine Blocks",
  "engine assemblies": "Engine Blocks",

  cylinder: "Cylinders & Heads",
  cylinders: "Cylinders & Heads",
  "cylinders & heads": "Cylinders & Heads",
  "cylinder-heads": "Cylinders & Heads",

  others: "Others",
}

export function normalizeCategory(slugOrName?: string | null): string {
  if (!slugOrName) return "All"
  const trimmed = slugOrName.trim()
  if (!trimmed || trimmed.toLowerCase() === "all") return "All"

  const lower = trimmed.toLowerCase()
  if (CATEGORY_SLUG_MAP[lower]) {
    return CATEGORY_SLUG_MAP[lower]
  }

  for (const cat of ALL_CATEGORIES) {
    if (cat.toLowerCase() === lower) {
      return cat
    }
  }

  return trimmed
}
