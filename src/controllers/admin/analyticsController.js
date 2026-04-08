import prisma from "../../../prisma/prisma.client.js";

/**
 * GET SITE VISIT STATS
 * - This Month
 * - This Year
 * - All Time
 * - Visitors by country
 * new Date(year, month, day) -> January is 0 indexed.
 */
export const getSiteAnalytics = async (req, res) => {
  try {
    const now = new Date();

    // Start of month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Start of year
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Count all visit records for each time bucket.
    const [thisMonth, thisYear, allTime] = await Promise.all([
      prisma.siteVisit.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),

      prisma.siteVisit.count({
        where: {
          createdAt: {
            gte: startOfYear,
          },
        },
      }),

      prisma.siteVisit.count(),
    ]);

    // First group SiteVisit rows by visitor so each repeat visit is counted.
    const visitsByVisitor = await prisma.siteVisit.groupBy({
      by: ["visitorId"],
      _count: {
        id: true,
      },
    });

    const visitorIds = visitsByVisitor.map((item) => item.visitorId);

    const visitors = visitorIds.length
      ? await prisma.visitor.findMany({
          where: {
            id: {
              in: visitorIds,
            },
          },
          select: {
            id: true,
            country: true,
            countryCode: true,
          },
        })
      : [];

    const visitorLookup = new Map(
      visitors.map((visitor) => [visitor.id, visitor]),
    );

    const visitsByCountryMap = new Map();

    for (const visitGroup of visitsByVisitor) {
      const visitor = visitorLookup.get(visitGroup.visitorId);
      const country = visitor?.country || "Unknown";
      const countryCode = visitor?.countryCode || "UN";
      const mapKey = `${countryCode}:${country}`;

      // Merge all visitors from the same country into one frontend-friendly row.
      const current = visitsByCountryMap.get(mapKey) || {
        country,
        countryCode,
        visits: 0,
      };

      current.visits += visitGroup._count.id;
      visitsByCountryMap.set(mapKey, current);
    }

    const visitorsByCountry = Array.from(visitsByCountryMap.values()).sort(
      (left, right) => right.visits - left.visits,
    );

    return res.json({
      stats: {
        thisMonth,
        thisYear,
        allTime,
      },
      visitorsByCountry,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
