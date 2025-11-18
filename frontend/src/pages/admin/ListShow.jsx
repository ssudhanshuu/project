import { useEffect, useState } from "react";
import Title from "./Title";
import axios from "axios";

export default function ListShow() {
  const [shows, setShows] = useState([]);
  const [loadingShow, setLoadingShow] = useState(true);
  const [errorShow, setErrorShow] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "https://project-1-ahno.onrender.com";

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/shows`);
        setShows(response.data);
      } catch (error) {
        setErrorShow(error.response?.data?.message || "Failed to fetch shows");
      } finally {
        setLoadingShow(false);
      }
    };
    fetchShows();
  }, []);

  return (
    <div className="flex mt-20 min-h-screen">
      {/* Sidebar */}
      <div className="w-[12%] min-w-[200px] bg-white shadow-md"></div>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-black text-white">
        <Title text1="" text2="All shows" />

        {loadingShow ? (
          <div className="text-center text-gray-300 mt-10">Loading shows...</div>
        ) : errorShow ? (
          <div className="text-center text-red-400 mt-10">{errorShow}</div>
        ) : (
          <table className="min-w-full bg-gray-700 border border-gray-500 rounded-lg shadow">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left px-4 py-2 border-b">Movie</th>
                <th className="text-left px-4 py-2 border-b">Date</th>
                <th className="text-left px-4 py-2 border-b">Time Slots</th>
                <th className="text-left px-4 py-2 border-b">Price</th>
              </tr>
            </thead>
            <tbody>
              {shows.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-300">
                    No shows found.
                  </td>
                </tr>
              ) : (
                shows.map((show) => (
                  <tr key={show._id} className="hover:bg-gray-600">
                    <td className="px-4 py-2 border-b">{show.movie?.title || "N/A"}</td>
                    <td className="px-4 py-2 border-b">
                      {new Date(show.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <ul className="space-y-1">
                        {show.timeSlots.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2 border-b">₹{show.price}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
