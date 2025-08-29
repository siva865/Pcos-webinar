const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Razorpay = require("razorpay");
const multer = require("multer");
require("dotenv").config();

const cloudinary = require("cloudinary").v2;

const app = express();
app.use(cors());
app.use(express.json());

// ----------------- MongoDB Connection -----------------
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// ----------------- Cloudinary Config -----------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL.split("@")[1].split("/")[0],
  api_key: process.env.CLOUDINARY_URL.split("://")[1].split(":")[0],
  api_secret: process.env.CLOUDINARY_URL.split(":")[2].split("@")[0],
});

// ----------------- Multer Memory Storage -----------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ----------------- Schemas -----------------
const adminSchema = new mongoose.Schema({ username: String, password: String });
const Admin = mongoose.model("Admin", adminSchema);

const webinarSchema = new mongoose.Schema({
  date: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  language: { type: String, required: true },
  price: { type: Number, default: 99 },
});
const Webinar = mongoose.model("Webinar", webinarSchema);

const testimonialSchema = new mongoose.Schema({
  name: String,
  city: String,
  review: String,
  photo: String,
});
const Testimonial = mongoose.model("Testimonial", testimonialSchema);

const pcosSchema = new mongoose.Schema(
  { name: String, city: String, review: String, photo: String },
  { collection: "pcos" }
);
const PcosTestimonial = mongoose.model("PcosTestimonial", pcosSchema);

// ----------------- Razorpay Setup -----------------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ----------------- Admin Login -----------------
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ success: true, token: "dummy-token" });
  } else {
    return res.status(401).json({ message: "Invalid Credentials" });
  }
});

// ----------------- Webinar APIs -----------------
app.get("/api/webinars", async (req, res) => {
  try {
    const webinar = await Webinar.findOne();
    res.json({ webinar });
  } catch (err) {
    res.status(500).json({ message: "Error fetching webinar details" });
  }
});

app.post("/api/webinars", async (req, res) => {
  try {
    const { date, day, time, language, price } = req.body;
    let webinar = await Webinar.findOne();

    if (webinar) {
      webinar.date = date;
      webinar.day = day;
      webinar.time = time;
      webinar.language = language;
      webinar.price = Number(price) || 99;
      await webinar.save();
    } else {
      webinar = new Webinar({ date, day, time, language, price: Number(price) || 99 });
      await webinar.save();
    }

    res.json({ success: true, webinar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to save webinar" });
  }
});

// ----------------- General Testimonials APIs -----------------
app.get("/api/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ _id: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: "Error fetching testimonials" });
  }
});

app.post("/api/testimonials", upload.single("photo"), async (req, res) => {
  try {
    const { name, city, review } = req.body;
    let photoUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "general_testimonials" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      photoUrl = result.secure_url;
    }

    const newTestimonial = new Testimonial({ name, city, review, photo: photoUrl });
    await newTestimonial.save();
    res.json(newTestimonial);
  } catch (err) {
    res.status(500).json({ message: "Error saving testimonial", error: err.message });
  }
});

app.put("/api/testimonials/:id", upload.single("photo"), async (req, res) => {
  try {
    const { name, city, review } = req.body;
    const updateData = { name, city, review };

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "general_testimonials" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      updateData.photo = result.secure_url;
    }

    const updated = await Testimonial.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating testimonial", error: err.message });
  }
});

app.delete("/api/testimonials/:id", async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Error deleting testimonial" });
  }
});

// ----------------- PCOS Testimonials APIs -----------------
app.get("/api/pcos", async (req, res) => {
  try {
    const testimonials = await PcosTestimonial.find().sort({ _id: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: "Error fetching PCOS testimonials" });
  }
});

app.post("/api/pcos", upload.single("photo"), async (req, res) => {
  try {
    const { name, city, review } = req.body;
    let photoUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "pcos_testimonials" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      photoUrl = result.secure_url;
    }

    const newTestimonial = new PcosTestimonial({ name, city, review, photo: photoUrl });
    await newTestimonial.save();
    res.json(newTestimonial);
  } catch (err) {
    res.status(500).json({ message: "Error saving PCOS testimonial", error: err.message });
  }
});

app.put("/api/pcos/:id", upload.single("photo"), async (req, res) => {
  try {
    const { name, city, review } = req.body;
    const updateData = { name, city, review };

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "pcos_testimonials" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      updateData.photo = result.secure_url;
    }

    const updated = await PcosTestimonial.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating PCOS testimonial", error: err.message });
  }
});

app.delete("/api/pcos/:id", async (req, res) => {
  try {
    await PcosTestimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Error deleting PCOS testimonial" });
  }
});

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
