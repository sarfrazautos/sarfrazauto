import { NextResponse } from "next/server"

const initialBulkOrders = [
  {
    id: "BO-9482",
    date: "24 Sep 2026",
    items: "Complete 70cc Cylinder Head Assembly",
    cartonCount: 24,
    totalAmount: 620000,
    status: "In Transit",
  },
  {
    id: "BO-9420",
    date: "22 Sep 2026",
    items: "Crown Heavy Duty Clutch Plate Set (5 Pcs)",
    cartonCount: 40,
    totalAmount: 445000,
    status: "In Transit",
  },
  {
    id: "BO-9391",
    date: "21 Sep 2026",
    items: "125cc Piston & Ring Kits (Standard)",
    cartonCount: 60,
    totalAmount: 890000,
    status: "Processing",
  },
  {
    id: "BO-9350",
    date: "18 Sep 2026",
    items: "Heavy Duty Alloy Wheel Rim Hub Assembly",
    cartonCount: 18,
    totalAmount: 385000,
    status: "Delivered",
  },
  {
    id: "BO-9288",
    date: "14 Sep 2026",
    items: "Genuine Japanese Spec Carburetor 70cc",
    cartonCount: 50,
    totalAmount: 760000,
    status: "Delivered",
  },
  {
    id: "BO-9210",
    date: "09 Sep 2026",
    items: "Full Engine Overhaul Gasket Kits Complete",
    cartonCount: 30,
    totalAmount: 290000,
    status: "Delivered",
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      bulkOrders: initialBulkOrders,
      totalCount: initialBulkOrders.length,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch bulk orders" },
      { status: 500 }
    )
  }
}
