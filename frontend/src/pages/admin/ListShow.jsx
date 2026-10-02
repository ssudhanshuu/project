import { useEffect, useState } from "react";
import Title from "./Title";
import axios from "axios";
import { API_URL } from "../../../lib/apiConfig";

export default function ListShow() {
  const [shows, setShows] = useState([]);
  const [loadingShow, setLoadingShow] = useState(true);
  const [errorShow, setErrorShow] = useState(null);
  // API_URL imported from apiConfig

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/shows`);
        const data = response.data;
        const showsArray = Array.isArray(data) ? data : (Array.isArray(data.shows) ? data.shows : []);
        setShows(showsArray);
      } catch (error) {
        setErrorShow(error.response?.data?.message || "Failed to fetch shows");
      } finally {
        setLoadingShow(false);
      }
    };
    fetchShows();
  }, []);

  return (
    <div className="p-10">
        <Title text1="" text2="All shows" />

        {loadingShow ? (
          <div className="text-center text-gray-300 mt-10">Loading shows...</div>
        ) : errorShow ? (
          <div className="text-center text-red-400 mt-10">{errorShow}</div>
        ) : (
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg shadow">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="text-left px-4 py-2 border-b border-gray-700">Movie</th>
                <th className="text-left px-4 py-2 border-b border-gray-700">Date</th>
                <th className="text-left px-4 py-2 border-b border-gray-700">Time Slots</th>
                <th className="text-left px-4 py-2 border-b border-gray-700">Price</th>
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
                  <tr key={show._id} className="hover:bg-gray-700">
                    <td className="px-4 py-2 border-b border-gray-700">{show.movie?.title || "N/A"}</td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      {new Date(show.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      <ul className="space-y-1">
                        {show.timeSlots.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">₹{show.price}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
    </div>
  );
}
