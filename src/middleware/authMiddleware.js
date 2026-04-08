import prisma from "../../prisma/prisma.client.js";
import jwt from "jsonwebtoken";

// Protect admin routes
const protect = async (req, res, next) => {
  let token;
  const authorizationHeader = req.headers?.authorization;

  // Only read the token when the Authorization header exists and uses the Bearer format.
  if (authorizationHeader?.startsWith("Bearer ")) {
    token = authorizationHeader.split(" ")[1];
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

    // Attach the authenticated admin, then continue to the protected route handler.
    req.admin = admin;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export { protect };
