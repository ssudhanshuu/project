import React from 'react';
import HeroSection from '../component/HeroSection';
import MovieDetails from './MovieDetails';
import Explore from '../component/Explore';
import Footer from '../component/Footer';
import FeaturedSection2 from '../component/FeaturedSection2';

export default function Movies() {
  return (
    <>
      <HeroSection />
      <FeaturedSection2 />
      <MovieDetails />
      <Footer />
    </>
  );
}
