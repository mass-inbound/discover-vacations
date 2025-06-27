import React, {useState} from 'react';
import {FaLocationDot} from 'react-icons/fa6';
import SectionHeroBanner from './SectionHeroBanner';

export default function HowItWorks() {
  return (
    <>
      <SectionHeroBanner
        tagline="Vacation booking made simple"
        title="How it works"
        description="Choose your destination, select your offer, and pick your travel dates, it’s that easy. We’ve streamlined the entire booking process so you can focus on getting excited for your trip, not figuring out how to plan it."
        image="/assets/beach1.png"
      />
      <div className="py-14 px-8">
        <div className="relative z-8 max-w-5xl mx-auto text-center">
          <p className="text-[16px] font-[500] text-[#208989]">
            Plan Less. Enjoy More.
          </p>
          <h2 className="text-3xl md:text-[47px] font-[500] text-[#0E424E] my-5">
            Vacation Booking, Simplified
          </h2>
          <p className="text-[#1A202C] mb-[3.5rem] max-w-2xl mx-auto font-[400] text-[20px]">
            We combine curated offers with flexible trip customization so every
            detail fits your time, budget, and group size.
          </p>
          <div className="flex flex-col md:flex-row items-start justify-center relative">
            {/* Curly line connecting icons */}
            {/* Columns */}
            <div className="relative flex flex-col items-center bg-transparent min-w-[250px]">
              <div className="w-[106px] h-[106px] bg-[#DFF4F4] rounded-[30px] flex items-center justify-center shadow-lg">
                <FaLocationDot size={40} fill="#135868" />
              </div>
              <h3 className="font-semibold text-[24px] my-3 text-[#135868]">
                Choose Location
              </h3>
              <p className="text-[#151515] text-[14px] font-[400]">
                Choose a day trip based on your location and interests.
              </p>
            </div>
            <img
              src="/assets/curlyLine.png"
              alt="Curly Line"
              className="hidden md:block mt-5"
            />
            <div className="relative flex flex-col items-center bg-transparent min-w-[250px]">
              <div className="w-[106px] h-[106px] bg-[#DFF4F4] rounded-[30px] flex items-center justify-center shadow-lg">
                <img
                  src="/assets/calendarIcon.svg"
                  alt="Calendar"
                  className="w-10 h-10"
                />
              </div>
              <h3 className="font-semibold text-[24px] my-3 text-[#135868]">
                Pick-up Date
              </h3>
              <p className="text-[#151515] text-[14px] font-[400]">
                Adjust your schedule—departure dates and trip duration are all
                customizable.
              </p>
            </div>
            <img
              src="/assets/curlyLine.png"
              alt="Curly Line"
              className="hidden md:block mt-5"
            />
            <div className="relative flex flex-col items-center bg-transparent min-w-[250px]">
              <div className="w-[106px] h-[106px] bg-[#DFF4F4] rounded-[30px] flex items-center justify-center shadow-lg">
                <img
                  src="/assets/parmTreeIcon.svg"
                  alt="Palm Tree"
                  className="w-10 h-10"
                />
              </div>
              <h3 className="font-semibold text-[24px] my-3 text-[#135868]">
                Book your vacation
              </h3>
              <p className="text-[#151515] text-[14px] font-[400]">
                Enjoy a streamlined booking process and dedicated support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
