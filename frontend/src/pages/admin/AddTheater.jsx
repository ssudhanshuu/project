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
    <div className="p-6 bg-gray-600 ml-50">
      <h2 className="text-xl mt-20 font-bold mb-4">Add Theater</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-600">
        <input
          type="text"
          placeholder="Theater Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Total Seats"
          value={totalSeats}
          onChange={(e) => setTotalSeats(e.target.value)}
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Theater
        </button>
      </form>
    </div>
  );
}

export default AddTheater;
