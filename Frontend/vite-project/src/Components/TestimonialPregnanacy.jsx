import React, { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AdminContext } from "./Admin";

const Testimonialpregnancy = () => {
  const { isAdmin } = useContext(AdminContext);
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    city: "",
    text: "",
    photo: null,
    preview: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const fileInputRef = useRef();

  const backendURL = "https://pcos-webinar.onrender.com"; // replace with your deployed backend if needed

  // ---------------- Fetch Testimonials ----------------
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/pcos`);
      setTestimonials(res.data);
    } catch (err) {
      console.log("Error fetching testimonials:", err);
    }
  };

  // ---------------- Form Handlers ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTestimonial({ ...newTestimonial, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTestimonial({
          ...newTestimonial,
          photo: file,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newTestimonial.name);
      formData.append("city", newTestimonial.city);
      formData.append("review", newTestimonial.text);
      if (newTestimonial.photo) {
        formData.append("photo", newTestimonial.photo);
      }

      if (editingIndex !== null) {
        const id = testimonials[editingIndex]._id;
        await axios.put(`${backendURL}/api/pcos/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${backendURL}/api/pcos`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchTestimonials();
      setNewTestimonial({ name: "", city: "", text: "", photo: null, preview: "" });
      setShowForm(false);
      setEditingIndex(null);
    } catch (err) {
      console.log("Error submitting testimonial:", err);
    }
  };

  const handleEdit = (index) => {
    const t = testimonials[index];
    setNewTestimonial({
      name: t.name,
      city: t.city,
      text: t.review,
      photo: null,
      preview: `${backendURL}${t.photo}`,
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendURL}/api/pcos/${id}`);
      fetchTestimonials();
    } catch (err) {
      console.log("Error deleting testimonial:", err);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6 sm:px-10 md:px-20 lg:px-32 bg-gradient-to-r from-[#FFB7C5] to-[#FFB7C5]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-[#663398] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          PCOS to Pregnancy Success Stories
        </motion.h2>

        <p className="text-center text-[#663398] mb-12">
          Miracles happen when determination meets the right guidance
        </p>

        {/* Testimonials Slider */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6 py-4"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          >
 {testimonials.map((testimonial, index) => (
  <motion.div
    key={`${testimonial._id || testimonial.id}-${index}`}
    className="min-w-[280px] max-w-sm bg-white shadow-lg rounded-2xl p-4 flex flex-col justify-between"
  >
                <div className="flex flex-col items-center text-center">
                  <div className="w-28 h-28 rounded-full overflow-hidden shadow-md border-4 border-[#FFB7C5] mb-3">
                    <img
                      src={testimonial.photo ? `${backendURL}${testimonial.photo}` : "/images/dummy.jpg"}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-lg text-[#663398]">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.city}</p>
                </div>

                <p className="text-gray-700 text-sm mt-3 italic">
                  {expandedIndex === index
                    ? testimonial.review
                    : testimonial.review.substring(0, 120) + "..."}
                </p>

                <button
                  onClick={() => toggleExpand(index)}
                  className="text-[#663398] font-semibold text-xs mt-2 hover:text-[#FFB7C5] transition"
                >
                  {expandedIndex === index ? "Read Less" : "Read More"}
                </button>

                <div className="mt-4 flex justify-between items-center">
                  <span className="px-3 py-1 bg-[#FFB7C5] text-[#663398] rounded-full text-xs font-bold shadow">
                    🎉 Pregnancy Success
                  </span>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(index)} className="text-blue-600 text-xs">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(testimonial._id)} className="text-red-600 text-xs">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Admin Add/Edit Button */}
        {isAdmin && (
          <div className="mt-8 text-center">
            <button
              className="px-6 py-3 bg-[#663398] text-white rounded-lg font-semibold hover:bg-[#4a246c] transition-colors"
              onClick={() => setShowForm(!showForm)}
            >
              {editingIndex !== null ? "Edit Testimonial" : "Add Testimonial"}
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            className="mt-8 max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold text-[#663398] mb-4 text-center">
              {editingIndex !== null ? "Edit Testimonial" : "Add New Testimonial"}
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={newTestimonial.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#663398] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={newTestimonial.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#663398] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial</label>
              <textarea
                name="text"
                value={newTestimonial.text}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#663398] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border hover:bg-gray-200 transition-colors"
                >
                  Choose Photo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {newTestimonial.preview && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border">
                    <img
                      src={newTestimonial.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#663398] text-white rounded-lg font-semibold hover:bg-[#4a246c] transition-colors"
              >
                {editingIndex !== null ? "Update" : "Submit"}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
};

export default Testimonialpregnancy;
