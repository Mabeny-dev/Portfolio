import prisma from "../../../prisma/prisma.client.js";

//PUBLIC: If visible and "PUBLISHED"
const getProjects = async (req, res) => {
  const { tag, year } = req.query;
  try {
    const projects = await prisma.project.findMany({
      where: {
        isVisible: true,
        status: "PUBLISHED",

        // Optional filters
        ...(tag && {
          tags: { has: tag },
        }),
        ...(year && {
          year: year,
        }),
      },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(projects);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export { getProjects };
