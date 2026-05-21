import prisma from "../../../prisma/prisma.client.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/generateToken.js";

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userExists = await prisma.admin.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ error: "This email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = generateToken(user.id, res);

    return res.status(201).json({
      data: {
        status: "SUCCESS",
        admin: {
          id: user.id,
          email,
        },
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = generateToken(admin.id, res);

    return res.status(200).json({
      data: {
        status: "SUCCESS",
        admin: {
          id: admin.id,
          email,
        },
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
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
