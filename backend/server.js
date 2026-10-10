import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "20kb" }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["member", "owner"], required: true },
  membership: { type: String, enum: ["Starter", "Pro", "Elite"], default: "Starter" },
  membershipStatus: { type: String, enum: ["Active", "Pending", "Expired"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });
}

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) return res.status(401).json({ message: "Please sign in to continue." });
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Your session expired. Please sign in again." });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.auth?.role !== role) return res.status(403).json({ message: "You do not have permission to access this area." });
    next();
  };
}

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "IronPulse API" }));

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (name.trim().length > 80 || password.length < 8) {
      return res.status(400).json({ message: "Name must be under 80 characters and password must be at least 8 characters." });
    }
    if (!["member", "owner"].includes(role)) return res.status(400).json({ message: "Choose Member or Gym Owner." });
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ message: "An account with this email already exists." });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash, role });
    return res.status(201).json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, membership: user.membership, membershipStatus: user.membershipStatus }
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "Could not create account. Please try again." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !["member", "owner"].includes(role)) {
      return res.status(400).json({ message: "Email, password and account type are required." });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }
    if (user.role !== role) return res.status(403).json({ message: `This account is registered as ${user.role === "owner" ? "Gym Owner" : "Member"}. Choose the matching login.` });
    return res.json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, membership: user.membership, membershipStatus: user.membershipStatus }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Could not sign in. Please try again." });
  }
});

app.get("/api/me", auth, async (req, res) => {
  const user = await User.findById(req.auth.sub).select("name email role membership membershipStatus createdAt");
  if (!user) return res.status(404).json({ message: "Account not found." });
  res.json({ user });
});

app.get("/api/owner/overview", auth, requireRole("owner"), async (_req, res) => {
  const [members, activeMembers, owners] = await Promise.all([
    User.countDocuments({ role: "member" }),
    User.countDocuments({ role: "member", membershipStatus: "Active" }),
    User.countDocuments({ role: "owner" })
  ]);
  res.json({
    stats: [
      { label: "Total members", value: members, icon: "users" },
      { label: "Active memberships", value: activeMembers, icon: "activity" },
      { label: "Owner accounts", value: owners, icon: "shield-check" }
    ],
    latestMembers: await User.find({ role: "member" }).sort({ createdAt: -1 }).limit(5).select("name email membership membershipStatus createdAt")
  });
});

app.patch("/api/owner/members/:id/status", auth, requireRole("owner"), async (req, res) => {
  if (!["Active", "Pending", "Expired"].includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid membership status." });
  }
  const member = await User.findOneAndUpdate(
    { _id: req.params.id, role: "member" },
    { membershipStatus: req.body.status },
    { new: true, runValidators: true }
  ).select("name email membership membershipStatus");
  if (!member) return res.status(404).json({ message: "Member not found." });
  res.json({ member });
});

app.get("/api/member/overview", auth, requireRole("member"), async (req, res) => {
  const user = await User.findById(req.auth.sub).select("name email membership membershipStatus createdAt");
  if (!user) return res.status(404).json({ message: "Account not found." });
  res.json({
    user,
    tips: [
      { title: "Train with intent", detail: "Set one clear goal before each workout." },
      { title: "Recover well", detail: "Sleep, hydrate and allow muscles time to recover." },
      { title: "Stay consistent", detail: "Small repeatable sessions build lasting progress." }
    ]
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});

const port = process.env.PORT || 5000;
if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET. Copy .env.example to .env and set a secret.");
  process.exit(1);
}
try {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ironpulse_gym");
  console.log("MongoDB connected");
  app.listen(port, () => console.log(`IronPulse API running at http://localhost:${port}`));
} catch (error) {
  console.error("MongoDB connection failed:", error.message);
  process.exit(1);
}
