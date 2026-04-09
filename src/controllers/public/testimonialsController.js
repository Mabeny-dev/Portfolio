import prisma from "../../../prisma/prisma.client.js";

const getTestimonialPublic = async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        isVisible: true,
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

export { getTestimonialPublic };
