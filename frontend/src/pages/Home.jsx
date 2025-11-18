import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import HeroSection from '../component/HeroSection';
import FeaturedSection from '../component/FeaturedSection';
import Footer from '../component/Footer';
import TrailersSection from '../component/TrailersSection';
import Explore from '../component/Explore';

function Home() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <HeroSection />
      <Explore />
      <FeaturedSection />
      <TrailersSection />
      <Footer />
    </>
  );
}

export default Home;
