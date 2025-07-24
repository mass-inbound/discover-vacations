import {FaLocationDot} from 'react-icons/fa6';

export default function VacationProcess() {
  return (
    <div className="relative py-8 px-4 md:py-14 md:px-8">
      <div className="relative z-8 max-w-5xl mx-auto text-center">
        {/* Tree Icon BG behind heading */}
        <img
          src="/assets/treebgIcon.png"
          alt="Tree Icon"
          className="hidden md:block absolute left-[90px] top-[30px] w-[145px] h-auto opacity-80 -z-10 pointer-events-none"
        />
        <img
          src="/assets/treebgIcon.png"
          alt="Tree Icon"
          className="block md:hidden absolute left-1 top-[18px] w-[145px] h-auto opacity-80 -z-10 pointer-events-none"
        />
        <p className="text-[16px] font-[500] text-[#208989]">
          Plan Less. Enjoy More.
        </p>
        <h2 className="text-3xl md:text-[47px] font-[500] text-[#0E424E] my-5 relative">
          Vacation Booking, Simplified
        </h2>
        <p className="text-[#1A202C] mb-[3.5rem] max-w-2xl mx-auto font-[400] text-[25px]">
          Exclusive offers. Real value. Tailor your travel and room options to
          fit your travel plans — without overcomplicating the process.
        </p>
        <div className="flex flex-col md:flex-row items-start justify-center relative">
          {/* Curly line connecting icons */}
          {/* Columns */}
          <div className="relative flex flex-col items-center bg-transparent min-w-[250px]">
            <div className="w-[106px] h-[106px] bg-[#DFF4F4] rounded-[30px] flex items-center justify-center shadow-lg">
              <FaLocationDot size={40} fill="#135868" />
            </div>
            <h3 className="font-[500] text-[27px] my-5 text-[#135868]">
              Discover Your Next Vacation
            </h3>
            <p className="text-[#151515] text-[20px] font-[500] opacity-90 text-center font-avenir leading-7">
              Browse your exclusive offer and add it to your cart - real value,
              no hidden fees.
            </p>
          </div>
          {/* After first card: horizontal for desktop, vertical for mobile */}
          <img
            src="/assets/curlyLine.png"
            alt="Curly Line"
            className="hidden md:block mt-8"
          />
          {/* Mobile vertical curly line after first card */}
          <img
            src="/assets/curlyLine-vertical.png"
            alt="Curly Line"
            className="block md:hidden my-6 h-16 w-auto mx-auto pb-4"
          />
          <div className="relative flex flex-col items-center bg-transparent min-w-[250px]">
            <div className="w-[106px] h-[106px] bg-[#DFF4F4] rounded-[30px] flex items-center justify-center shadow-lg">
              <img
                src="/assets/calendarIcon.svg"
                alt="Calendar"
                className="w-10 h-10"
              />
            </div>
            <h3 className="font-[500] text-[27px] my-5 text-[#135868]">
              Pick a Date
            </h3>
            <p className="text-[#151515] text-[20px] font-avenir font-[500] opacity-90 text-center leading-7">
              Know your dates? Select them on the calendar before checkout. Not
              ready yet? No problem — plan your trip in your Travel Hub after
              checkout.
            </p>
          </div>
          {/* After second card: horizontal for desktop, vertical for mobile */}
          <img
            src="/assets/curlyLine.png"
            alt="Curly Line"
            className="hidden md:block mt-8"
          />
          {/* Mobile vertical curly line after second card */}
          <img
            src="/assets/curlyLine-vertical.png"
            alt="Curly Line"
            className="block md:hidden my-6 h-16 w-auto mx-auto pb-4"
          />
          <div className="relative flex flex-col items-center bg-transparent min-w-[250px]">
            <div className="w-[106px] h-[106px] bg-[#DFF4F4] rounded-[30px] flex items-center justify-center shadow-lg">
              <img
                src="/assets/parmTreeIcon.svg"
                alt="Palm Tree"
                className="w-10 h-10"
              />
            </div>
            <h3 className="font-[500] text-[27px] my-5 text-[#135868]">
              Book Your Getaway
            </h3>
            <p className="text-[#151515] text-[20px] font-[500] opacity-90 text-center font-avenir leading-7">
              Complete your purchase and get instant access to your personal
              Travel Hub, where reserving your trip is quick, easy, and secure.
            </p>
          </div>
        </div>
      </div>
      {/* Wave Pattern below the last card */}
      <img
        src="/assets/wavePattern.png"
        alt="Wave Pattern"
        className="md:block hidden absolute right-0 -bottom-8 w-48 md:w-[186px] opacity-50 pointer-events-none"
      />
    </div>
  );
}
