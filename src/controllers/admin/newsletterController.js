import prisma from "../../../prisma/prisma.client.js";

const getSubscribers = async (req, res) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      select: {
        id: true,
        email: true,
        country: true,
        city: true,
        countryCode: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(subscribers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.newsletterSubscriber.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "SUCCESS",
      message: "Subscriber deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    return res.status(500).json({ message: error.message });
  }
};

export { getSubscribers, deleteSubscriber };
