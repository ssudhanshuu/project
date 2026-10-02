import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../component/HeroSection';
import NowPlayingMovies from '../component/NowPlayingMovies';

export default function Movies() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <HeroSection />
      <NowPlayingMovies />
    </>
  );
}
