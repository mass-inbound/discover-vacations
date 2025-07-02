import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {useState} from 'react';
import {BiCart} from 'react-icons/bi';
import {FaCheck, FaGift} from 'react-icons/fa';
import {FaLocationDot} from 'react-icons/fa6';
import {HiOutlineChevronLeft, HiOutlineChevronRight} from 'react-icons/hi';
import {IoDiamond} from 'react-icons/io5';
import {useNavigate} from 'react-router';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
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
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();
  const mainImage =
    product.selectedOrFirstAvailableVariant?.image?.url ||
    '/assets/orlando.jpg';
  const mainImageAlt =
    product.selectedOrFirstAvailableVariant?.image?.altText || product.title;
  const price = product.selectedOrFirstAvailableVariant?.price?.amount || '0';
  const slides = [
    {src: mainImage, alt: mainImageAlt},
    {src: '/assets/carouselImage1.jpg', alt: 'Carousel 1'},
    {src: '/assets/carouselImage2.jpg', alt: 'Carousel 2'},
  ];
  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);
  const nextSlide = () => setCurrent(current === length - 1 ? 0 : current + 1);

  // Parse description for bullet points (split by newlines)
  const bullets = product.description
    ? product.description
        .replace(/\/n/g, '\n') // convert "/n" to real newline
        .split(/\r?\n/)
        .filter((b: string) => b.trim().length > 0)
    : [];

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  const navigate = useNavigate();

  return (
    <div className="mx-auto md:mt-20">
      {/* Offer Expires Section */}
      
      <div className="md:grid grid-cols-[1.5fr_1fr] min-h-[528px] max-w-7xl mx-auto">
        <div className="h-full">
          <img
            src={mainImage}
            alt={mainImageAlt}
            className="md:h-full h-[500px] w-full object-cover"
          />
        </div>
        <div className='px-4 md:px-0 md:relative'>
        <div className="bg-[#2ab7b7] md:absolute md:-top-10.5 md:w-full mt-8 md:mt-0 py-2 flex items-center justify-center rounded-t-lg">

        <span className="font-semibold text-[#135868] text-[18px] mr-4">Offer Expires:</span>
        <span className="font-mono text-[#135868] text-[18px] flex items-center gap-1">
          <span>00</span>
          <span className="text-[12px] mx-1">HR</span>
          <span>:</span>
          <span>00</span>
          <span className="text-[12px] mx-1">MIN</span>
          <span>:</span>
          <span>00</span>
          <span className="text-[12px] mx-1">SEC</span>
        </span>
      </div>
        <div className="bg-[#F5F5F5] p-8 md:h-full">
          <h1 className="uppercase font-[800] text-[24px]">{product.title}</h1>
          <p className="font-[400] text-[20px] text-[#070707] opacity-70">
            {product.vendor || ''}
          </p>
          <div className="bg-white rounded-[10px] my-4 p-3 flex flex-col items-center">
            <span className="text-[#0E424E] font-[400] text-[13px]">
              3 night/4 days
            </span>
            <div className="flex items-center justify-center gap-1">
              <span className="text-[#135868] font-[500] text-[27px]">
                ${price}
              </span>
              <span className="text-[#135868] font-[500] text-[12px]">
                per <br /> family of four
              </span>
            </div>
            <span className="text-[#0E424E] font-[400] text-[13px]">
               
            </span>
          </div>
          <ul className="text-sm text-[#000] my-4 list-disc list-inside space-y-2">
            {bullets.map((b: string, i: number) => {
              return (
                <li key={i} className="flex gap-2 items-center">
                  <FaCheck className="text-[#113B3F]" />{' '}
                  <span className="text-[#113B3F] font-[400] text-[16px]">
                    {b}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="max-w-[100%] bg-[#F2B233] rounded-[8px] px-3 py-1 flex gap-2 items-center justify-center">
            <FaGift className="text-white" />
            <span className="text-[16px] font-[500] text-white w-full">
            Includes a Bonus Gift: Your Choice Vacation Getaway
            </span>
          </div>
          <p className="underline my-8 cursor-pointer">Need Help? Contact Us</p>
          <button
            className="bg-[#2AB7B7] rounded flex gap-2 items-center justify-center text-white px-4 py-2 hover:bg-[#229a9a]"
            onClick={() =>
              navigate(
                `/cart?title=${encodeURIComponent(product.title)}&location=${encodeURIComponent(product.tags?.find((t: string) => t.match(/,|FL|PA/)) || '')}&image=${encodeURIComponent(mainImage)}&price=${price}`,
              )
            }
          >
            <BiCart size={25} />
            <span className="text-[16px] font-[600]">Save My Deal Now</span>
          </button>
        </div>
        </div>
      </div>
      {/* tab section  */}
      <div className="my-8 mx-auto max-w-7xl">
        <Tabs />
      </div>
      {/* Vacation Booking curly line  */}

      <div className="py-14 px-8">
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
          <p className="text-[#1A202C] mb-[3.5rem] max-w-2xl mx-auto font-[400] text-[20px]">
           Curated offers. Real value. Flexible dates and room options to fit your travel plans — without overcomplicating the process.
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
              <p className="text-[#151515] text-[14px] font-[400]">
                Choose a day trip based on your location and interests.
              </p>
            </div>
            {/* After first card: horizontal for desktop, vertical for mobile */}
            <img
              src="/assets/curlyLine.png"
              alt="Curly Line"
              className="hidden md:block mt-5"
            />
            {/* Mobile vertical curly line after first card */}
            <img
              src="/assets/curlyLine-vertical.png"
              alt="Curly Line"
              className="block md:hidden my-8 h-24 w-auto mx-auto pb-6"
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
              <p className="text-[#151515] text-[14px] font-[400]">
                Know your dates? Select them on the calendar before checkout.
Not ready yet? No problem — purchase now and choose your dates anytime in the Booking Hub.
              </p>
            </div>
            {/* After second card: horizontal for desktop, vertical for mobile */}
            <img
              src="/assets/curlyLine.png"
              alt="Curly Line"
              className="hidden md:block mt-5"
            />
            {/* Mobile vertical curly line after second card */}
            <img
              src="/assets/curlyLine-vertical.png"
              alt="Curly Line"
              className="block md:hidden my-8 h-24 w-auto mx-auto pb-6"
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
              <p className="text-[#151515] text-[14px] font-[400]">
                Complete your purchase and get instant access to your personal Booking Portal, where reserving your trip is quick, easy, and secure.
              </p>
              {/* Wave Pattern below the last card */}
              <img
                src="/assets/wavePattern.png"
                alt="Wave Pattern"
                className="absolute -right-1 -bottom-10 w-48 md:w-72 opacity-90 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
    
      {/* carousel  */}
      <section className="relative bg-[#EAF8F8] md:py-[7rem] px-4 py-16 md:py-0">
        <div
          className="relative w-full max-w-7xl overflow-hidden rounded-lg"
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
    <div key="overview" className="bg-gray-100 p-4 md:p-8 text-center flex flex-col gap-4 rounded">
      <h1 className="text-[#0E424E] font-[500] text-[24px] md:text-[36px]">
        🌾 Discover Orlando – 4 Days / 3 Nights + Bonus Vacation Gift
      </h1>
      <p className="text-[#0E424E] text-[16px] md:text-[20px] font-[400] max-w-[95%] md:max-w-[80%] mx-auto">
      Start your <span className='font-bold'>My Discover Vacation</span> in the heart of Orlando with 4 days and 3 nights of fun, sun, and memory-making. Ideal for two adults or a family of four (two adults + up to two children).
      </p>
      <p className='text-[#0E424E] text-[16px] md:text-[20px] font-[400] max-w-[95%] md:max-w-[80%] mx-auto mt-2'>
      As our thank-you, you&apos;ll also receive a Bonus Vacation Gift — your choice of:
      </p>
      <ul className="list-disc list-inside text-[#0E424E] text-[14px] md:text-[18px] font-[400]">
        <li>A Cruise Getaway (4–7 nights)</li>
        <li>A 7-Night Resort Condo Stay</li>
        <li>A Hotel Escape + $100 Hotel Perks Card</li>
      </ul>
      <p className='text-[#0E424E] text-[16px] font-bold md:text-[20px] font-[400] max-w-[95%] md:max-w-[80%] mx-auto'>
      Catch the Wave. Make it yours. Make it easy. That&apos;s My Discover Vacation.
      </p>
    </div>,
    <div key="included" className="bg-gray-100 p-4 md:p-8 text-center flex flex-col gap-4 rounded">
      <h2 className="text-[#0E424E] font-[500] text-[24px] md:text-[36px]">What&apos;s Included</h2>
      <ul className="list-disc list-inside text-[#0E424E] text-[16px] md:text-[20px] font-[400]">
        <li>3 nights hotel accommodations for two adults</li>
        <li>Exclusive perks during your stay</li>
        <li>Bonus vacation gift</li>
      </ul>
    </div>,
    <div key="attractions" className="bg-gray-100 p-4 md:p-8 text-center flex flex-col gap-4 rounded">
      <h2 className="text-[#0E424E] font-[500] text-[24px] md:text-[36px] mb-2">
        Nearby Attractions
      </h2>
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-center mx-auto max-w-3xl">
        <ul className="list-disc list-inside text-[#0E424E] text-[16px] md:text-[20px] font-[400] text-left">
          <li>Universal Studios</li>
          <li>Walt Disney World</li>
          <li>Volcano Bay</li> 
          <li>Universal Citywalk</li>
          <li>SeaWorld Orlando</li>
        </ul>
        <ul className="list-disc list-inside text-[#0E424E] text-[16px] md:text-[20px] font-[400] text-left">
          <li>Old Town Theme Park</li>
          <li>Pirates Dinner Adventure</li>
          <li>Buccaneer Adventure Park</li>
          <li>Pineapple Pete Kids Park</li>
          <li>Rocky Falls Adventure Golf</li>
        </ul>
      </div>
    </div>,
    <div key="notes" className="bg-gray-100 p-4 md:p-8 text-center flex flex-col gap-4 rounded">
      <h1 className="text-[#0E424E] font-[500] text-[24px] md:text-[36px]">Travel Notes</h1>
      <p className="text-[#0E424E] text-[16px] md:text-[20px] font-[400] max-w-[95%] md:max-w-[80%] mx-auto">
        *Travel for the Orlando getaway must be completed within 12 months of
        purchase. Bonus travel must be registered within 6 months of issue and
        completed within 18 months. Government taxes, fees, upgrades, and resort
        charges vary by destination and selection. Travelers are responsible for
        government taxes, resort fees, and optional upgrades
      </p>
    </div>,
    <div key="gift" className="grid grid-cols-1 sm:grid-cols-3">
      <div className="rounded-[10px]">
        <div className="bg-[#F2B233] py-1 text-white font-[500] text-[21px] flex justify-center items-center gap-3 rounded-t-[10px]">
          <span>
            <FaGift />
          </span>
          <span>Choice A</span>
        </div>
        <div className="bg-gray-100 flex items-center justify-center p-5 rounded-b-[10px] min-h-[180px] md:min-h-[280px]">
          <p className="font-[400] text-[16px] md:text-[20px] text-[#0E424E] text-center px-6">
            4,5 or 7- Night Cruise aboard Carnival, NCL or Royal Caribbean for
            two adults.
          </p>
        </div>
      </div>
    </div>,
  ];

  return (
    <div>
      <div className="flex mb-12 border-b border-[#135868] overflow-x-auto scrollbar-hide md:overflow-x-visible md:scrollbar-default gap-2 md:gap-0" style={{WebkitOverflowScrolling: 'touch'}}>
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
      <div>{tabContents[active]}</div>
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    tags
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
