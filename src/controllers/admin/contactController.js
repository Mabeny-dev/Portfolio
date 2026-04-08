import prisma from "../../../prisma/prisma.client.js";

/**
 * GET ALL MESSAGES (for admin dashboard)
 * Includes visitor info (country, city)
 */
const getMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      include: {
        visitor: {
          select: {
            id: true,
            ipAddress: true,
            country: true,
            city: true,
            countryCode: true,
            userAgent: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Always return a location object so the frontend can render one consistent shape.
    const messagesWithLocation = messages.map((message) => ({
      ...message,
      location: {
        country: message.senderCountry || message.visitor?.country || "Unknown",
        city: message.senderCity || message.visitor?.city || "Unknown",
        countryCode:
          message.senderCountryCode || message.visitor?.countryCode || "UN",
      },
    }));

    res.json(messagesWithLocation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET MESSAGE STATS
 * total + unread count
 */
const getMessageStats = async (req, res) => {
  try {
    const total = await prisma.contactMessage.count();

    const unread = await prisma.contactMessage.count({
      where: { read: false },
    });

    res.json({
      total,
      unread,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * MARK MESSAGE AS READ
 * Triggered when clicking email icon
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });

    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getMessages, getMessageStats, markAsRead };
