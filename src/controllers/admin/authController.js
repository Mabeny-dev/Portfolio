import prisma from "../../../prisma/prisma.client.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/generateToken.js";

const register = async (req, res) => {
  const { email, password, name } = req.body;
  // Check if the user exists in the DB
  const userExists = await prisma.admin.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res.status(400).json({ error: "This email already exists" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the user
  const user = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      name: name,
    },
  });

  const token = generateToken(user.id, res);
  return res.status(201).json({
    data: {
      status: "SUCCESS",
      admin: {
        id: user.id,
        email: email,
      },
      token,
    },
  });
};

// Admin login
const login = async (req, res) => {
  // Check admin exists
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({
    where: { email: email },
  });

  if (!admin) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }
  // Verify the password
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }
  // Generate a token
  const token = generateToken(admin.id, res);
  return res.status(201).json({
    data: {
      status: "SUCCESS",
      admin: {
        id: admin.id,
        email: email,
      },
      token,
    },
  });
};

const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res
    .status(200)
    .json({ status: "SUCCESS", message: "Logged out successfully!" });
};

export { register, login, logout };
