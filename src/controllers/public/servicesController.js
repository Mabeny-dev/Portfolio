import prisma from "../../../prisma/prisma.client.js";

const getAllServicesPublic = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { status: "PUBLISHED", isVisible: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, data: services });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { getAllServicesPublic };
