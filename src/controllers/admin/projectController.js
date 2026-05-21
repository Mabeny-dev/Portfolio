import prisma from "../../../prisma/prisma.client.js";

const createProject = async (req, res) => {
  try {
    const { title, description, year, tags } = req.body;

    if (!title || !description || !year || !Array.isArray(tags)) {
      return res.status(400).json({
        message: "title, description, year, and tags are required",
      });
    }

    const project = await prisma.project.create({
      data: req.body,
    });

    return res.status(201).json({ status: "SUCCESS", data: project });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProjectsAdmin = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.project.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json({ status: "SUCCESS", data: updated });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "SUCCESS",
      message: "Project deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(500).json({ message: error.message });
  }
};

export { createProject, getProjectsAdmin, updateProject, deleteProject };
