import prisma from "../../../prisma/prisma.client.js";
import { getClientIp } from "../../utils/getClientIp.js";
import { getOrCreateVisitor } from "../../utils/getOrCreateVisitor.js";

const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Use the forwarded IP in production and normalize IPv4-mapped IPv6 addresses.
    const ip = getClientIp(req);

    const visitor = await getOrCreateVisitor(ip, req);

    // Save the message with both a stable snapshot of the sender's location
    // and the visitor relation for future analytics queries.
    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
        senderCountry: visitor.country,
        senderCity: visitor.city,
        senderCountryCode: visitor.countryCode,
        visitorId: visitor.id,
      },
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("sendMessage failed:", err);
    return res.status(500).json({ message: "Failed to send message" });
  }
};

export { sendMessage };
