const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const db = require("../models");

const User = db.User;
const { Op } = require("sequelize");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const cleanUser = (user) => {
  const userResponse = user.toJSON();
  delete userResponse.password;
  delete userResponse.resetPasswordToken;
  delete userResponse.resetPasswordExpires;
  return userResponse;
};

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password, phone, companyName, address, role } =
      req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email or username",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      companyName: companyName || null,
      address: address || null,
      role: role || "customer",
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      user: cleanUser(user),
      token,
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      user: cleanUser(user),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: {
        exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    // Security: don't reveal whether account exists
    if (!user) {
      return res.json({
        message:
          "If an account exists with that email, a password reset link has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const resetExpires = new Date(Date.now() + 1000 * 60 * 30);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = resetExpires;

    await user.save();

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const resetLink = `${frontendUrl}/reset-password/${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: "Naglink Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
          <h2 style="color:#0f172a;">
            Password Reset Request
          </h2>

          <p>Hello ${user.username},</p>

          <p>
            We received a request to reset your Naglink account password.
          </p>

          <p>
            Click the button below to reset your password:
          </p>

          <p style="margin:30px 0;">
            <a
              href="${resetLink}"
              style="
                background:#1d4ed8;
                color:white;
                padding:12px 20px;
                text-decoration:none;
                border-radius:6px;
                font-weight:bold;
              "
            >
              Reset Password
            </a>
          </p>

          <p>
            This link will expire in 30 minutes.
          </p>

          <p>
            If you did not request a password reset,
            please ignore this email.
          </p>

          <hr />

          <p style="font-size:12px;color:#64748b;">
            Naglink Investments
          </p>
        </div>
      `,
    });

    res.json({
      message:
        "If an account exists with that email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      message: "Error processing forgot password request",
      error: error.message,
    });
  }
};
// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Reset token is required",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.json({
      message: "Password reset successfully. You can now login.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
};