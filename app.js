require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const Subscriber = require("./models/waitList");

const app = express();

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// Use routes

// ROUTES
app.get("/", (req, res) => {
  res.render("pages/coming-soon");
});

app.get("/thank-you", (req, res) => {
  res.render("pages/thank-you");
});

app.post("/notify", async (req, res) => {
  const { email } = req.body;
  try {
    await Subscriber.create({ email });
    res.redirect("/thank-you");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
});

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
