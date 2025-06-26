import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense, useRef} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {FaChevronDown} from 'react-icons/fa';
import {FaLocationDot, FaCheck, FaGift} from 'react-icons/fa6';
import {IoDiamond, IoShieldHalf} from 'react-icons/io5';
import {RiCustomerService2Line} from 'react-icons/ri';
import {IoMdPricetags} from 'react-icons/io';
import {GiPalmTree} from 'react-icons/gi';
import {HiOutlineChevronLeft, HiOutlineChevronRight} from 'react-icons/hi';
import {useState} from 'react';
import FAQ from '~/components/FAQ';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const bookingRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    bookingRef.current?.scrollIntoView({behavior: 'smooth'});
  };

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
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative h-[calc(100vh-100px)] flex items-center justify-center bg-cover bg-center"
        style={{backgroundImage: 'url(/assets/heroImage.jpg)'}}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="relative z-8 flex flex-col items-center justify-center text-center gap-4 w-full px-4">
          <div className="inline-block px-5 py-2 mb-4 bg-[#EAF8F8] text-[#0E424E] text-[21px] font-[500] rounded-[10px] uppercase tracking-wider">
            CATCH THE WAVE, DISCOVER MORE FOR LESS
          </div>
          <h1 className="text-4xl md:text-[61px] font-[500] text-white mb-4 drop-shadow-lg">
            Travel, Discover, Belong
          </h1>
          <p className="text-white text-[20px] font-[400] max-w-4xl mx-auto mb-6 drop-shadow">
            Discover flexible vacation packages with clear starting prices and a
            seamless booking process that designed to make planning easy and
            stress-free.
          </p>
          <div className="flex gap-12 justify-center my-8">
            <button className="bg-[#2AB7B7] text-white px-6 py-2 rounded-[10px] shadow text-[20px] font-[400] hover:bg-[#229a9a] transition">
              Discover Offers
            </button>
            <button className="text-white underline text-[20px] font-[400]">
              See All Offers
            </button>
          </div>
        </div>
        {/* Logo at bottom right */}
        <img
          src="/assets/heroImageLogo.png"
          alt="Logo"
          className="absolute right-8 bottom-8 w-32 h-auto z-20"
        />
        {/* Scroll Button */}
        <button
          onClick={handleScroll}
          className="absolute left-1/2 -translate-x-1/2 bottom-6 z-20 flex items-center justify-center gap-3"
        >
          <span className="text-white text-[20px] font-[400]">Scroll</span>
          <FaChevronDown className="text-[#fff] text-sm mt-1" />
        </button>
      </section>

      {/* Vacation Booking, Simplified Section */}
      <section
        ref={bookingRef}
        className="relative py-20 bg-white overflow-hidden"
      >
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

      {/* Find Your Next Escape Section */}
      <section className="relative overflow-x-hidden py-20 mt-5 bg-[#EAF8F84D]">
        <img
          src="/assets/starPattern.png"
          alt=""
          className="absolute top-5 -left-8 w-[247px] opacity-30"
        />
        <img
          src="/assets/shipPattern.png"
          alt=""
          className="absolute top-10 -right-12 opacity-30 w-[280px]"
        />
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-[61px] font-[500] text-center mb-4 text-[#0E424E]">
            Find Your Next Escape
          </h2>
          <p className="font-[400] text-[20px] text-[#676767] mx-auto max-w-3xl text-center mb-10">
            Explore a collection of vacation offers crafted for ease, comfort,
            and flexibility. Just choose your favorite, set your travel dates,
            and customize as needed.
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
          <img src="/assets/wavePattern.png" alt="" className="w-[176px]" />
        </div>
      </section>

      {/* Peace of Mind section  */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-[61px] font-[500] text-center mb-4 text-[#0E424E]">
            Peace of Mind, Included
          </h2>
          <p className="font-[400] text-[20px] text-[#676767] mx-auto max-w-3xl text-center mb-10">
            We make it easy to book and even easier to feel confident doing it.
            Here's what you get with every trip.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto max-w-7xl">
          <img
            src="/assets/peaceMindImg.jpg"
            alt="Peace of Mind"
            className="rounded-[10px] shadow-2xl"
          />
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="bg-[#2AB7B7] rounded-[10px] h-[50px] w-[50px] flex justify-center items-center text-white">
                <RiCustomerService2Line size={25} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#1A202C] font-[600] text-[22px]">
                  Customer Support
                </h3>
                <p className="text-[#1A202C] font-[400] text-[16px] max-w-xl">
                  Dedicated support before, during, and after your trip with
                  clear answers and timely assistance.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-[#2AB7B7] rounded-[10px] h-[50px] w-[50px] flex justify-center items-center text-white">
                <IoMdPricetags size={25} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#1A202C] font-[600] text-[22px]">
                  Easy Self-Service Booking Portal
                </h3>
                <p className="text-[#1A202C] font-[400] text-[16px] max-w-xl">
                  Book, manage, or reschedule your getaway anytime through our
                  secure online portal — it's travel made simple.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-[#2AB7B7] rounded-[10px] h-[50px] w-[50px] flex justify-center items-center text-white">
                <IoShieldHalf size={25} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#1A202C] font-[600] text-[22px]">
                  Secure Checkout
                </h3>
                <p className="text-[#1A202C] font-[400] text-[16px] max-w-xl">
                  Your data and payment details are protected by
                  enterprise-grade encryption and secure gateways.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-[#2AB7B7] rounded-[10px] h-[50px] w-[50px] flex justify-center items-center text-white">
                <GiPalmTree size={25} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#1A202C] font-[600] text-[22px]">
                  Flexible Booking Options
                </h3>
                <p className="text-[#1A202C] font-[400] text-[16px] max-w-xl">
                  Choose your destination, plan your trip, and adjust when
                  needed — with full support along the way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* carousel section  */}
      <section className="relative bg-[#EAF8F8] py-[7rem]">
        <div
          className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-lg"
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
                className="min-w-full md:min-w-1/2 flex-shrink-0 flex items-center justify-center bg-white"
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
      {/* Ready to Plan Your Next Getaway Section */}
      <section
        className="relative flex flex-col md:flex-row justify-between bg-cover bg-center h-[760px]"
        style={{
          backgroundImage: 'url(/assets/readyPlanImg.jpg)',
        }}
      >
        <div className="flex-1" />
        <div className="flex-1 flex flex-col justify-center items-start gap-2 px-8 py-16 md:py-0 md:pr-20 z-8">
          <div className="inline-block px-5 py-2 mb-4 bg-[#EAF8F8] text-[#0E424E] text-[21px] font-[500] rounded-[10px] uppercase tracking-wider">
            CATCH THE WAVE, DISCOVER MORE FOR LESS
          </div>
          <h2 className="text-4xl md:text-[48px] font-[500] text-white mb-4 drop-shadow-lg">
            Ready to Plan Your Next Getaway?
          </h2>
          <p className="text-white text-start text-[20px] font-[400] max-w-xl mb-6 drop-shadow">
            Browse our flexible offers and customize your trip in just a few
            clicks, no pressure, no complicated steps.
          </p>
          <div className="flex gap-8 justify-end">
            <button className="bg-[#2AB7B7] text-white px-6 py-2 rounded-[10px] shadow text-[20px] font-[400] hover:bg-[#229a9a] transition">
              Discover Offers
            </button>
            <button className="text-white underline text-[20px] font-[400]">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2 className="text-[2rem]">Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

// Simple Tabs implementation for demo
function Tabs() {
  const [active, setActive] = useState(0);
  const tabs = ['Popular', 'Hotels', 'Cruise', 'Exclusive Deals'];
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
      <div>
        {/* Tab content: for now, static demo cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card design  */}
          <div className="relative bg-white rounded-lg shadow flex flex-col">
            <div className="absolute -top-7 left-1 flex items-center justify-center gap-1 bg-[#F2B233] text-[#FEFEFE] px-2 py-1 text-[14px] font-[400] rounded">
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
              <button className="absolute left-4 bottom-3 text-[#26A5A5] bg-white px-4 py-1 text-[16px] font-medium z-10 rounded">
                Details
              </button>
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
              <span className="text-[16px] font-[400] text-[#151515]">
                Includes a Gift: Your Next Vacation, On Us
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
                  per <br /> couple
                </span>
              </div>
              <span className="text-[#676767] font-[400] text-[13px]">
                not included taxes + fees
              </span>
            </div>
            <div className="bg-[#2AB7B7] h-[28px] flex justify-center items-center rounded-b text-white font-[500] text-[12px]">
              Select Offer
            </div>
          </div>

          <div className="relative bg-white rounded-lg shadow flex flex-col">
            <div className="relative w-full h-[280px] rounded-t mb-4 overflow-hidden">
              {/* Discount polygon badge */}
              <img
                src="/assets/polygonDiscount.svg"
                alt="Discount"
                className="absolute top-0 right-0 z-8"
              />

              {/* Destination image */}
              <img
                src="/assets/DestinationImage2.png"
                alt="Orlando, FL"
                className="w-full h-full object-cover"
              />

              {/* Destination title */}
              <h4 className="absolute top-3 left-4 font-bold text-white text-[20px] z-10">
                Poconos, PA
              </h4>

              {/* Details button */}
              <button className="absolute left-4 bottom-3 text-[#26A5A5] bg-white px-4 py-1 text-[16px] font-medium z-10 rounded">
                Details
              </button>
            </div>

            <ul className="text-sm text-[#000] mb-4 list-disc list-inside pl-4 space-y-2">
              <li className="flex gap-2 items-center">
                <FaCheck className="text-amber-400" />{' '}
                <span>3 nights hotel accommodations for two adults</span>
              </li>
              <li className="flex gap-2 items-center">
                <FaCheck className="text-amber-400" />{' '}
                <span>Enjoy Exclusive Perks During Your Stay</span>
              </li>
            </ul>
            <div className="bg-[#FBE7C0] rounded-[8px] px-3 py-1 mx-4 flex gap-2 items-center justify-center">
              <FaGift />
              <span className="text-[16px] font-[400] text-[#151515]">
                Includes a Gift: Your Next Vacation, On Us
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
                  per <br /> couple
                </span>
              </div>
              <span className="text-[#676767] font-[400] text-[13px]">
                not included taxes + fees
              </span>
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

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
