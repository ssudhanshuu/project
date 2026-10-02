import { useEffect, useState } from "react";
import axios from "axios";
import Title from "./Title";
import { API_URL } from "../../../lib/apiConfig";

export default function ListBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API_URL imported from apiConfig

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/bookings/my`);
        const data = response.data;
        const bookingsArray = Array.isArray(data) ? data : (Array.isArray(data.bookings) ? data.bookings : []);
        setBookings(bookingsArray);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="p-10">
        <Title text1="Admin" text2="All Bookings" />

        {loading && <p className="text-blue-400 mt-6">Loading bookings...</p>}
        {error && <p className="text-red-400 mt-6">Error: {error}</p>}

        {!loading && !error && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg shadow">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-2 border-b border-gray-700 text-left">#</th>
                  <th className="px-4 py-2 border-b border-gray-700 text-left">User</th>
                  <th className="px-4 py-2 border-b border-gray-700 text-left">Movie</th>
                  <th className="px-4 py-2 border-b border-gray-700 text-left">Show Time</th>
                  <th className="px-4 py-2 border-b border-gray-700 text-left">Seats</th>
                  <th className="px-4 py-2 border-b border-gray-700 text-left">Total</th>
                  <th className="px-4 py-2 border-b border-gray-700 text-left">Booked At</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-400">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking, i) => {
                    const user = booking.userName || "N/A";
                    const movie = booking.movie?.title || "N/A";
                    const showDate = booking.show?.date
                      ? new Date(booking.show.date).toLocaleDateString()
                      : "N/A";
                    const slots = Array.isArray(booking.show?.timeSlots)
                      ? booking.show.timeSlots.join(", ")
                      : "N/A";
                    const seats = Array.isArray(booking.seats)
                      ? booking.seats.join(", ")
                      : "N/A";
                    const amount = booking.amount ?? 0;
                    const bookedAt = booking.bookingTime
                      ? new Date(booking.bookingTime).toLocaleString()
                      : "N/A";

                    return (
                      <tr key={booking._id} className="hover:bg-gray-700">
                        <td className="px-4 py-2 border-b border-gray-700">{i + 1}</td>
                        <td className="px-4 py-2 border-b border-gray-700">{user}</td>
                        <td className="px-4 py-2 border-b border-gray-700">{movie}</td>
                        <td className="px-4 py-2 border-b border-gray-700">{`${showDate} @ ${slots}`}</td>
                        <td className="px-4 py-2 border-b border-gray-700">{seats}</td>
                        <td className="px-4 py-2 border-b border-gray-700">₹{amount}</td>
                        <td className="px-4 py-2 border-b border-gray-700">{bookedAt}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
