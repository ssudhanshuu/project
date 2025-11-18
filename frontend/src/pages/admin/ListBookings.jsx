import { useEffect, useState } from "react";
import axios from "axios";
import Title from "./Title";

export default function ListBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/bookings/my`);
        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="flex mt-20 flex-row min-h-screen">
      <div className="w-[12%] min-w-[200px] bg-white shadow-md"></div>

      <div className="w-[100%] p-10 bg-black text-white">
        <Title text1="Admin" text2="All Bookings" />

        {loading && <p className="text-blue-500 mt-6">Loading bookings...</p>}
        {error && <p className="text-red-500 mt-6">Error: {error}</p>}

        {!loading && !error && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b text-left">#</th>
                  <th className="px-4 py-2 border-b text-left">User</th>
                  <th className="px-4 py-2 border-b text-left">Movie</th>
                  <th className="px-4 py-2 border-b text-left">Show Time</th>
                  <th className="px-4 py-2 border-b text-left">Seats</th>
                  <th className="px-4 py-2 border-b text-left">Total</th>
                  <th className="px-4 py-2 border-b text-left">Booked At</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-black">
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
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b text-black">{i + 1}</td>
                        <td className="px-4 py-2 border-b text-black">{user}</td>
                        <td className="px-4 py-2 border-b text-black">{movie}</td>
                        <td className="px-4 py-2 border-b text-black">{`${showDate} @ ${slots}`}</td>
                        <td className="px-4 py-2 border-b text-black">{seats}</td>
                        <td className="px-4 py-2 border-b text-black">₹{amount}</td>
                        <td className="px-4 py-2 border-b text-black">{bookedAt}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
