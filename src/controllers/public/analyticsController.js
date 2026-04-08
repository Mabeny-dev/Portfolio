import prisma from "../../../prisma/prisma.client.js";
import { getClientIp } from "../../utils/getClientIp.js";
import { getOrCreateVisitor } from "../../utils/getOrCreateVisitor.js";

const recordSiteVisit = async (req, res) => {
  try {
    const ip = getClientIp(req);
    const visitor = await getOrCreateVisitor(ip, req);

    // Each call represents one deliberate "page visit" event from the frontend.
    const siteVisit = await prisma.siteVisit.create({
      data: {
        visitorId: visitor.id,
      },
    });

    return res.status(201).json({
      message: "Visit recorded",
      visitId: siteVisit.id,
    });
  } catch (err) {
    console.error("recordSiteVisit failed:", err);
    return res.status(500).json({ message: "Failed to record visit" });
  }
};

export { recordSiteVisit };
