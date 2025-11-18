import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import { dummyDashboardData } from "../../assets/assets";
import Title from "./Title";

// Dummy date format utility
const dateFormat = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

export default function Dashbord() {
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });

  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings || "0",
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: `${currency} ${dashboardData.totalRevenue || "0"}`,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows.length || "0",
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser || "0",
      icon: UsersIcon,
    },
  ];

  const fetchDashboardData = async () => {
    // Simulate API call with dummy data
    setDashboardData(dummyDashboardData);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="flex h-screen overflow-auto">
      <AdminSidebar />
      <div className=" pt-4 pr-5  ml-[15%]  w-full">
        {!loading ? (
          <>
            <Title text1="Admin" text2="Dashboard" />

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {dashboardCards.map((card, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-primary/10 border border-primary/20 p-4 hover:-translate-y-1 transition duration-300"
                >
                  <card.icon className="w-6 h-6 text-primary mb-2" />
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              ))}
            </div>

            {/* Active Shows Section */}
            <h2 className="text-xl font-semibold mt-8 mb-4">Active Shows</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dashboardData.activeShows.map((show) => (
                <div
                  key={show._id}
                  className="rounded-lg bg-white shadow-md overflow-hidden transition transform hover:-translate-y-1"
                >
                  <img
                    src={show.movie.poster_path}
                    alt={show.movie.title}
                    className="h-60 w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="truncate font-medium">{show.movie.title}</p>
                    <p className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                      <StarIcon className="w-4 h-4 text-primary fill-primary" />
                      {show.movie.vote_average.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {dateFormat(show.showDateTime)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center mt-10 text-gray-500">Loading...</div>
        )}
      </div>
    </div>
  );
}
