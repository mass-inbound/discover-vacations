import {useState} from 'react';
import {FaCheck, FaGift} from 'react-icons/fa6';
import {IoDiamond} from 'react-icons/io5';
import {Link} from 'react-router';

export default function ProductDetail() {
  return (
    <div>
      <div
        className="w-full flex items-center justify-center px-2 md:px-0 py-8 md:py-0"
        style={{
          backgroundImage: `url('/assets/OrlandoBanner.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div className="flex flex-col items-center">
          <p className="font-[500] text-[12px] md:text-[14px]">
            Sunshine, Theme Parks, and Family Fun
          </p>
          <h1 className="font-[800] text-[28px] md:text-[46px]">
            {' '}
            OFFERS IN ORLANDO, FL
          </h1>
          <p className="max-w-3xl font-[400] text-[13px] md:text-[16px] text-center">
            Explore our Orlando packages designed for families, couples, and
            adventurers. From world-famous attractions to relaxing resorts, find
            a getaway that fits your style, starting at an unbeatable price.
          </p>
        </div>
      </div>

      <section className="relative overflow-x-hidden py-20 mt-5 bg-[#EAF8F84D]">
        <img
          src="/assets/starPattern.png"
          alt=""
          className="absolute top-5 w-[30%] -left-8 md:w-[247px] opacity-30 scale-x-[-1]"
        />

        <img
          src="/assets/shipPattern.png"
          alt=""
          className="hidden md:block absolute top-10 -right-12 opacity-30 w-[280px]"
        />
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-[61px] font-[500] text-center mb-4 text-[#0E424E]">
            Discover Your Next Vacation
          </h2>
          <p className="font-[400] text-[20px] text-[#676767] mx-auto max-w-3xl text-center mb-10">
            Discover a collection of vacations
          </p>
          {/* Tabs */}
          <Tabs />
        </div>

        <div className="flex justify-center mt-[4rem] mb-8">
          <button className="text-[#2AB7B7] shadow-lg bg-white px-4 py-2 text-[16px] font-[500] rounded-md">
            Show more offers
          </button>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <img
            src="/assets/wavePattern.png"
            alt=""
            className="hidden md:block w-[176px]"
          />
        </div>
      </section>
    </div>
  );
}

function Tabs() {
  const [active, setActive] = useState(0);
  const tabs = ['Popular', 'Hotels', 'Cruise', 'Exclusive Deals'];
  return (
    <div>
      <div
        className="flex mb-12 border-b border-[#135868] overflow-x-auto scrollbar-hide md:overflow-x-visible md:scrollbar-default gap-2 md:gap-0"
        style={{WebkitOverflowScrolling: 'touch'}}
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActive(idx)}
            className={`flex-1 min-w-[48%] md:min-w-0 px-2 md:px-4 py-2 font-[500] text-[16px] md:text-[21px] border-b-2 transition text-[#1A202C] opacity-60 whitespace-nowrap ${active === idx ? 'border-[#135868] text-[#135868] opacity-100' : 'border-transparent bg-transparent'}`}
            style={{scrollbarWidth: 'none'}}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>
        {/* Tab content: for now, static demo cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card design  */}
          <div className="relative bg-white rounded-lg shadow flex flex-col">
            <div className="absolute -top-7 left-1 flex items-center justify-center gap-1 bg-[#F2B233] text-[#FEFEFE] px-2 py-1 text-[12px] md:text-[14px] font-[400] rounded">
              <IoDiamond /> <span>Exclusive Offer</span>
            </div>

            <div className="relative w-full h-[280px] rounded-t mb-4 overflow-hidden">
              {/* Discount polygon badge */}
              <img
                src="/assets/polygonDiscount.svg"
                alt="Discount"
                className="absolute top-0 right-0 z-8"
              />

              {/* Destination image */}
              <img
                src="/assets/DestinationImage.png"
                alt="Orlando, FL"
                className="w-full h-full object-cover"
              />

              {/* Destination title */}
              <h4 className="absolute top-3 left-4 font-bold text-white text-[20px] z-10">
                Orlando, FL
              </h4>

              {/* Details button */}
              <Link
                to="/products/orlando"
                className="absolute left-4 bottom-3 text-[#26A5A5] bg-white px-4 py-1 text-[16px] font-medium z-10 rounded"
              >
                Details
              </Link>
            </div>

            <ul className="text-sm text-[#000] mb-4 list-disc list-inside pl-4 space-y-2">
              <li className="flex gap-2 items-center">
                <FaCheck className="text-amber-400" />{' '}
                <span>2 night hotel accommodation for two adults</span>
              </li>
              <li className="flex gap-2 items-center">
                <FaCheck className="text-amber-400" />{' '}
                <span>Includes flights, Park Hopper tickets, City Bus</span>
              </li>
            </ul>
            <div className="bg-[#FBE7C0] rounded-[8px] px-3 py-1 mx-4 flex gap-2 items-center justify-center">
              <FaGift />
              <span className="text-[16px] font-[500] text-[#151515]">
                Includes a Bonus Gift: Your Choice Vacation Getaway
              </span>
            </div>
            <div className="mt-8 p-4 bg-[#F5F5F5] flex flex-col gap-1 items-center justify-center border-t border-gray-300">
              <span className="text-[#676767] font-[400] text-[13px]">
                3 night/4 days
              </span>
              <div className="flex items-center justify-center gap-1">
                <span className="text-[#135868] font-[500] text-[27px]">
                  $49
                </span>
                <span className="text-[#135868] font-[500] text-[12px]">
                  per <br /> family of four
                </span>
              </div>
              <span className="text-[#676767] font-[400] text-[13px]"></span>
            </div>
            <div className="bg-[#2AB7B7] h-[28px] flex justify-center items-center rounded-b text-white font-[500] text-[12px]">
              Select Offer
            </div>
          </div>

          <div
            className="relative bg-[#0E424E] rounded-lg shadow p-6 text-white bg-cover"
            style={{backgroundImage: 'url(/assets/PlanImage.png)'}}
          >
            <h4 className="font-[500] text-[47px]">Plan Less. Travel More.</h4>
            <button className="absolute bottom-4 left-4 bg-[#2AB7B7] text-white px-6 py-2 rounded shadow font-semibold hover:bg-[#229a9a] transition mt-4 cursor-pointer">
              Discover Offers
            </button>
            <button className="absolute bottom-4 right-4 underline text-white px-6 py-2 font-semibold transition cursor-pointer">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
