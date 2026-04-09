import prisma from "../../../prisma/prisma.client.js";

const getTestimonialAdmin = async (req, res) => {
  try {
    const { isVisible } = req.query;

    const testimonials = await prisma.testimonial.findMany({
      where: {
        ...(isVisible !== undefined && {
          isVisible: isVisible === "true",
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(testimonials);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const { name, role, quote, image, isVisible } = req.body;

    if (!name || !role || !quote) {
      return res.status(400).json({
        message: "name, role, and quote are required",
      });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        quote,
        image,
        ...(isVisible !== undefined && { isVisible }),
      },
    });

    return res.status(201).json({
      status: "SUCCESS",
      data: testimonial,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, quote, image, isVisible } = req.body;

    const data = {};

    if (name !== undefined) data.name = name;
    if (role !== undefined) data.role = role;
    if (quote !== undefined) data.quote = quote;
    if (image !== undefined) data.image = image;
    if (isVisible !== undefined) data.isVisible = isVisible;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data,
    });

    return res.status(200).json({
      status: "SUCCESS",
      data: testimonial,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    return res.status(500).json({ message: error.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.testimonial.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "SUCCESS",
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    return res.status(500).json({ message: error.message });
  }
};

export {
  getTestimonialAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
