import prisma from "../../../prisma/prisma.client.js";

const plainText = (content = "") =>
  content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toSummary = (article) => {
  const text = plainText(article.content);
  const wordCount = text ? text.split(/\s+/).length : 0;

  return {
    id: article.id,
    title: article.title,
    tag: article.tag,
    status: article.status,
    slug: article.slug,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    excerpt: text.slice(0, 180),
    readingMinutes: Math.max(1, Math.round(wordCount / 200)),
    // Embedded Base64 covers make list payloads enormous. Detail pages still
    // receive the full image; URL-based covers can be used in the listing.
    image: article.image?.startsWith("data:") ? null : article.image,
  };
};

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

    return res.status(200).json(articles.map(toSummary));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getArticleDetailPublic = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await prisma.article.findFirst({
      where: {
        status: "PUBLISHED",
        OR: [{ slug }, { id: slug }],
      },
    });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    return res.status(200).json(article);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { getArticlePublic, getArticleDetailPublic };
