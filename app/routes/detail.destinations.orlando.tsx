import {useState} from 'react';
import {BiCart} from 'react-icons/bi';
import {FaCheck, FaGift} from 'react-icons/fa';
import {FaLocationDot} from 'react-icons/fa6';
import {HiOutlineChevronLeft, HiOutlineChevronRight} from 'react-icons/hi';
import {IoDiamond} from 'react-icons/io5';

export default function DetailsOrlandoView() {
  const slides = [
    {src: '/assets/carouselImage1.jpg', alt: 'Laptop Screenshot 1'},
    {src: '/assets/carouselImage2.jpg', alt: 'Laptop Screenshot 2'},
    {src: '/assets/peaceMindImg.jpg', alt: 'Laptop Screenshot 3'},
  ];

  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  return (
    <div className="mx-auto mt-20">
      <div className="grid grid-cols-[1.5fr_1fr] min-h-[528px] max-w-7xl mx-auto">
        <div className="h-full">
          <img src="/assets/DestinationImage.png" alt="" className="h-full" />
        </div>
        <div className="bg-[#F5F5F5] p-8">
          <h1 className="uppercase font-[800] text-[24px]">
            Magical Orlando Getaway
          </h1>
          <p className="font-[400] text-[20px] text-[#070707] opacity-70">
            Orlando, FL
          </p>

          <div className="bg-white rounded-[10px] my-4 p-3 flex flex-col items-center">
            <span className="text-[#0E424E] font-[400] text-[13px]">
              3 night/4 days
            </span>
            <div className="flex items-center justify-center gap-1">
              <span className="text-[#135868] font-[500] text-[27px]">$49</span>
              <span className="text-[#135868] font-[500] text-[12px]">
                per <br /> couple
              </span>
            </div>
            <span className="text-[#0E424E] font-[400] text-[13px]">
              not included taxes + fees
            </span>
          </div>
          <ul className="text-sm text-[#000] my-4 list-disc list-inside space-y-2">
            <li className="flex gap-2 items-center">
              <FaCheck className="text-[#113B3F]" />{' '}
              <span className="text-[#113B3F] font-[400] text-[16px]">
                3 nights hotel accommodations for two adults
              </span>
            </li>
            <li className="flex gap-2 items-center">
              <FaCheck className="text-[#113B3F]" />{' '}
              <span className="text-[#113B3F] font-[400] text-[16px]">
                Enjoy Exclusive Perks During Your Stay
              </span>
            </li>
          </ul>
          <div className="max-w-[80%] bg-[#F2B233] rounded-[8px] px-3 py-1 flex gap-2 items-center justify-center">
            <FaGift className="text-white" />
            <span className="text-[16px] font-[400] text-white">
              Includes a Gift: Your Next Vacation, On Us
            </span>
          </div>
          <p className="underline my-8 cursor-pointer">Need Help? Contact Us</p>
          <button className="bg-[#2AB7B7] rounded flex gap-2 items-center justify-center text-white px-4 py-2 hover:bg-[#229a9a]">
            <BiCart size={25} />
            <span className="text-[16px] font-[600]">Save My Deal Now</span>
          </button>
        </div>
      </div>

      {/* tab section  */}
      <div className="my-8 mx-auto max-w-7xl">
        <Tabs />
      </div>

      {/* Vacation Booking curly line  */}
      <section className="relative py-20 bg-white ">
        {/* Decorative tree icon */}
        <img
          src="/assets/treebgIcon.png"
          alt="Tree"
          className="absolute left-1/4 top-1/10 w-40 opacity-60 pointer-events-none select-none"
        />
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
      </section>

      {/* carousel  */}
      <section className="relative bg-[#EAF8F8] py-[7rem]">
        <div
          className="relative w-full mx-auto overflow-hidden rounded-lg"
          style={{maxHeight: 360}}
        >
          {/* Slides */}
          <div
            className="flex transition-transform duration-500 gap-8"
            style={{transform: `translateX(-${current * 100}%)`}}
          >
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className="min-w-full md:min-w-1/2 flex-shrink-0 flex items-center justify-center"
                style={{height: 360}}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="object-cover w-full h-full rounded-lg"
                  style={{maxHeight: 360, maxWidth: 640}}
                />
              </div>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow focus:outline-none z-10"
          >
            <HiOutlineChevronLeft size={24} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow focus:outline-none z-10"
          >
            <HiOutlineChevronRight size={24} />
          </button>
        </div>
        {/* Indicator Dots */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-8">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full focus:outline-none transition-opacity duration-300 ${current === idx ? 'bg-[#2AB7B7] opacity-100' : 'bg-gray-300 opacity-50'}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function Tabs() {
  const [active, setActive] = useState(0);
  const tabs = [
    'Overview',
    `What's Included`,
    'Nearby Attractions',
    'Travel Notes',
    'Gift Details',
  ];

  // Define the content for each tab
  const tabContents = [
    <div className="bg-gray-100 p-8 text-center flex flex-col gap-4 rounded">
      <h1 className="text-[#0E424E] font-[500] text-[36px]">
        🌾 Magical Orlando Getaway – 4 Days / 3 Nights
      </h1>
      <p className="text-[#0E424E] text-[20px] font-[400] max-w-[80%] mx-auto">
        Experience the MAGIC of Orlando with a 4 Days / 3 Nights stay for two
        adults — and receive a Bonus Vacation Gift to enjoy even more travel
        adventures in the future!
      </p>
    </div>,
    <div className="bg-gray-100 p-8 text-center flex flex-col gap-4 rounded">
      <h2 className="text-[#0E424E] font-[500] text-[36px]">What's Included</h2>
      <ul className="list-disc list-inside text-[#0E424E] text-[20px] font-[400]">
        <li>3 nights hotel accommodations for two adults</li>
        <li>Exclusive perks during your stay</li>
        <li>Bonus vacation gift</li>
      </ul>
    </div>,
    <div className="bg-gray-100 p-8 text-center flex flex-col gap-4 rounded">
      <h2 className="text-[#0E424E] font-[500] text-[36px]">
        Nearby Attractions
      </h2>
      <ul className="columns-2 list-disc list-inside text-[#0E424E] text-[20px] font-[400]">
        <li>Universal Studios</li>
        <li>Walt Disney World</li>
        <li>Volcano Bay</li>
      </ul>
    </div>,
    <div className="bg-gray-100 p-8 text-center flex flex-col gap-4 rounded">
      <h1 className="text-[#0E424E] font-[500] text-[36px]">Travel Notes</h1>
      <p className="text-[#0E424E] text-[20px] font-[400] max-w-[80%] mx-auto">
        *Travel for the Orlando getaway must be completed within 12 months of
        purchase. Bonus travel must be registered within 6 months of issue and
        completed within 18 months. Government taxes, fees, upgrades, and resort
        charges vary by destination and selection. Travelers are responsible for
        government taxes, resort fees, and optional upgrades
      </p>
    </div>,
    <div className="grid grid-cols-1 sm:grid-cols-3">
      <div className="rounded-[10px]">
        <div className="bg-[#F2B233] py-1 text-white font-[500] text-[21px] flex justify-center items-center gap-3 rounded-t-[10px]">
          <span>
            <FaGift />
          </span>
          <span>Choice A</span>
        </div>
        <div className="bg-gray-100 flex items-center justify-center p-5 rounded-b-[10px] min-h-[280px]">
          <p className="font-[400] text-[20px] text-[#0E424E] text-center px-6">
            4,5 or 7- Night Cruise aboard Carnival, NCL or Royal Caribbean for
            two adults.
          </p>
        </div>
      </div>
    </div>,
  ];

  return (
    <div>
      <div className="flex mb-12 border-b border-[#135868]">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActive(idx)}
            className={`flex-1 px-4 py-2 font-[500] text-[21px] border-b-2 transition text-[#1A202C] opacity-60 ${active === idx ? 'border-[#135868] text-[#135868] opacity-100' : 'border-transparent bg-transparent'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>{tabContents[active]}</div>
    </div>
  );
}
