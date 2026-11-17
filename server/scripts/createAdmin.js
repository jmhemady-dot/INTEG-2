const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../.env")
});

const User = require("../models/User");

async function main() {
  let input = "";

  for await (const chunk of process.stdin) {
    input += chunk.toString();
  }

  const { fullname, email, password } = JSON.parse(input);
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (
    typeof fullname !== "string" ||
    fullname.trim().length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
    typeof password !== "string" ||
    password.length < 12 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    throw new Error("Invalid admin details or password.");
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MongoDB connection is not configured.");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({
    email: normalizedEmail
  });

  if (existing) {
    throw new Error(
      "This email already has an account. No changes made."
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await User.create({
    fullname: fullname.trim(),
    email: normalizedEmail,
    student_id: "",
    password: hashedPassword,
    role: "admin"
  });

  console.log("Admin account created successfully.");
}

main()
  .catch(err => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
