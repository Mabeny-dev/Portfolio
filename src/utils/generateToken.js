import jwt from "jsonwebtoken";
export const generateToken = (userId, res) => {
  const payload = { id: userId };

  //Generate the token
  const token = jwt.sign(payload, process.env.JWT_SECRET || "7d", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Store it in a cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * (24 * 60 * 60 * 1000),
  });
  return token;
};
