import prisma from "../../../prisma/prisma.client.js";

const PRODUCT_CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=86400";

const publicImageUrl = (req, product) => {
  if (!product.image) return null;
  if (!product.image.startsWith("data:")) return product.image;

  const version = product.updatedAt instanceof Date
    ? product.updatedAt.getTime()
    : new Date(product.updatedAt).getTime();

  return `${req.protocol}://${req.get("host")}/api/public/products/${encodeURIComponent(product.id)}/image?v=${version}`;
};

// GET ALL PUBLISHED PRODUCTS
const getAllProductsPublic = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { status: "PUBLISHED", isVisible: true },
      orderBy: { createdAt: "desc" }, // Newest items first
    });

    res.set("Cache-Control", PRODUCT_CACHE_CONTROL);
    return res.status(200).json({
      success: true,
      data: products.map((product) => ({
        ...product,
        image: publicImageUrl(req, product),
      })),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getProductImagePublic = async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: req.params.id,
        status: "PUBLISHED",
        isVisible: true,
      },
      select: { image: true },
    });

    if (!product?.image) {
      return res.status(404).json({ error: "Product image not found" });
    }

    if (!product.image.startsWith("data:")) {
      return res.redirect(302, product.image);
    }

    const match = product.image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/);
    if (!match) {
      return res.status(415).json({ error: "Unsupported product image format" });
    }

    const [, contentType, encodedImage] = match;
    const image = Buffer.from(encodedImage, "base64");

    res.set({
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": contentType,
      "Content-Length": String(image.length),
      "Cross-Origin-Resource-Policy": "cross-origin",
    });
    return res.status(200).send(image);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { getAllProductsPublic, getProductImagePublic };
