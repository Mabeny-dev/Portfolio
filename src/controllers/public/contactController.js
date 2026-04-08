import prisma from "../../../prisma/prisma.client.js";
import { getClientIp } from "../../utils/getClientIp.js";
import { getOrCreateVisitor } from "../../utils/getOrCreateVisitor.js";

const sendMessage = async (req, res) => {
  try {
    //1. Extract data from request body
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Use the forwarded IP in production and normalize IPv4-mapped IPv6 addresses.
    const ip = getClientIp(req);

    // 3. Get or create a visitor
    const visitor = await getOrCreateVisitor(ip, req);

    // 4. Save the message with both a stable snapshot of the sender's location
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
    return res.status(500).json({ err: "failed to send message!" });
  }
};

export { sendMessage };
