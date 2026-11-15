const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

function publicUser(user) {
  return {
    id: user._id,
    fullname: user.fullname,
    student_id: user.student_id,
    email: user.email,
    role: user.role
  };
}

function setSession(res, user) {
  const token = jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("campus_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 86400000
  });
}

async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.campus_token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid session" });
  }
}

router.post("/register", authLimiter, async (req, res) => {
  try {
    const { fullname, student_id, email, password, role } = req.body;

    if (
      typeof fullname !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      fullname.trim().length < 2 ||
      fullname.length > 150 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 ||
      password.length < 8 ||
      password.length > 72 ||
      !["student", "faculty"].includes(role)
    ) {
      return res.status(400).json({ error: "Invalid registration details" });
    }

    if (student_id != null &&
        (typeof student_id !== "string" || student_id.length > 100)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullname: fullname.trim(),
      student_id: student_id?.trim() || "",
      email: normalizedEmail,
      password: hashedPassword,
      role
    });

    setSession(res, user);

    res.status(201).json({
      message: "Registration successful",
      user: publicUser(user)
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Account already exists" });
    }

    console.error("Registration error:", error.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    setSession(res, user);

    res.json({
      message: "Login successful",
      user: publicUser(user)
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", authenticate, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.post("/logout", (req, res) => {
  res.clearCookie("campus_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  res.json({ message: "Logged out successfully" });
});

module.exports = router;
