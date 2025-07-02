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
          className="absolute inset-0 w-full h-[320px] md:h-[313px] object-cover object-center z-0"
          draggable={false}
        />
        {/* Flex container for centering */}
        <div className="absolute inset-0 flex flex-col md:flex-row items-end md:items-center justify-center w-full h-full px-6 md:px-4">
          {/* Family Image Card - perfectly centered, fixed aspect, strong shadow, overlaps white section */}
          <div
            className="hidden md:block flex-shrink-0 z-20 relative bg-white rounded-[18px] shadow-2xl overflow-hidden items-center justify-center"
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
              className="object-cover w-full h-full rounded-[18px]"
            />
          </div>
          {/* About Us Text - vertically centered, right aligned, not taller than family image */}
          <div
            className="z-30 flex flex-col justify-center text-left bg-transparent md:ml-12 mt-59 md:mt-24"
            style={{
              width: '100%',
              maxWidth: 480,
              minHeight: 0,
            }}
          >
            <div className="mb-2 text-[#8DD3C7] text-base font-semibold tracking-wider">
              About Us
            </div>
            <h1
              className="mb-8 text-5xl font-bold leading-tight text-white"
              style={{
                textShadow:
                  '0 2px 12px rgba(0,0,0,0. 5), 0 1px 2px rgba(0,0,0,0.3)',
                fontFamily: '"Brush Script MT", cursive',
              }}
            >
              Catch The Wave. Discover
              <br />
              More For Less.
            </h1>
            <p
              className="font-normal font-[#101010] opacity-80 mt-2"
              style={{}}
            >
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
          className="absolute -left-12 -bottom-240 md:-left-10 md:-bottom-120 opacity-40 pointer-events-none select-none z-10 scale-x-[-1]"
          style={{width: '10vw', minWidth: 100, maxWidth: 190}}
        />
        <img
          src="/assets/treebgIcon.png"
          alt="Tree"
          className="absolute -right-0 -bottom-90 md:-right-4 md:-bottom-60 opacity-50 pointer-events-none select-none z-10"
          style={{width: '10vw', minWidth: 100, maxWidth: 140}}
        />
      </div>
      {/* Mission and Values Section */}
      <div className="max-w-4xl mx-auto md:mt-24 mt-54 text-center px-6 md:px-8">
        <h4 className="text-[#8DD3C7] text-xs md:text-lg font-semibold mb-3 tracking-widest uppercase">
          OUR MISSION
        </h4>
        <p className="text-gray-500 mb-15 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
          To provide travelers with high-quality, value-packed vacation
          experiences through transparent offers, flexible support, and
          unmatched customer service — all backed by a team you can trust.
        </p>
        <h4 className="text-[#8DD3C7] text-xs md:text-lg font-semibold mb-3 tracking-widest uppercase">
          OUR VALUES
        </h4>
        <div className="text-gray-500 text-base md:text-lg leading-relaxed max-w-3xl mx-auto space-y-4">
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
          <h2 className="text-3xl font-semibold text-center mb-12 text-[#0E424E]">
            What Sets Us Apart
          </h2>
          <div className="bg-[#EAF8F8] rounded-1xl p-10 grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 shadow-sm">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#8DD3C7] rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaTag className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">
                Verified Travel Offers
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                All of our vacation packages are backed by official Seller of
                Travel registrations and reviewed for security and accuracy.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#8DD3C7] rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">
                Flexible Booking Options
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Choose your destination, plan your trip, and adjust when needed
                — with full support along the way.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#8DD3C7] rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaGift className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">
                More For Less
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every package includes bonus perks like hotel savings, cruise
                options, or travel extras to help you get the most value.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#8DD3C7] rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaLaptop className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">
                Easy Self–Service Booking Portal
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
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
          style={{width: '10vw', minWidth: 100, maxWidth: 190}}
          className="absolute md:-left-4 md:bottom-120 -left-6 bottom-230 w-32 opacity-50 pointer-events-none select-none z-0"
        />
        <img
          src="/assets/shipPattern.png"
          alt="Ship"
          style={{width: '15vw', minWidth: 240, maxWidth: 280}}
          className="absolute bottom-130 -right-0 md:-right-20 md:bottom-66 w-40 opacity-30 pointer-events-none select-none z-0"
        />
        {/* Who We Are */}
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl font-semibold text-center mb-6 text-[#0E424E]">
            Who We Are
          </h2>
          <p className="text-center text-gray-500 mb-16 text-base leading-relaxed max-w-3xl mx-auto">
            We&apos;re a team of travel professionals who&apos;ve spent decades
            helping families, couples, and explorers just like you create
            unforgettable getaways. With experience in vacation planning, resort
            partnerships, and customer support, we know what it takes to make
            your vacation smooth from the moment you book to the moment you
            check in.
          </p>
          {/* Trusted and Certified */}
          <h2 className="text-3xl font-semibold text-center mb-6 text-[#0E424E]">
            Trusted and Certified
          </h2>
          <div className="text-center text-gray-500 text-base leading-relaxed max-w-3xl mx-auto space-y-4">
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
          <p className="text-xs text-center text-gray-00 max-w-3xl mx-auto mt-8">
            Discover Vacations operates under authorized Seller of Travel
            registrations: Florida ST-17213, California CST 2025290-40,
            Washington UBI 602 005 020, and Hawaii TAR-5681.
          </p>
        </div>
      </div>
    </div>
  );
}
