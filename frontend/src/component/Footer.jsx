import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

function Footer() {
  return (
   <footer className="w-full  bottom-0 bg-black/80 text-white py-10">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 text-center md:text-left">

   
    <div>
      <h1 className="text-lg font-bold mb-2">Company</h1>
      <div className="flex flex-col gap-2">
        <Link to="/">Home</Link>
        <Link to="/">About Us</Link>
        <Link to="/contactus">Contact Us</Link>
        <Link to="/">Privacy Policy</Link>
      </div>
    </div>

  
    <div className="flex flex-col items-center md:items-start">
      <h1 className="text-lg font-bold mb-2">THEATRE BUDDY</h1>
      <p className="text-sm text-center md:text-left">
        Over 10,000+ users love our service!<br />
        Book your next movie hassle-free with Theatre Buddy 🎬
      </p>
      <div className="flex justify-center md:justify-start gap-4 mt-4">
        <img className="w-32" src={assets.appStore} alt="App Store" />
        <img className="w-32" src={assets.googlePlay} alt="Google Play" />
      </div>
    </div>

    
    <div>
      <h1 className="text-lg font-bold mb-2">Get in Touch</h1>
      <p className="">
        📧 <a href="mailto:theatrebuddy@gmail.com" className="hover:underline">theatrebuddy@gmail.com</a>
      </p>
      <p className="">
        📞 <a href="tel:+918191087255" className="hover:underline">+91 81910 87255</a>
      </p>
    </div>

  </div>
</footer>

  );
}

export default Footer;
