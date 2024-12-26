// import User from "../models/User.js"; 
import User from "../../models/User.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const generateTokens = (user) => {
  const SECRET_KEY = process.env.JWT_SECRET_KEY ;
  const REFRESH_SECRET_KEY =process.env.JWT_REFRESH_SECRET_KEY;
  console.log(SECRET_KEY);
  console.log(REFRESH_SECRET_KEY);
  const accessToken = jwt.sign(
    { id: user.ID, username: user.Name},
    SECRET_KEY,
    
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    REFRESH_SECRET_KEY,
   
  );

  return { accessToken, refreshToken };
};
export const register = async (req, res) => {
  try {
    const { type, username, email, password } = req.body;

    const existingUser = await User.findOne({ where: { Email:email } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      Type: type,
      Name: username,
      Email: email,
      Password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { Email:email } });
    // console.log(user)

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // console.log(password);
    // console.log(user.Password);
    const isMatch = await bcrypt.compare(password, user.Password);
    // console.log(isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(200).json({
      //   message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const refreshToken = (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token missing" });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);

    const user = { id: decoded.id, username: decoded.username }; 
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.status(200).json({
      message: "Token refreshed",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};
