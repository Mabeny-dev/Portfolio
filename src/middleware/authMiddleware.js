import prisma from "../../prisma/prisma.client.js";
import jwt from "jsonwebtoken";

// Protect admin routes
const protect = async (req, res, next) => {
  let token;

  // Extract token from the header
  if (req.headers?.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    if (!admin) {
      return res.status(401).json({ message: "Admin not found!" });
    }
    // Attach admin to request
    req.admin = admin;
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
