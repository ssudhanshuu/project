import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import HeroSection from '../component/HeroSection';
import TrailersSection from '../component/TrailersSection';
import Explore from '../component/Explore';
import UpcomingMoviesSection from '../component/UpcomingMoviesSection';

function Home() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <HeroSection />
      <Explore />
      <UpcomingMoviesSection />
      <TrailersSection />
    </>
  );
}

export default Home;
