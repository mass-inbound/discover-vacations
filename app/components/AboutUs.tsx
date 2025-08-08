import React from 'react';
import {FaTag, FaCalendarAlt, FaGift, FaLaptop} from 'react-icons/fa';
export default function AboutUs() {
  return (
    <div className="relative bg-white">
      {/* Hero Section */}
      <div
        className="relative w-full"
        style={{aspectRatio: '16/7', minHeight: 400, maxHeight: 520}}
      >
        {/* Background Image */}
        <img
          src="/assets/beach4.png"
          alt="Beach background"
          className="absolute inset-0 w-full h-[320px] md:h-[313px] object-cover object-center z-5 md:z-0"
          draggable={false}
        />
        {/* Flex container for centering */}
        <div className="absolute inset-0 flex flex-col md:flex-row items-end md:items-center justify-center w-full h-full px-6 md:px-4">
          {/* Family Image Card - perfectly centered, fixed aspect, strong shadow, overlaps white section */}
          <div
            className="md:block flex-shrink-0 z-0 md:z-20 relative bg-white rounded-[18px] shadow-2xl overflow-hidden flex items-center justify-center"
            style={{
              width: '90%',
              maxWidth: 420,
              aspectRatio: '15/16',
              marginBottom: '-60px', // Overlap the white section below
              boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
            }}
          >
            <img
              src="/assets/family1.jpg"
              alt="Family on the beach"
              className="hidden md:block object-cover w-full h-full rounded-[18px]"
            />
          </div>
          {/* About Us Text - vertically centered, right aligned, not taller than family image */}
          <div
            className="z-30 flex flex-col justify-center text-left bg-transparent md:ml-12 mt-59 md:mt-30"
            style={{
              width: '100%',
              maxWidth: 480,
              minHeight: 0,
            }}
          >
            <div className="mb-2 text-[#2AB7B7] text-[30px] font-[500] tracking-wider font-plusjakarta">
              About Us
            </div>
            <h1 className="mb-10 md:mb-5 pb-4 md:pb-0 text-5xl font-bold leading-12 text-gray-800 sm:text-white font-brush">
              Catch The Wave. Discover
              <br />
              More For Less.
            </h1>
            <p className="text-[#101010] text-[18px] font-[400] md:pt-10 font-avenir text-center md:text-left">
              At Discover Vacations, we believe planning your next getaway
              should be as exciting as the trip itself. That&apos;s why
              we&apos;ve built a smarter, simpler way to access vacation
              packages that deliver real value — without the guesswork. Whether
              you&apos;re dreaming of a beachfront resort, a magical family
              getaway, a romantic mountain escape, or a land &amp; sea
              adventure, our goal is the same: make your vacation seamless,
              affordable, and unforgettable.
            </p>
          </div>
        </div>
        {/* Decorative Elements - bottom corners */}
        <img
          src="/assets/starPattern.png"
          alt="Stars"
          className="absolute left-0 -bottom-40 opacity-50 pointer-events-none select-none z-10"
          style={{width: '8vw', minWidth: 60, maxWidth: 120}}
        />
        <img
          src="/assets/treebgIcon.png"
          alt="Tree"
          className="absolute right-0 -bottom-100 opacity-50 pointer-events-none select-none z-10"
          style={{width: '10vw', minWidth: 80, maxWidth: 140}}
        />
      </div>
      {/* Mission and Values Section */}
      <div className="max-w-4xl mx-auto md:mt-24 mt-100 text-center px-6 md:px-8">
        <h4 className="text-[#2AB7B7] text-[22px] font-semibold mb-3 tracking-widest uppercase font-plusjakarta">
          OUR MISSION
        </h4>
        <p className="text-[#070707] mb-12 text-[18px] font-[500] leading-relaxed max-w-4xl mx-auto font-plusjakarta">
          To provide travelers with high-quality, value-packed vacation
          experiences through transparent offers, flexible support, and
          unmatched customer service — all backed by a team you can trust.
        </p>
        <h4 className="text-[#2AB7B7] font-plusjakarta text-[22px] font-semibold mb-3 tracking-widest uppercase font-plusjakarta">
          OUR VALUES
        </h4>
        <div className="text-[#070707] font-plusjakarta text-[18px] font-[500] leading-relaxed max-w-4xl mx-auto space-y-4">
          <p>
            Discover Vacations was created by a team of seasoned travel
            professionals with a shared mission: to make it easier for customers
            like you to enjoy unforgettable vacations — without overpaying or
            overcomplicating the process. With deep industry roots and
            real-world travel insight, we&apos;ve built long-standing
            relationships with leading hotels, resorts, and cruise lines to
            offer exclusive vacation packages at unmatched value.
          </p>
          <p>
            As part of our commitment to providing these benefits, many of our
            packages include a hosted visit at one of our resort partners —
            giving you a chance to explore beautiful properties, enjoy added
            perks, and discover new ways to vacation. Our seamless booking and
            travel support system simplifies everything from purchase to
            planning — giving you more flexibility, more experiences, and more
            reasons to travel.
          </p>
        </div>
      </div>
      {/* What Sets Us Apart Section */}
      <div className="relative w-full pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6 md:px-4">
          <h2 className="text-[36px] font-[500] text-center mb-6 text-[#0e424e] font-monteserrat">
            What Sets Us Apart
          </h2>

          <div className="bg-[#EAF8F8] rounded-2xl p-12 grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 shadow-sm">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#2AB7B7] rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaTag className="text-white text-xl" />
              </div>
              <h3 className="font-[600] text-[24px] text-[#113B3F] mb-1 font-plusjakarta">
                Verified Travel Offers
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-avenir font-[400] text-[16px]">
                All of our vacation packages are backed by official Seller of
                Travel registrations and reviewed for security and accuracy.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#2AB7B7] rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
              <h3 className="font-[600] text-[24px] text-[#113B3F] mb-1 font-plusjakarta">
                Flexible Booking Options
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-avenir font-[400] text-[16px]">
                Choose your destination, plan your trip, and adjust when needed
                — with full support along the way.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#2AB7B7] rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaGift className="text-white text-xl" />
              </div>
              <h3 className="font-[600] text-[24px] text-[#113B3F] mb-1 font-plusjakarta">
                More For Less
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-avenir font-[400] text-[16px]">
                Every package includes bonus perks like hotel savings, cruise
                options, or travel extras to help you get the most value.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#2AB7B7] rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaLaptop className="text-white text-xl" />
              </div>
              <h3 className="font-[600] text-[24px] text-[#113B3F] mb-1 font-plusjakarta">
                Easy Self–Service Booking Portal
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-avenir font-[400] text-[16px]">
                Book, manage, or reschedule your getaway anytime through our
                secure online portal — it&apos;s travel made simple.
              </p>
            </div>
          </div>
        </div>
        {/* Decorative Images */}
        <img
          src="/assets/wavePattern.png"
          alt="Wave"
          className="absolute left-0 top-1/3 w-32 opacity-40 pointer-events-none select-none z-0"
        />
        <img
          src="/assets/shipPattern.png"
          alt="Ship"
          className="absolute right-0 bottom-8 w-40 opacity-40 pointer-events-none select-none z-0"
        />
        {/* Who We Are */}
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2 className="text-[36px] font-[500] text-center mb-3 text-[#0e424e] font-monteserrat">
            Who We Are
          </h2>
          {/* <p className="text-center text-[#1A202C] mb-16 text-base leading-relaxed max-w-3xl mx-auto font-plusjakarta"> */}
          <p className="text-[#070707] font-plusjakarta text-[18px] font-[500] leading-relaxed max-w-4xl mx-auto text-center mb-12">
            We&apos;re a team of travel professionals who&apos;ve spent decades
            helping families, couples, and explorers just like you create
            unforgettable getaways. With experience in vacation planning, resort
            partnerships, and customer support, we know what it takes to make
            your vacation smooth from the moment you book to the moment you
            check in.
          </p>
          {/* Trusted and Certified */}
          <h2 className="text-[36px] font-[500] text-center mb-3 text-[#0e424e] font-monteserrat">
            Trusted and Certified
          </h2>
          <div className="text-center text-[#070707] font-plusjakarta text-[18px] font-[500] leading-relaxed max-w-4xl mx-auto mb-12">
            <p>
              Discover Vacations is a registered travel provider that meets all
              required industry standards to ensure your vacation is secure and
              supported. These registrations allow us to fulfill vacation
              packages with confidence and integrity, ensuring every customer
              receives the service and support they deserve. We also take your
              privacy seriously — your information is protected, never sold, and
              only used to deliver the travel services you request.
            </p>
            <p>
              You can view our full Privacy Policy by clicking the link provided
              in the footer below.
            </p>
          </div>

          <p className="text-[13px] font-[400] text-center text-[#1A202C] max-w-3xl mx-auto mt-8 font-avenir">
            Discover Vacations operates under authorized Seller of Travel
            registrations: Florida ST-17213, California CST 2025290-40,
            Washington UBI 602 005 020, and Hawaii TAR-5681.
          </p>
        </div>
      </div>
    </div>
  );
}
