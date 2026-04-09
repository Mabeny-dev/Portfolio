import prisma from "../../prisma/prisma.client.js";

const toBaseSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const generateUniqueSlug = async (title, excludeArticleId) => {
  const baseSlug = toBaseSlug(title);

  if (!baseSlug) {
    throw new Error("Unable to generate a slug from the provided title");
  }

  let slug = baseSlug;
  let suffix = 1;

  // Keep appending a numeric suffix until the slug is unique.
  while (true) {
    const existingArticle = await prisma.article.findFirst({
      where: {
        slug,
        ...(excludeArticleId && {
          NOT: {
            id: excludeArticleId,
          },
        }),
      },
      select: {
        id: true,
      },
    });

    if (!existingArticle) {
      return slug;
    }

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
};

export { generateUniqueSlug };
