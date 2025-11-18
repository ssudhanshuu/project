import logo from './logo.svg';
import marvelLogo from './marvelLogo.svg';
import googlePlay from './googlePlay.svg';
import appStore from './appStore.svg';
import screenImage from './screenImage.svg';
import profile from './profile.png';

export const assets = {
  logo,
  marvelLogo,
  googlePlay,
  appStore,
  screenImage,
  profile
};

export const dummyTrailers = [
  {
    image: "https://img.youtube.com/vi/WpW36ldAqnM/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=WpW36ldAqnM",
  },
  {
    image: "https://img.youtube.com/vi/-sAOWhvheK8/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=-sAOWhvheK8",
  },
  {
    image: "https://img.youtube.com/vi/1pHDWnXmK7Y/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=1pHDWnXmK7Y",
  },
  {
    image: "https://img.youtube.com/vi/umiKiW4En9g/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=umiKiW4En9g",
  },
];

const dummyCastsData = [
  { name: "Milla Jovovich", profile_path: "https://image.tmdb.org/t/p/original/usWnHCzbADijULREZYSJ0qfM00y.jpg" },
  { name: "Dave Bautista", profile_path: "https://image.tmdb.org/t/p/original/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg" },
  { name: "Arly Jover", profile_path: "https://image.tmdb.org/t/p/original/zmznPrQ9GSZwcOIUT0c3GyETwrP.jpg" },
  { name: "Amara Okereke", profile_path: "https://image.tmdb.org/t/p/original/nTSPtzWu6deZTJtWXHUpACVznY4.jpg" },
  { name: "Fraser James", profile_path: "https://image.tmdb.org/t/p/original/mGAPQG2OKTgdKFkp9YpvCSqcbgY.jpg" },
  { name: "Deirdre Mullins", profile_path: "https://image.tmdb.org/t/p/original/lJm89neuiVlYISEqNpGZA5kTAnP.jpg" },
  { name: "Sebastian Stankiewicz", profile_path: "https://image.tmdb.org/t/p/original/hLN0Ca09KwQOFLZLPIEzgTIbqqg.jpg" },
  { name: "Tue Lunding", profile_path: "https://image.tmdb.org/t/p/original/qY4W0zfGBYzlCyCC0QDJS1Muoa0.jpg" },
  { name: "Jacek Dzisiewicz", profile_path: "https://image.tmdb.org/t/p/original/6Ksb8ANhhoWWGnlM6O1qrySd7e1.jpg" },
  { name: "Ian Hanmore", profile_path: "https://image.tmdb.org/t/p/original/yhI4MK5atavKBD9wiJtaO1say1p.jpg" },
  { name: "Eveline Hall", profile_path: "https://image.tmdb.org/t/p/original/uPq4xUPiJIMW5rXF9AT0GrRqgJY.jpg" },
  { name: "Kamila Klamut", profile_path: "https://image.tmdb.org/t/p/original/usWnHCzbADijULREZYSJ0qfM00y.jpg" },
  { name: "Caoilinn Springall", profile_path: "https://image.tmdb.org/t/p/original/uZNtbPHowlBYo74U1qlTaRlrdiY.jpg" },
  { name: "Jan Kowalewski", profile_path: "https://image.tmdb.org/t/p/original/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg" },
  { name: "Pawel Wysocki", profile_path: "https://image.tmdb.org/t/p/original/zmznPrQ9GSZwcOIUT0c3GyETwrP.jpg" },
  { name: "Simon Lööf", profile_path: "https://image.tmdb.org/t/p/original/cbZrB8crWlLEDjVUoak8Liak6s.jpg" },
  { name: "Tomasz Cymerman", profile_path: "https://image.tmdb.org/t/p/original/nTSPtzWu6deZTJtWXHUpACVznY4.jpg" },
];

export const dummyShowsData = [
  {
    _id: "324544",
    id: 324544,
    title: "In the Lost Lands",
    overview: "A queen sends the powerful and feared sorceress Gray Alys to the ghostly wilderness...",
    poster_path: "https://image.tmdb.org/t/p/original/dDlfjR7gllmr8HTeN6rfrYhTdwX.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/op3qmNhvwEvyT7UFyPbIfQmKriB.jpg",
    genres: [{ id: 28, name: "Action" }, { id: 14, name: "Fantasy" }, { id: 12, name: "Adventure" }],
    casts: dummyCastsData,
    release_date: "2025-02-27",
    original_language: "en",
    tagline: "She seeks the power to free her people.",
    vote_average: 6.4,
    vote_count: 15000,
    runtime: 102,
  },
  // Add other movie objects here...
];

export const dummyDateTimeData = {
  "2025-07-24": [
    { time: "2025-07-24T01:00:00.000Z", showId: "68395b407f6329be2bb45bd1" },
    { time: "2025-07-24T03:00:00.000Z", showId: "68395b407f6329be2bb45bd2" },
    { time: "2025-07-24T05:00:00.000Z", showId: "68395b407f6329be2bb45bd3" },
  ],
  // More dates...
};

export const dummyDashboardData = {
  totalBookings: 14,
  totalRevenue: 1517,
  totalUser: 5,
  activeShows: [
    {
      _id: "68352363e96d99513e4221a4",
      movie: dummyShowsData[0],
      showDateTime: "2025-06-30T02:30:00.000Z",
      showPrice: 59,
      occupiedSeats: { A1: "user_2xO4XPCgWWwWq9EHuQxc5UWqIok" },
    },
    // More activeShows...
  ],
};

export const dummyBookingData = [
  {
    _id: "68396334fb83252d82e17295",
    user: { name: "GreatStack" },
    show: {
      _id: "68352363e96d99513e4221a4",
      movie: dummyShowsData[0],
      showDateTime: "2025-06-30T02:30:00.000Z",
      showPrice: 59,
    },
    amount: 98,
    bookedSeats: ["D1", "D2"],
    isPaid: false,
  },
  // More booking objects...
];
