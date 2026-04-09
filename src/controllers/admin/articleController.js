import prisma from "../../../prisma/prisma.client.js";
import { generateUniqueSlug } from "../../utils/generateUniqueSlug.js";

const getArticlesAdmin = async (req, res) => {
  try {
    const { status, tag } = req.query;

    const articles = await prisma.article.findMany({
      where: {
        // Keep filtering optional so the admin dashboard can request everything by default.
        ...(status && { status }),
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

const createArticle = async (req, res) => {
  try {
    const { title, tag, status, image, content } = req.body;

    // These fields are required by the Prisma schema and the admin form should provide them.
    if (!title || !tag || !content) {
      return res.status(400).json({
        message: "title, tag, and content are required",
      });
    }

    // The UI does not expose a slug field, so the API derives one from the title.
    const slug = await generateUniqueSlug(title);

    const article = await prisma.article.create({
      data: {
        title,
        tag,
        status,
        image,
        content,
        slug,
      },
    });

    return res.status(201).json({
      status: "SUCCESS",
      data: article,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, tag, status, image, content } = req.body;

    const data = {};

    if (title !== undefined) {
      data.title = title;
      // Keep the URL in sync when the article title changes.
      data.slug = await generateUniqueSlug(title, id);
    }

    if (tag !== undefined) data.tag = tag;
    if (status !== undefined) data.status = status;
    if (image !== undefined) data.image = image;
    if (content !== undefined) data.content = content;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }

    const article = await prisma.article.update({
      where: { id },
      data,
    });

    return res.status(200).json({
      status: "SUCCESS",
      data: article,
    });
  } catch (error) {
    // Prisma uses P2025 when an update/delete target does not exist.
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Article not found" });
    }

    return res.status(500).json({ message: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.article.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "SUCCESS",
      message: "Article deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Article not found" });
    }

    return res.status(500).json({ message: error.message });
  }
};

export { getArticlesAdmin, createArticle, updateArticle, deleteArticle };
