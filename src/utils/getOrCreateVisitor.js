import prisma from "../../prisma/prisma.client.js";

const getOrCreateVisitor = async (ip, req) => {
  // Check if the visitor exists in the table
  let visitor = await prisma.visitor.findFirst({
    where: { ipAddress: ip },
  });

  // return if already in the table
  if (visitor) return visitor;

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

  // Create new visitor
  return await prisma.visitor.create({
    data: {
      ipAddress: ip,
      ...geoData,
      userAgent: req.get("User-Agent"),
    },
  });
};

export { getOrCreateVisitor };
