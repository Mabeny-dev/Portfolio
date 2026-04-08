import prisma from "../../prisma/prisma.client.js";

const getOrCreateVisitor = async (ip, req) => {
  if (!ip) {
    throw new Error("Client IP address is required to track visitors");
  }

  // Check if the visitor exists in the table
  let visitor = await prisma.visitor.findFirst({
    where: { ipAddress: ip },
  });

  // Default geo data
  let geoData = {
    country: "Unknown",
    city: "Unknown",
    countryCode: "UN",
  };

  try {
    // Skip geolocation for local development loopback addresses.
    const isLoopback = ip === "::1" || ip === "127.0.0.1" || ip === "localhost";

    if (!isLoopback) {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      if (response.ok) {
        const data = await response.json();

        if (data.status === "success") {
          geoData = {
            country: data.country,
            city: data.city,
            countryCode: data.countryCode,
          };
        }
      }
    }
  } catch (err) {
    console.error("Geo fetch failed!", err.message);
  }

  // Refresh missing geo data for an existing visitor so older "Unknown" records
  // can improve naturally once the app sees a resolvable request from the same IP.
  if (visitor) {
    const shouldRefreshGeo =
      (!visitor.country || visitor.country === "Unknown") &&
      geoData.country !== "Unknown";

    if (!shouldRefreshGeo) {
      return visitor;
    }

    return prisma.visitor.update({
      where: { id: visitor.id },
      data: {
        country: geoData.country,
        city: geoData.city,
        countryCode: geoData.countryCode,
        userAgent: req.get("User-Agent"),
      },
    });
  }

  // Create the visitor the first time we see this IP.
  return await prisma.visitor.create({
    data: {
      ipAddress: ip,
      ...geoData,
      userAgent: req.get("User-Agent"),
    },
  });
};

export { getOrCreateVisitor };
