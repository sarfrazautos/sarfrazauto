import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { GoogleAuth } from "google-auth-library";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rangeParam = searchParams.get("range") || "30D";

  let startDate = "30daysAgo";
  let daysCount = 30;
  if (rangeParam === "7D") {
    startDate = "7daysAgo";
    daysCount = 7;
  } else if (rangeParam === "14D") {
    startDate = "14daysAgo";
    daysCount = 14;
  } else if (rangeParam === "90D") {
    startDate = "90daysAgo";
    daysCount = 90;
  } else if (rangeParam === "today") {
    startDate = "today";
    daysCount = 1;
  }

  const propertyId = process.env.GA_PROPERTY_ID || "562957269";
  const credPath = path.join(process.cwd(), "google-credentials.json");

  if (!fs.existsSync(credPath)) {
    return NextResponse.json({
      success: false,
      connected: false,
      error: "Credentials file not found",
    });
  }

  try {
    const auth = new GoogleAuth({
      keyFile: credPath,
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    const client = new BetaAnalyticsDataClient({ auth: auth as any });

    const [realtimeUsersRes] = await client
      .runRealtimeReport({
        property: `properties/${propertyId}`,
        metrics: [{ name: "activeUsers" }],
      })
      .catch(() => [null]);

    const activeUsers = Number(
      realtimeUsersRes?.rows?.[0]?.metricValues?.[0]?.value || 0
    );

    const [realtimeDeviceRes] = await client
      .runRealtimeReport({
        property: `properties/${propertyId}`,
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "activeUsers" }],
      })
      .catch(() => [null]);

    const [realtimeScreensRes] = await client
      .runRealtimeReport({
        property: `properties/${propertyId}`,
        dimensions: [{ name: "unifiedScreenName" }],
        metrics: [{ name: "activeUsers" }],
      })
      .catch(() => [null]);

    const [realtimeGeoRes] = await client
      .runRealtimeReport({
        property: `properties/${propertyId}`,
        dimensions: [{ name: "city" }, { name: "country" }],
        metrics: [{ name: "activeUsers" }],
      })
      .catch(() => [null]);

    const liveLocations = (realtimeGeoRes?.rows || [])
      .map((row) => {
        const city = row.dimensionValues?.[0]?.value;
        const country = row.dimensionValues?.[1]?.value;
        const count = Number(row.metricValues?.[0]?.value || 0);
        return {
          location: city && city !== "(not set)" ? `${city}, ${country}` : country || "Unknown",
          users: count,
        };
      })
      .filter((loc) => loc.location !== "(not set)");

    const [overviewRes] = await client
      .runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate: "today" }],
        metrics: [
          { name: "screenPageViews" },
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "ecommercePurchases" },
          { name: "purchaseRevenue" },
        ],
      })
      .catch(() => [null]);

    const overviewMetrics = overviewRes?.rows?.[0]?.metricValues || [];
    let totalViews = Number(overviewMetrics[0]?.value || 0);
    let totalSessions = Number(overviewMetrics[1]?.value || 0);
    let totalUsers = Number(overviewMetrics[2]?.value || 0);
    const purchases = Number(overviewMetrics[3]?.value || 0);
    const revenue = Number(overviewMetrics[4]?.value || 0);

    if (totalUsers === 0 && activeUsers > 0) {
      totalUsers = activeUsers;
    }
    if (totalSessions === 0 && activeUsers > 0) {
      totalSessions = activeUsers;
    }
    if (totalViews === 0 && activeUsers > 0) {
      totalViews = (realtimeScreensRes?.rows?.length || 1);
    }

    const [timelineRes] = await client
      .runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      })
      .catch(() => [null]);

    let timeline: { date: string; visitors: number; views: number }[] = [];

    if (timelineRes?.rows && timelineRes.rows.length > 0) {
      timeline = timelineRes.rows.map((row) => {
        const rawDate = row.dimensionValues?.[0]?.value || "";
        let formattedDate = rawDate;
        if (rawDate.length === 8) {
          const monthNum = parseInt(rawDate.substring(4, 6), 10) - 1;
          const dayNum = parseInt(rawDate.substring(6, 8), 10);
          const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ];
          formattedDate = `${monthNames[monthNum] || "Nov"} ${dayNum}`;
        }
        return {
          date: formattedDate,
          visitors: Number(row.metricValues?.[1]?.value || 0),
          views: Number(row.metricValues?.[0]?.value || 0),
        };
      });
    } else {
      const points = Math.min(daysCount, 12);
      const now = new Date();
      for (let i = points - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i * Math.max(1, Math.floor(daysCount / points)));
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const dateLabel = `${monthNames[d.getMonth()]} ${d.getDate()}`;
        timeline.push({
          date: dateLabel,
          visitors: i === 0 && activeUsers > 0 ? activeUsers : 0,
          views: i === 0 && totalViews > 0 ? totalViews : 0,
        });
      }
    }

    const [trafficRes] = await client
      .runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 5,
      })
      .catch(() => [null]);

    const trafficRows = trafficRes?.rows || [];
    const totalTrafficSessions = trafficRows.reduce(
      (sum, r) => sum + Number(r.metricValues?.[0]?.value || 0),
      0
    );

    const trafficColors = ["#dc2626", "#f87171", "#991b1b", "#fca5a5", "#ef4444"];
    let trafficSources: { name: string; value: number; color: string }[] = [];

    if (trafficRows.length > 0 && totalTrafficSessions > 0) {
      trafficSources = trafficRows.map((r, i) => {
        const count = Number(r.metricValues?.[0]?.value || 0);
        const pct = (count / totalTrafficSessions) * 100;
        return {
          name: r.dimensionValues?.[0]?.value || "Direct",
          value: Number(pct.toFixed(1)),
          color: trafficColors[i % trafficColors.length],
        };
      });
    } else if (activeUsers > 0) {
      trafficSources = [
        { name: "Direct", value: 100, color: "#dc2626" },
      ];
    }

    const [deviceRes] = await client
      .runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "activeUsers" }],
      })
      .catch(() => [null]);

    const deviceColors: Record<string, string> = {
      desktop: "#dc2626",
      mobile: "#f87171",
      tablet: "#fca5a5",
    };

    let deviceBreakdown: { name: string; value: number; color: string }[] = [];
    const deviceRows = deviceRes?.rows || [];
    const totalDeviceUsers = deviceRows.reduce(
      (sum, r) => sum + Number(r.metricValues?.[0]?.value || 0),
      0
    );

    if (deviceRows.length > 0 && totalDeviceUsers > 0) {
      deviceBreakdown = deviceRows.map((r) => {
        const rawName = (r.dimensionValues?.[0]?.value || "desktop").toLowerCase();
        const count = Number(r.metricValues?.[0]?.value || 0);
        const pct = (count / totalDeviceUsers) * 100;
        return {
          name: rawName.charAt(0).toUpperCase() + rawName.slice(1),
          value: Number(pct.toFixed(1)),
          color: deviceColors[rawName] || "#dc2626",
        };
      });
    } else if (realtimeDeviceRes?.rows && realtimeDeviceRes.rows.length > 0) {
      const totalLive = realtimeDeviceRes.rows.reduce(
        (sum, r) => sum + Number(r.metricValues?.[0]?.value || 0),
        0
      );
      deviceBreakdown = realtimeDeviceRes.rows.map((r) => {
        const rawName = (r.dimensionValues?.[0]?.value || "desktop").toLowerCase();
        const count = Number(r.metricValues?.[0]?.value || 0);
        const pct = totalLive > 0 ? (count / totalLive) * 100 : 100;
        return {
          name: rawName.charAt(0).toUpperCase() + rawName.slice(1),
          value: Number(pct.toFixed(1)),
          color: deviceColors[rawName] || "#dc2626",
        };
      });
    }

    const [pagesRes] = await client
      .runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 8,
      })
      .catch(() => [null]);

    let topPages: { path: string; views: string }[] = [];
    if (pagesRes?.rows && pagesRes.rows.length > 0) {
      topPages = pagesRes.rows.map((r) => ({
        path: r.dimensionValues?.[0]?.value || "/",
        views: Number(r.metricValues?.[0]?.value || 0).toLocaleString(),
      }));
    } else if (realtimeScreensRes?.rows && realtimeScreensRes.rows.length > 0) {
      topPages = realtimeScreensRes.rows.map((r) => {
        const fullTitle = r.dimensionValues?.[0]?.value || "/";
        let displayPath = fullTitle;
        if (displayPath.includes("Analytics")) {
          displayPath = "/admin/analytics";
        } else if (displayPath.includes("Sarfraz Autos | Genuine")) {
          displayPath = "/ (Home)";
        } else if (displayPath.length > 35) {
          displayPath = displayPath.slice(0, 32) + "...";
        }
        return {
          path: displayPath,
          views: Number(r.metricValues?.[0]?.value || 1).toLocaleString(),
        };
      });
    }

    return NextResponse.json({
      success: true,
      connected: true,
      range: rangeParam,
      activeUsers,
      totalViews,
      totalSessions,
      totalUsers,
      purchases,
      revenue,
      timeline,
      trafficSources,
      deviceBreakdown,
      topPages,
      liveLocations,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      connected: false,
      error: err.message || "Failed to query Google Analytics API",
    });
  }
}
