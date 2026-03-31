// Centralized error handling

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Handle Prisma unique constraint error
  if (err.code === "P2002") {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
};
