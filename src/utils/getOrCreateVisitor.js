import prisma from "../../prisma/prisma.client.js";

const unknownGeoData = {
  country: "Unknown",
  city: "Unknown",
  countryCode: "UN",
};

const fetchGeoData = async (ip) => {
  const isLoopback = ip === "::1" || ip === "127.0.0.1" || ip === "localhost";

  if (isLoopback) {
    return unknownGeoData;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      return unknownGeoData;
    }

    const data = await response.json();

    if (data.status !== "success") {
      return unknownGeoData;
    }

    return {
      country: data.country,
      city: data.city,
      countryCode: data.countryCode,
    };
  } catch (err) {
    console.error("Geo fetch failed!", err.message);
    return unknownGeoData;
  } finally {
    clearTimeout(timeout);
  }
};

const getOrCreateVisitor = async (ip, req) => {
  if (!ip) {
    throw new Error("Client IP address is required to track visitors");
  }

  // Check if the visitor exists in the table
  let visitor = await prisma.visitor.findFirst({
    where: { ipAddress: ip },
  });

  // Refresh missing geo data for an existing visitor so older "Unknown" records
  // can improve naturally once the app sees a resolvable request from the same IP.
  if (visitor) {
    const shouldTryGeoRefresh = !visitor.country || visitor.country === "Unknown";

    if (!shouldTryGeoRefresh) {
      return visitor;
    }

    const geoData = await fetchGeoData(ip);

    if (geoData.country === "Unknown") {
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

  const geoData = await fetchGeoData(ip);

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
