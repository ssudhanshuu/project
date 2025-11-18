import React, { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Send to backend or show success message here
  };

  return (
    <div className="max-w-3xl mt-30 mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            name="message"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Write your message here..."
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
