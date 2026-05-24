import prisma from "../../../prisma/prisma.client.js";

// GET ALL PUBLISHED PRODUCTS
const getAllProductsPublic = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { status: "PUBLISHED", isVisible: true },
      orderBy: { createdAt: "desc" }, // Newest items first
    });
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { getAllProductsPublic };
