import { ArrowRight, CalculatorIcon } from "lucide-react";
import { assets } from "../assets/assets"; // ✅ Only import 'assets'
import React from "react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <>
      <div
        className='flex flex-col 
                hero
                bg-[url("/backgroundImage.jpg")] 
                h-160
                w-full
                px-6 md:px-16 
                text-white 
                bg-cover
               bg-center bg-no-repeat
                z-20'
      >
        <span className="flex mt-25 gap-6">
          {" "}
          {/* Main Heading */}
          <h1 className="text-4xl  font-bold drop-shadow-md">
            Get your ticket online — enjoy more, worry less!
          </h1>
        </span>

        {/* Genre */}
        <div className="flex items-center text-2xl  gap-4 text-indigo-300 mb-2">
          <span>Action | Adventure | Sci-fi | Comady</span>
        </div>

        {/* Year */}

        {/* <button
                    onClick={() => navigate('/movies')}
                    className="flex items-center gap-1 px-6 py-3  mt-2 mb-3 text-center
                      text-sm bg-primary hover:bg-primary-dull transition 
                       rounded-full font-medium cursor-pointer bg-amber-800 w-[40%]"
                >
                    Explore Movies
                    <ArrowRight  className="w-5 h-5" />
                </button> */}
      </div>
    </>
  );
}
