import prisma from "../../../prisma/prisma.client.js";

/**
 * GET ALL MESSAGES (for admin dashboard)
 * Includes visitor info (country, city)
 */
const getMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      include: {
        visitor: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(messages);
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
