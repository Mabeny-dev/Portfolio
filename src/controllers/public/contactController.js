import prisma from "../../../prisma/prisma.client.js";
import { getOrCreateVisitor } from "../../utils/getOrCreateVisitor.js";

const sendMessage = async (req, res) => {
  try {
    //1. Extract data from request body
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    //2. Get user's IP
    const rawIp = req.ip || req.socket.remoteAddress;

    console.log(rawIp);
    // Clean IPv6 format (e.g. ::ffff:127.0.0.1 → 127.0.0.1)
    const ip = rawIp?.replace("::ffff:", "")?.trim();
    console.log(ip);

    // 3. Get or create a vistor
    const visitor = await getOrCreateVisitor(ip, req);
    console.log(visitor);

    // 3. Save Message and link to Visitor
    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
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
