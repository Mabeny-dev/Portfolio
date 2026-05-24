import prisma from "../../../prisma/prisma.client.js";

// GET ALL PRODUCTS FOR ADMIN (Includes Drafts & Published)
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET A SINGLE PRODUCT BY ID (To populate the form field when editing)
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// CREATE Product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      tagline,
      description,
      year,
      status,
      tags,
      liveUrl,
      image,
      isVisible,
    } = req.body;

    if (!name || !tagline || !description || !year) {
      return res
        .status(400)
        .json({ error: "name, tagline, description, and year are required." });
    }

    const tagsArray =
      typeof tags === "string"
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : tags;

    const newProduct = await prisma.product.create({
      data: {
        name,
        tagline,
        description,
        year: parseInt(year, 10),
        status: status || "DRAFT",
        tags: tagsArray || [],
        liveUrl,
        image,
        isVisible: isVisible ?? true,
      },
    });
    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// UPDATE A PRODUCT
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      tagline,
      description,
      year,
      status,
      tags,
      liveUrl,
      image,
      isVisible,
    } = req.body;

    const tagsArray =
      typeof tags === "string"
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : tags;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        tagline,
        description,
        year: year ? parseInt(year, 10) : undefined,
        status,
        tags: tagsArray,
        liveUrl,
        image,
        isVisible,
      },
    });
    return res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(500).json({ error: error.message });
  }
};

// DELETE A PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(500).json({ error: error.message });
  }
};

export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
