const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Razorpay = require("razorpay");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ----------------- MongoDB Connection -----------------
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ----------------- Multer Setup -----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/testimonials";
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ----------------- Schemas -----------------
const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const Admin = mongoose.model("Admin", adminSchema);

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  sessionType: String,
  dateTime: Date,
  whatsappGroup: String,
  paid: { type: Boolean, default: false },
  razorpay_order_id: String,
  razorpay_payment_id: String,
});
const Booking = mongoose.model("Booking", bookingSchema);

const testimonialSchema = new mongoose.Schema({
  name: String,
  city: String,
  review: String,
  photo: String,
});
const Testimonial = mongoose.model("Testimonial", testimonialSchema);

const pcosSchema = new mongoose.Schema({
  name: String,
  city: String,
  review: String,
  photo: String,
}, { collection: "pcos" });
const PcosTestimonial = mongoose.model("PcosTestimonial", pcosSchema);

const webinarSchema = new mongoose.Schema({
  webinarDate: { type: Date, required: true },
  price: { type: Number, default: 99 }
});
const Webinar = mongoose.model("Webinars", webinarSchema);

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

// ----------------- Booking / Payment APIs -----------------
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = { amount: amount * 100, currency: currency || "INR", receipt: `receipt_${Date.now()}` };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Razorpay order creation failed" });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const { name, email, phone, sessionType, dateTime, razorpay_order_id } = req.body;
    const newBooking = new Booking({
      name,
      email,
      phone,
      sessionType,
      dateTime,
      whatsappGroup: process.env.WHATSAPP_GROUP_LINK,
      paid: false,
      razorpay_order_id,
    });
    await newBooking.save();

    // ✅ Modified response: return _id at top level too
    res.status(200).json({ success: true, _id: newBooking._id, booking: newBooking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Booking failed" });
  }
});

// ✅ Update payment status route
app.put("/api/bookings/:id/pay", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(id, { paid: true }, { new: true });
    res.json({ success: true, booking: updatedBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment update failed" });
  }
});

app.post("/api/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { paid: true, razorpay_payment_id },
        { new: true }
      );
      res.json({ success: true, booking });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/bookings", async (req, res) => {
  const bookings = await Booking.find().sort({ dateTime: 1 });
  res.json(bookings);
});

// ----------------- Webinar APIs -----------------
app.post("/api/webinars", async (req, res) => {
  try {
    const { webinarDate, price } = req.body;
    let webinar = await Webinar.findOne();
    if (webinar) {
      webinar.webinarDate = webinarDate;
      webinar.price = Number(price) || 99;
      await webinar.save();
    } else {
      webinar = new Webinar({ webinarDate, price: Number(price) || 99 });
      await webinar.save();
    }
    res.json({ success: true, webinar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to save webinar" });
  }
});

app.get("/api/webinars", async (req, res) => {
  try {
    const webinar = await Webinar.findOne();
    res.json(webinar);
  } catch (err) {
    res.status(500).json({ message: "Error fetching webinar details" });
  }
});

// ----------------- Testimonials APIs -----------------
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
    const photo = req.file ? `/uploads/testimonials/${req.file.filename}` : null;
    const newTestimonial = new Testimonial({ name, city, review, photo });
    await newTestimonial.save();
    res.json(newTestimonial);
  } catch (err) {
    res.status(500).json({ message: "Error saving testimonial" });
  }
});

app.put("/api/testimonials/:id", upload.single("photo"), async (req, res) => {
  try {
    const { name, city, review } = req.body;
    const updateData = { name, city, review };
    if (req.file) updateData.photo = `/uploads/testimonials/${req.file.filename}`;
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating testimonial" });
  }
});

app.delete("/api/testimonials/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid testimonial ID" });
    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Testimonial not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete Error:", err);
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
    const photo = req.file ? `/uploads/testimonials/${req.file.filename}` : null;
    const newTestimonial = new PcosTestimonial({ name, city, review, photo });
    await newTestimonial.save();
    res.json(newTestimonial);
  } catch (err) {
    res.status(500).json({ message: "Error saving PCOS testimonial" });
  }
});

app.put("/api/pcos/:id", upload.single("photo"), async (req, res) => {
  try {
    const { name, city, review } = req.body;
    const updateData = { name, city, review };
    if (req.file) updateData.photo = `/uploads/testimonials/${req.file.filename}`;
    const updated = await PcosTestimonial.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating PCOS testimonial" });
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
