import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

export default function Explore() {
       const navigate = useNavigate();
  return (
   <>
    <div className="flex justify-center  bg-cyan-950 ">
  <button
    onClick={() => navigate('/movies')}
    className="flex items-center gap-1 px-6 py-3
               text-lg  hover:bg-cyan-800
               transition font-medium rounded-full
               cursor-pointer"
  >
    Explore Movies
    <ArrowRight className="w-5 h-5" />
  </button>
</div>

          
          </>
  )
}
