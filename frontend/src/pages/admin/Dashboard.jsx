import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  UsersIcon,
  StarIcon,
} from "lucide-react";
import Title from "./Title";
import { useAuth } from "@clerk/clerk-react";

import ForMissingImage from "/ForMissingImage.png";

const formatDateTime = (iso) => {
  if (!iso) return "N/A";
  const d = new Date(iso);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();
  const currency = "₹";

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getToken();
        if (!token) {
          setError("No auth token found. Please login again.");
          return;
        }
        console.log("Token:", token);


        const res = await axios.get(`${API_URL}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [getToken]); // getToken from Clerk is stable

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 text-center text-red-500">
        {error}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Bookings",
      value: data.totalBookings ?? 0,
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: `${currency}${data.totalRevenue ?? 0}`,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Active Shows",
      value: data.activeShows ?? 0,
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: data.totalUsers ?? 0,
      icon: UsersIcon,
    },
  ];

  return (
    <div className="flex min-h-screen mt-15 bg-black text-white">
      <aside className="w-[12%] min-w-[200px] bg-white text-black">
      
      </aside>
      <main className="flex-1 p-10">
        <Title text1="Admin" text2="Dashboard" />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
          {cards.map(({ title, value, icon: Icon }, i) => (
            <div
              key={i}
              className="p-4 bg-primary/10 border border-primary/20 rounded-lg hover:shadow-lg transition"
            >
              <Icon className="w-6 h-6 text-primary mb-2" />
              <h3 className="text-lg font-semibold">{title}</h3>
              <div className="text-2xl font-bold">{value}</div>
            </div>
          ))}
        </div>

        {/* Recently Active Shows */}
        <h2 className="text-xl font-semibold mb-4">Recently Active Shows</h2>
        {Array.isArray(data?.activeShow) && data.activeShow.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.activeShow.map((show) => {
              const movie = show.movie || {};
              const imgUrl =
                movie.bannerUrl ||
                movie?.poster_Path ||
                movie.backdrop_Path ||
                ForMissingImage;

              return (
                <div
                  key={show._id}
                  className="bg-white text-black rounded-lg overflow-hidden shadow hover:-translate-y-1 transition"
                >
                  <img
                    src={imgUrl}
                    alt={movie.title || "Movie poster"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="font-medium truncate">
                      {movie.title || "Untitled"}
                    </p>
                    <p className="flex items-center text-sm text-gray-600 mt-1">
                      <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                      {movie.vote_average?.toFixed(1) || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatDateTime(show.date)}{" "}
                      {Array.isArray(show.timeSlots) &&
                        show.timeSlots.length > 0 &&
                        `@ ${show.timeSlots.join(", ")}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400">No active shows available.</p>
        )}
      </main>
    </div>
  );
}