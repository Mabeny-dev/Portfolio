import prisma from "../../../prisma/prisma.client.js";
//////////////////////////
/////// ADMIN
//////////////////////////
//CREATE Project
const createProject = async (req, res) => {
  try {
    const project = await prisma.project.create({
      data: req.body,
    });
    return res.status(201).json({ status: "SUCCESS", data: project });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET all Projects (Admin Sees all the projects)
const getProjectsAdmin = async (req, res) => {
  try {
    const project = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// UPDATE project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.project.update({
      where: { id },
      data: req.body,
    });
    return res.status(200).json({ status: "SUCCESS", data: { updated } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id },
    });
    return res.status(200).json({ message: "Deleted successfully " });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { createProject, getProjectsAdmin, updateProject, deleteProject };
