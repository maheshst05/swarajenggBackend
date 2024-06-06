const express = require("express");
const userModel = require("../models/user.model");
const userRouter = express.Router();
const bcrypt = require("bcrypt");

userRouter.post("/api/users/add", async (req, res) => {
  let { name, email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "email already exists", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      status: true,
      user: {
        username: newUser.name,
        mobileno: newUser.mobile,
        emial: newUser.email,
        _id: newUser._id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/api/user/login", async (req, res) => {
  let { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ msg: "uesr not fount !", status: false });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res
        .status(401)
        .json({ msg: "invalid credentials", status: false });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const nodemailer = require("nodemailer");

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bhandarisaurabh143@gmail.com",
    pass: "qucn cjnh rfjo uhss",
  },
});
userRouter.post("/api/forget/password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ msg: "Email not found", status: false });
    }

    // Generate password reset link (this is an example, you should create a secure token for resetting password)
    const resetLink = `http://localhost:3000/`;

    let mailOptions = {
      from: `"Mahesh" <your.email@example.com>`,
      to: email,
      subject: "Reset Your Password",
      html: `Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error occurred:", error);
        return res
          .status(500)
          .json({ msg: "Failed to send email", status: false });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({
          msg: "Password reset link sent to your email",
          status: true,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = userRouter;
