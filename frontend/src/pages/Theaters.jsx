import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Theaters() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/theaters`);
        setTheaters(res.data);
      } catch (error) {
        console.error("Error fetching theaters:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTheaters();
  }, []);

  const handleViewShows = (theaterId) => {
    navigate(`/theaters/shows`); 
  };

  
  const filteredTheaters = theaters.filter((theater) => {
    const name = theater.name || theater.theaterName || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="text-center py-10">Loading theaters...</div>;
  }

  return (
    <div className="max-w-5xl mt-20 mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Theaters</h1>

    
      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Search theaters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {filteredTheaters.length === 0 ? (
        <p className="text-center">No theaters found.</p>
      ) : (
        <div className="grid mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTheaters.map((theater) => (
            <div
              key={theater._id}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">
                {theater.name || theater.theaterName}
              </h2>
              <p className="text-gray-600">{theater.location}</p>
              <p className="mt-2 text-sm text-gray-500">
                Total Seats: {theater.totalSeats}
              </p>

             
              <button
                onClick={() => handleViewShows(theater._id)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                View Shows
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Theaters;
