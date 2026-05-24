import prisma from "../../../prisma/prisma.client.js";

const getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, data: services });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const { title, description, icon, status, isVisible } = req.body;

    if (!title || !description || !icon) {
      return res
        .status(400)
        .json({ error: "title, description, and icon are required." });
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        icon,
        status: status || "DRAFT",
        isVisible: isVisible ?? true,
      },
    });

    return res.status(201).json({ success: true, data: service });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon, status, isVisible } = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        title,
        description,
        icon,
        status,
        isVisible,
      },
    });

    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Service not found" });
    }

    return res.status(500).json({ error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.service.delete({
      where: { id },
    });

    return res
      .status(200)
      .json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Service not found" });
    }

    return res.status(500).json({ error: error.message });
  }
};

export {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
};
