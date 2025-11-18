import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import MovieCard from './MovieCard';

export default function FeaturedSection() {
    const navigate = useNavigate();

    const handleShowMore = () => {
        navigate('/movies');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="px-6  md:px-16 lg:px-24 lx:px-44 overflow-hidden">
            <div className="relative pl-10 flex items-center justify-between pt-10 pb-10">
                <p className="text-gray-300 font-medium text-2xl">Now Showing</p>
                <button
                    onClick={() => {
                        navigate('/movies');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group flex pr-10  pl-50 items-center gap-2 text-lg text-gray-300"
                >
                    View All
                    <ArrowRight className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" />
                </button>
            </div>

           < MovieCard/>


            <div className="flex justify-center mt-10">
                <button
                    onClick={handleShowMore}
                    className="px-10 mb-10 py-3 text-lg bg-amber-600 hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
                >
                    Show more
                </button>
            </div>
        </div>
    );
}
