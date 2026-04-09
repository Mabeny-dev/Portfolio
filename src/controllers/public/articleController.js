import prisma from "../../../prisma/prisma.client.js";

const getArticlePublic = async (req, res) => {
  try {
    const { tag } = req.query;

    const articles = await prisma.article.findMany({
      where: {
        // Public visitors should only receive published content.
        status: "PUBLISHED",
        ...(tag && { tag }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { getArticlePublic };
