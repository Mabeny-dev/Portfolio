export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === "P2002") {
    return res.status(400).json({
      message: "A record with this value already exists",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      message: "Record not found",
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      message:
        "Uploaded content is too large. Use a smaller image or increase REQUEST_BODY_LIMIT.",
    });
  }

  return res.status(500).json({
    message: err.message || "Internal Server Error",
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
