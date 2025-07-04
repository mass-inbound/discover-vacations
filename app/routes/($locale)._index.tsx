import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Await,
  useLoaderData,
  Link,
  type MetaFunction,
  useNavigate,
  useRouteLoaderData,
  useAsyncValue,
} from 'react-router';
import {Suspense, useRef, useEffect, useState} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
  CatalogQuery,
  CartApiQueryFragment,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {FaChevronDown} from 'react-icons/fa';
import {FaLocationDot, FaCheck, FaGift} from 'react-icons/fa6';
import {IoDiamond, IoShieldHalf} from 'react-icons/io5';
import {RiCustomerService2Line} from 'react-icons/ri';
import {IoMdPricetags} from 'react-icons/io';
import {GiPalmTree} from 'react-icons/gi';
import {HiOutlineChevronLeft, HiOutlineChevronRight} from 'react-icons/hi';
import {OfferCard} from '../components/OfferCard';
import FooterCarousel from '~/components/FooterCarousel';
import {useOptimisticCart} from '@shopify/hydrogen';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

const COLLECTION_PRODUCT_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
  id
  handle
  title
  description
  featuredImage {
    id
    altText
    url
    width
    height
  }
  priceRange {
    minVariantPrice {
      ...MoneyProductItem
    }
    maxVariantPrice {
      ...MoneyProductItem
    }
  }
  tags
  variants(first: 1) {
    nodes {
      id
    }
  }
}
` as const;

const HOMEPAGE_COLLECTION_QUERY = `#graphql
  query HomePageCollection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: 12) {
        nodes {
          ...ProductItem
        }
      }
    }
  }
  ${COLLECTION_PRODUCT_FRAGMENT}
` as const;

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
  const HOMEPAGE_COLLECTION_HANDLE = 'vacation-package';

  const [featuredResponse, homepageResponse] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(HOMEPAGE_COLLECTION_QUERY, {
      variables: {handle: HOMEPAGE_COLLECTION_HANDLE},
    }),
  ]);

  const featuredCollection = featuredResponse.collections.nodes[0];
  const homepageCollection = homepageResponse.collection; // this is your collection or null

  if (!homepageCollection) {
    console.error(
      'No collection found for handle:',
      HOMEPAGE_COLLECTION_HANDLE,
    );
  } else {
    console.log(
      'Products in homepage collection:',
      homepageCollection.products?.nodes,
    );
  }

  return {
    featuredCollection,
    homepageCollection,
    homepageProducts: homepageCollection?.products?.nodes || [],
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
  const navigate = useNavigate();
  const data = useLoaderData<typeof loader>();
  const bookingRef = useRef<HTMLDivElement>(null);
  const rootData = useRouteLoaderData('root');

  const handleScroll = () => {
    const offset = 130; // height of your fixed navbar
    const element = bookingRef.current;
    if (element) {
      const top =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({top, behavior: 'smooth'});
    }
  };

  <FooterCarousel />;
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative h-[calc(100vh-100px)] flex items-center justify-center bg-cover bg-center"
        style={{backgroundImage: 'url(/assets/hero-new.png)'}}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="relative z-8 flex flex-col items-center justify-center text-center gap-4 w-full px-4">
          <div className="inline-block px-5 py-2 mb-4 bg-[#EAF8F8] text-[#0E424E] text-[21px] font-[500] rounded-[10px] opacity-80 uppercase tracking-wider">
            CATCH THE WAVE, DISCOVER MORE FOR LESS
          </div>
          <h1 className="text-4xl md:text-[61px] font-[500] text-white mb-4 drop-shadow-lg">
            Travel, Discover, Experience
          </h1>
          <p className="text-white text-[20px] font-[400] max-w-4xl mx-auto mb-6 drop-shadow">
            Discover curated vacation offers with simple pricing and a simple
            and stress-free booking experience — designed to make planning easy.
            Whether you&apos;re ready to travel now or 12 months from now, your
            getaway starts here.
          </p>
          <div className="flex gap-12 justify-center my-8">
            <Link
              to="/discover-offers"
              className="bg-[#2AB7B7] text-white px-6 py-2 rounded-[10px] shadow text-[16px] md:text-[20px] font-[400] hover:bg-[#229a9a] transition"
            >
              Discover Offers
            </Link>
            <Link
              to="/discover-offers"
              className="flex items-center text-white underline text-[16px] md:text-[20px] font-[400] hover:text-gray-300"
            >
              See All Offers
            </Link>
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
      <div className="py-8 px-4 md:py-14 md:px-8">
        <div className="relative z-8 max-w-5xl mx-auto text-center">
          {/* Tree Icon BG behind heading */}
          <img
            src="/assets/treebgIcon.png"
            alt="Tree Icon"
            className="hidden md:block absolute left-[90px] top-[30px] w-42 h-52 opacity-80 -z-10 pointer-events-none"
          />
          <img
            src="/assets/treebgIcon.png"
            alt="Tree Icon"
            className="block md:hidden absolute left-1 top-[18px] w-42 h-52 opacity-80 -z-10 pointer-events-none"
          />
          <p className="text-[16px] font-[500] text-[#208989]">
            Plan Less. Enjoy More.
          </p>
          <h2 className="text-3xl md:text-[47px] font-[500] text-[#0E424E] my-5 relative">
            Vacation Booking, Simplified
          </h2>
          <p className="text-[#1A202C] mb-[3.5rem] max-w-2xl mx-auto font-[400] text-[20px] opacity-80">
            Curated offers. Real value. Flexible dates and room options to fit
            your travel plans — without overcomplicating the process.
          </p>
          <div className="flex flex-col md:flex-row items-start justify-center relative">
            {/* Curly line connecting icons */}
            {/* Columns */}
            <div className="relative flex flex-col items-center bg-transparent min-w-[250px]">
              <div className="w-[106px] h-[106px] bg-[#DFF4F4] rounded-[30px] flex items-center justify-center shadow-lg">
                <FaLocationDot size={40} fill="#135868" />
              </div>
              <h3 className="font-semibold text-[24px] my-3 text-[#135868]">
                Discover Your Next Vacation
              </h3>
              <p className="text-[#151515] text-[14px] font-[400] opacity-80">
                Choose a day trip based on your location and interests.
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
              <h3 className="font-semibold text-[24px] my-3 text-[#135868]">
                Pick a Date
              </h3>
              <p className="text-[#151515] text-[14px] font-[400] opacity-80">
                Know your dates? Select them on the calendar before checkout.
                Not ready yet? No problem — purchase now and choose your dates
                anytime in the Booking Hub.
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
              <h3 className="font-semibold text-[24px] my-3 text-[#135868]">
                Book Your Getaway
              </h3>
              <p className="text-[#151515] text-[14px] font-[400] opacity-80">
                Complete your purchase and get instant access to your personal
                Booking Portal, where reserving your trip is quick, easy, and
                secure.
              </p>
              {/* Wave Pattern below the last card */}
              <img
                src="/assets/wavePattern.png"
                alt="Wave Pattern"
                className="md:block hidden absolute -right-1 -bottom-10 w-48 md:w-72 opacity-90 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Find Your Next Escape Section */}
      <section
        ref={bookingRef}
        className="relative overflow-x-hidden py-10 md:py-20 mt-5 bg-[#EAF8F84D]"
      >
        <img
          src="/assets/starPattern.png"
          alt=""
          className="absolute -top-2 md:top-5 -left-8 md:w-[247px] w-[100px] opacity-30 scale-x-[-1] "
        />
        <img
          src="/assets/shipPattern.png"
          alt=""
          className="md:block hidden absolute top-10 -right-12 opacity-30 w-[280px]"
        />
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-[61px] font-[500] text-center mb-4 text-[#0E424E]">
            Discover Your Next Vacation{' '}
          </h2>
          <p className="font-[400] text-[20px] text-[#676767] mx-auto max-w-3xl text-center mb-10 ">
            Discover a collection of vacations
          </p>
          {/* Tabs */}
          <Suspense fallback={<div>Loading cart...</div>}>
            <Await resolve={rootData.cart}>
              {(originalCart) => {
                const cart = useOptimisticCart(originalCart);
                const cartCount = cart?.totalQuantity ?? 0;
                const cartIsEmpty = !cartCount || cartCount === 0;
                return data.homepageProducts &&
                  data.homepageProducts.length > 0 ? (
                  <Tabs
                    products={data.homepageProducts}
                    cartIsEmpty={cartIsEmpty}
                  />
                ) : (
                  <div className="text-center text-red-600 font-bold py-12">
                    No products found for the Home page collection.
                    <br />
                    {/* You can check your server logs for more info. */}
                  </div>
                );
              }}
            </Await>
          </Suspense>
        </div>

        <div className="flex justify-center mt-[4rem] mb-8">
          <Link
            to="/discover-offers"
            className="text-[#2AB7B7] shadow-lg bg-white px-4 py-2 text-[16px] font-[500] rounded-md border border-transparent hover:border-[#2AB7B7]"
          >
            Show more offers
          </Link>
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
          {/* <div className="flex items-center justify-center gap-3 mb-6">
            <FaGift size={48} className="text-[#2AB7B7]" />
            <span className="text-[#135868] text-[22px] font-semibold">
              Includes a bonus gift
            </span>
          </div> */}
          <p className="font-[400] text-[20px] text-[#676767] mx-auto max-w-3xl text-center mb-10">
            Your vacation should be stress-free from start to finish. That's why
            we've built in support, security, and convenience every step of the
            way.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:mx-auto px-8 md:px-0 max-w-7xl">
          <img
            src="/assets/peace2.jpg"
            alt="Peace of Mind"
            className="rounded-[10px] shadow-2xl"
          />
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="bg-[#2AB7B7] px-3 md:px-0 rounded-[10px] h-[50px] md:w-[90px] flex justify-center items-center text-white">
                <RiCustomerService2Line size={25} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#1A202C] font-[600] text-[22px]">
                  Personal Support, When You Need It
                </h3>
                <div className="text-[#1A202C] text-[16px] font-[400] pl-4">
                  Whether you have a question before booking or need help
                  finalizing your travel dates, our team is here for you — real
                  people, ready to help.
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-[#2AB7B7] px-3 md:px-0 rounded-[10px] h-[50px] md:w-[90px] flex justify-center items-center text-white">
                <IoMdPricetags size={25} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#1A202C] font-[600] text-[22px]">
                  Guided Self-Service Booking
                </h3>
                <div className="text-[#1A202C] text-[16px] font-[400] pl-4">
                  Use our secure booking portal to select your travel dates,
                  view available hotels, and manage your reservation at your
                  convenience.
                  <br />
                  Want to upgrade or add nights? We&apos;ll show you what&apos;s
                  available.
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-[#2AB7B7] px-3 md:px-0 rounded-[10px] h-[50px] md:w-[90px] flex justify-center items-center text-white">
                <IoShieldHalf size={25} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#1A202C] font-[600] text-[22px]">
                  Secure, Encrypted Checkout
                </h3>
                <div className="text-[#1A202C] text-[16px] font-[400] pl-4">
                  Your payment is processed using secure, encrypted checkout
                  technology — giving you peace of mind when making your
                  purchase.
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-[#2AB7B7] px-3 md:px-0 rounded-[10px] h-[50px] md:w-[120px] flex justify-center items-center text-white">
                <GiPalmTree size={25} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#1A202C] font-[600] text-[22px]">
                  Simple, Flexible Travel Options
                </h3>
                <div className="text-[#1A202C] text-[16px] font-[400] pl-4">
                  We know plans can shift — that&apos;s why we allow you to
                  choose travel dates that work for your schedule, add extra
                  nights, and upgrade your accommodations when available.
                  <br />
                  No pressure, no hidden fees, and no guessing.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* carousel section  */}
      <FooterCarousel />
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
function Tabs({
  products,
  cartIsEmpty,
}: {
  products: Array<{
    id: string;
    handle: string;
    title: string;
    description?: string;
    featuredImage?: {url: string; altText?: string};
    tags?: string[];
    priceRange: {
      minVariantPrice: {amount: string};
      maxVariantPrice: {amount: string};
    };
  }>;
  cartIsEmpty: boolean;
}) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const tabs = ['Popular', 'Hotels', 'Cruise', 'Exclusive Deals'];

  // Map tab index to tag
  const tabTagMap: Record<number, string> = {
    0: 'Popular',
    1: 'Hotels',
    2: 'Cruise',
    3: 'Exclusive',
  };

  // Filter products for the active tab
  const filteredProducts = products.filter(
    (product) =>
      Array.isArray(product.tags) && product.tags.includes(tabTagMap[active]),
  );

  // Responsive tab logic: show only two tabs at a time on mobile
  let visibleTabs = tabs;
  let tabOffset = 0;
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    // On mobile, show only two tabs at a time, scrollable
    if (active === 0) tabOffset = 0;
    else if (active === tabs.length - 1) tabOffset = tabs.length - 2;
    else tabOffset = active - 1;
    visibleTabs = tabs.slice(tabOffset, tabOffset + 2);
  }

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
      <div
        className={`grid gap-8 ${
          tabs[active] === 'Popular'
            ? 'md:grid-cols-[2fr_1fr] grid-cols-1'
            : 'grid-cols-1'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, idx) => (
              <div key={product.id} className="md:pb-0 pb-6">
                <OfferCard
                  product={product}
                  cartIsEmpty={cartIsEmpty}
                  onSelect={(prod) =>
                    navigate(
                      `/cart?title=${encodeURIComponent(prod.title)}&location=${encodeURIComponent(Array.isArray(prod.tags) ? prod.tags.find((t: string) => t.match(/,|FL|PA/)) || '' : '')}&image=${encodeURIComponent(prod.featuredImage?.url || '')}&price=${prod.priceRange.minVariantPrice.amount}`,
                    )
                  }
                />
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-red-600 font-bold py-12">
              No products found for this tab.
            </div>
          )}
        </div>
        {/* Hide sidebar card on mobile */}
        {tabs[active] === 'Popular' && (
          <div
            className="hidden md:block relative bg-[#0E424E] rounded-lg shadow p-6 text-white bg-cover min-h-[400px]"
            style={{backgroundImage: 'url(/assets/PlanImage.png)'}}
          >
            <h4 className="font-[500] text-[24px] md:text-[47px]">
              Plan Less. Travel More.
            </h4>
            <Link
              to={'/discover-offers'}
              className="absolute bottom-4 left-4 bg-[#2AB7B7] text-white px-4 md:px-6 py-2 rounded shadow font-semibold hover:bg-[#229a9a] transition mt-4 cursor-pointer text-[16px] md:text-[20px]"
            >
              Discover Offers
            </Link>
            <Link
              to={'/contact-us'}
              className="absolute bottom-4 right-4 underline text-white px-4 md:px-6 py-2 font-semibold transition cursor-pointer text-[16px] md:text-[20px]"
            >
              Contact Us
            </Link>
          </div>
        )}
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
