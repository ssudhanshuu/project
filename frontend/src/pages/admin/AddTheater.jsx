import { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function AddTheater() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      if (!token) {
        alert("Unauthorized! Please login again.");
        return;
      }

      await axios.post(
        `${API_URL}/api/admin/theaters/create`,
        { name, location, totalSeats },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Theater Created ✅");
      setName("");
      setLocation("");
      setTotalSeats("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error creating theater ❌");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Add Theater</h2>
      
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Theater Name</label>
            <input
              type="text"
              placeholder="Enter theater name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Total Seats</label>
            <input
              type="number"
              placeholder="Enter total capacity"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              required
            />
          </div>
          
          <div className="md:col-span-3 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:-translate-y-0.5"
            >
              Create Theater
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTheater;
