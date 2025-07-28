import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, useParams, type MetaFunction} from 'react-router';
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
import {useState, useEffect} from 'react';
import {FaCheck, FaGift} from 'react-icons/fa';
import {useNavigate, useRouteLoaderData} from 'react-router';
import FooterCarousel from '~/components/FooterCarousel';
import {Suspense} from 'react';
import {Await} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import cartIcon from '/assets/icon-cart.svg';
import VacationProcess from '~/components/VacationProcess';

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

  const {context} = args;
  // Fetch upsell products
  const UPSELL_PRODUCTS_QUERY = `#graphql
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
    query UpsellProducts($query: String!) {
      products(first: 6, query: $query) {
        nodes {
          ...ProductItem
        }
      }
    }
  `;
  const upsellRes = await context.storefront.query(UPSELL_PRODUCTS_QUERY, {
    variables: {query: 'tag:upsell'},
  });
  const upsellProducts = upsellRes?.products?.nodes || [];

  return {...deferredData, ...criticalData, upsellProducts};
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

// Add useCountdown hook (copy from cart)
function useCountdown(targetTime: string | null) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  useEffect(() => {
    if (!targetTime) return;
    const interval = setInterval(() => {
      const diff = new Date(targetTime).getTime() - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  return {hours, minutes, seconds, expired: timeLeft <= 0};
}

export default function Product() {
  const {product, upsellProducts} = useLoaderData<typeof loader>();
  const images = product.images?.nodes || [];
  const mainImage =
    product.selectedOrFirstAvailableVariant?.image?.url ||
    '/assets/orlando.jpg';
  const mainImageAlt =
    product.selectedOrFirstAvailableVariant?.image?.altText || product.title;
  const price = product.selectedOrFirstAvailableVariant?.price?.amount || '0';

  // Use all product images, fallback to variant image if none
  const slides =
    images.length > 0
      ? images.map((img: {url: string; altText?: string}) => ({
          src: img.url,
          alt: img.altText || product.title,
        }))
      : [{src: mainImage, alt: mainImageAlt}];

  const [current, setCurrent] = useState(0);
  const length = slides.length;

  // Auto-scroll effect
  useEffect(() => {
    if (length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [length]);

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
  const rootData = useRouteLoaderData('root');

  const {handle} = product;
  // Timer logic: persistent per product handle
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  useEffect(() => {
    if (!handle) return;
    const key = `offerExpiresAt_${handle}`;
    let stored = null;
    if (typeof window !== 'undefined') {
      stored = localStorage.getItem(key);
    }
    let expires: string;
    if (stored && new Date(stored).getTime() > Date.now()) {
      expires = stored;
    } else {
      expires = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, expires);
      }
    }
    setExpiresAt(expires);
  }, [handle]);
  const {hours, minutes, seconds, expired} = useCountdown(expiresAt);

  return (
    <div className="mx-auto md:mt-20">
      {/* Offer Expires Section */}

      <div className="md:grid grid-cols-[1.5fr_1fr] min-h-[528px] max-w-7xl mx-auto">
        <div className="h-full relative">
          {/* Carousel with indicators at top left */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Indicator Dots Top Left */}
            <div className="absolute top-4 left-4 flex gap-3 z-10">
              {slides.map((_: unknown, idx: number) => (
                <span
                  key={idx}
                  className={
                    current === idx
                      ? 'w-8 h-4 rounded-md inline-block bg-[#C6F0F0] border border-[#C6F0F0]'
                      : 'w-4 h-4 rounded-full inline-block bg-white border border-[#C6F0F0]'
                  }
                />
              ))}
            </div>
            {/* Carousel Image */}
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={slides[current].src}
                alt={slides[current].alt}
                className="md:h-full h-[500px] w-full object-cover rounded-lg"
                style={{transition: 'opacity 0.3s'}}
              />
            </div>
          </div>
        </div>
        <div className="px-4 md:px-0 md:relative">
          <div className="bg-[#2ab7b7] md:absolute md:-top-10.5 md:w-full mt-8 md:mt-0 py-2 flex items-center justify-center rounded-t-lg">
            <span className="font-semibold text-[#135868] text-[18px] mr-4">
              Offer Expires:
            </span>
            <span className="font-mono text-[#135868] text-[18px] flex items-center gap-1">
              {expired ? (
                <span className="text-red-500">Expired</span>
              ) : (
                <>
                  <span>{String(hours).padStart(2, '0')}</span>
                  <span className="text-[12px] mx-1">HR</span>
                  <span>:</span>
                  <span>{String(minutes).padStart(2, '0')}</span>
                  <span className="text-[12px] mx-1">MIN</span>
                  <span>:</span>
                  <span>{String(seconds).padStart(2, '0')}</span>
                  <span className="text-[12px] mx-1">SEC</span>
                </>
              )}
            </span>
          </div>
          <div className="bg-[#F5F5F5] py-8 px-10 md:h-full">
            <h1 className="uppercase font-[800] text-[24px]">
              {product.title}
            </h1>
            <p className="font-[400] text-[20px] text-[#070707] opacity-70">
              {product.vendor || ''}
            </p>
            <div className="bg-white rounded-[10px] my-4 p-3 flex flex-col items-center mb-8">
              <span className="text-[#0E424E] font-[400] text-[13px]">
                4 days / 3 nights
              </span>
              <div className="flex items-center justify-center gap-1">
                <span className="text-[#135868] font-[500] text-[27px]">
                  ${Math.round(price)}
                </span>
                <span className="text-[#135868] font-[500] text-[12px]">
                  per couple or
                  <br /> family of four
                </span>
              </div>
              <span className="text-[#0E424E] font-[400] text-[13px]"></span>
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
            <div className="bg-gradient-to-r from-[#f2b233] to-[#FFE7B8] rounded-[8px] px-3 py-1 mb-10 flex gap-2 items-start justify-center">
              <FaGift className="min-w-4 mt-1" />
              <span className="text-[16px] font-[400] text-[#08252C]">
                Includes a Bonus Vacation: Choice Vacation Getaway (valued at
                $300+)
              </span>
            </div>
            {/* <Link to="/contact-us">
              <p className="underline my-8 cursor-pointer">
                Need Help? Contact Us
              </p>
            </Link> */}
            <Suspense fallback={<div>Loading cart...</div>}>
              <Await resolve={rootData.cart}>
                {(originalCart) => {
                  const cart = useOptimisticCart(originalCart);
                  const cartCount = cart?.totalQuantity ?? 0;
                  const cartIsEmpty = !cartCount || cartCount === 0;
                  return (
                    <form
                      method="post"
                      action="/cart"
                      className="w-full flex items-center"
                    >
                      <input
                        type="hidden"
                        name="variantId"
                        value={product.selectedOrFirstAvailableVariant?.id}
                      />
                      <input
                        type="hidden"
                        name="offerTitle"
                        value={product.title}
                      />
                      <input
                        type="hidden"
                        name="offerImage"
                        value={mainImage}
                      />
                      <input type="hidden" name="offerPrice" value={price} />
                      <input
                        type="hidden"
                        name="offerDescription"
                        value={product.description || ''}
                      />
                      <input
                        type="hidden"
                        name="offerLocation"
                        value={
                          Array.isArray(product.tags)
                            ? product.tags.find((t: string) =>
                                t.match(/,|FL|PA/),
                              ) || ''
                            : ''
                        }
                      />
                      <input
                        type="hidden"
                        name="offerNights"
                        value={product.nights || 3}
                      />
                      <input
                        type="hidden"
                        name="offerDays"
                        value={product.days || 4}
                      />
                      <button
                        type="submit"
                        className={`bg-gradient-to-r from-[#2AB7B7] to-[#196C6C] rounded w-full flex gap-2 items-center justify-center text-white px-4 py-2 hover:bg-[#229a9a] ${!cartIsEmpty ? 'pointer-events-none opacity-70' : ''}`}
                        disabled={!cartIsEmpty}
                        title={
                          !cartIsEmpty
                            ? 'Only one offer can be added to cart at a time'
                            : undefined
                        }
                      >
                        <img src={cartIcon} alt="" className="size-6" />
                        <span className="text-[16px] font-[600]">
                          {cartIsEmpty
                            ? 'Save My Deal Now'
                            : 'Only one deal can be added to cart at a time'}
                        </span>
                      </button>
                    </form>
                  );
                }}
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
      {/* tab section  */}
      <div className="my-8 mx-auto max-w-7xl">
        <Tabs upsellProducts={upsellProducts} />
      </div>
      {/* Vacation Booking curly line  */}
      <VacationProcess />

      {/* carousel  */}
      <FooterCarousel />
    </div>
  );
}

function Tabs({upsellProducts}: {upsellProducts: any[]}) {
  const {handle} = useParams<{handle: string}>(); // Extract the handle from the URL
  const [active, setActive] = useState(0);

  const tabs = [
    'Overview',
    `What's Included`,
    'Nearby Attractions',
    'Details',
    'Bonus Details',
  ];

  // Define dynamic content based on the handle
  const tabContents = [
    <div
      key="overview"
      className="bg-gray-100 p-4 md:p-8 text-center flex flex-col gap-4 rounded"
    >
      <h1 className="text-[#0E424E] font-[500] text-[24px] md:text-[36px]">
        {handle === 'orlando'
          ? '🌾 Discover Orlando – 4 Days / 3 Nights + Vacation Bonus'
          : '🌾 Poconos Mountain Getaway – 4 Days / 3 Nights'}
      </h1>
      <p className="text-[#0E424E] text-[16px] md:text-[20px] font-[400] max-w-[95%] md:max-w-[85%] mx-auto">
        {handle === 'orlando' ? (
          <div>
            Start your My Discover Vacation in the heart of Orlando with 4 days
            and 3 nights of fun, sun, and memory-making.
            <br />
            <br />
            Enjoy a relaxing vacation stay in comfortable, convenient
            accommodations with cozy beds, free Wi-Fi, and thoughtful extras
            like in-room coffee and mini fridges. Trusted brands and friendly
            service - perfect for your getaway.
          </div>
        ) : (
          'Escape to the peaceful beauty of the Pocono Mountains with a 4-Day / 3-Night vacation designed for two adults. Cozy accommodations at participating hotels provide the perfect setting for a relaxing weekend, nature exploration, or a scenic escape.'
        )}
      </p>
      <p className="text-[#0E424E] text-[16px] md:text-[20px] font-[400] max-w-[95%] md:max-w-[80%] mx-auto mt-2">
        As our thank-you, you'll also receive a Vacation Bonus — your choice of:
      </p>
      <ul className="list-disc list-inside text-[#0E424E] text-[14px] md:text-[18px] font-[400]">
        <li>A Cruise Getaway (4–7 nights)</li>
        <li>A 7-Night Resort Condo Stay</li>
        <li>A Hotel Escape + $100 Hotel Perks Card</li>
      </ul>
      <p className="text-[#0E424E] text-[16px] md:text-[20px] font-[400] max-w-[95%] md:max-w-[80%] mx-auto">
        Catch the Wave. Make it yours. Make it easy. That&apos;s My Discover
        Vacation.
      </p>
    </div>,
    <div
      key="included"
      className="bg-gray-100 p-4 md:p-8 flex flex-col gap-4 rounded"
    >
      {handle === 'orlando' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
            <div>
              <h2 className="text-[#0E424E] font-[500] text-[24px] md:text-[36px] mb-3">
                What&apos;s Included
              </h2>
              <p className="text-[#0E424E] text-[16px] md:text-[20px] font-[400] font-avenir mb-4">
                🏨 3 Nights, One Unforgettable Stay — Relax, Recharge, and
                Explore with Room for Up to Four!
              </p>
              <p className="text-[#0E424E] text-[16px] md:text-[20px] font-[400] font-avenir mb-4">
                🎁 Bonus Vacation – CHOICE Getaway - Pick one of these premium
                rewards (airfare not included):
              </p>
              <ul className="list-disc list-inside text-[#0E424E] text-[16px] md:text-[20px] font-[400] font-avenir">
                <li>
                  Cruise for Two – 4–7 nights aboard Carnival, Royal Caribbean,
                  or similar
                </li>
                <li>
                  Hotel Stay – 4-day/3-night U.S. stay + $100 in perks, 1,000+
                  hotel options
                </li>
                <li>
                  Resort Condo Stay – 7 nights for up to 4 travelers in the
                  U.S., Mexico, or Caribbean
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-[#0E424E] font-[500] text-[24px] md:text-[36px] mb-3">
                VACATIONS MADE POSSIBLE
              </h2>
              <p className="text-[#0E424E] text-[16px] md:text-[20px] font-[400] font-avenir">
                 In partnership with top vacation resorts, this package includes
                a presentation at one of our partner resorts during your stay —
                it’s what makes these incredible perks possible.
                <br />
                <br />
                ✨ Deeply discounted accommodations.
                <br />
                🎁 A bonus vacation valued up to $1,800.
                <br />
                🌍 Travel insights that can help you vacation better, more
                often, and for less.
                <br />
                No pressure. No catch. Just great perks in return for your time.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
            <div>
              <h2 className="text-[#0E424E] font-[500] text-[24px] md:text-[36px] mb-3">
                What&apos;s Included
              </h2>
              <p className="text-[#0E424E] text-[16px] md:text-[20px] font-[400] font-avenir mb-4">
                🏨 3 Nights, One Unforgettable Stay — Relax, Recharge, and
                Explore with Room for Up to Four!
              </p>
              <ul className="list-disc list-inside text-[#0E424E] text-[16px] md:text-[20px] font-[400] font-avenir">
                <li>
                  4 Days / 3 Nights of hotel accommodations for two adults
                </li>
                <li>Packages starting at just $49 per couple</li>
                <li>Bonus vacation of your choice</li>
              </ul>
            </div>
            <div>
              <h2 className="text-[#0E424E] font-[500] text-[24px] md:text-[36px] mb-3">
                VACATIONS MADE POSSIBLE
              </h2>
              <p className="text-[#0E424E] text-[16px] md:text-[20px] font-[400] font-avenir">
                 In partnership with top vacation resorts, this package includes
                a presentation at one of our partner resorts during your stay —
                it’s what makes these incredible perks possible.
                <br />
                <br />
                ✨ Deeply discounted accommodations.
                <br />
                🎁 A bonus vacation valued up to $1,800.
                <br />
                🌍 Travel insights that can help you vacation better, more
                often, and for less.
                <br />
                No pressure. No catch. Just great perks in return for your time.
              </p>
            </div>
          </div>
        </>
      )}
    </div>,
    <div
      key="attractions"
      className="bg-gray-100 p-4 md:p-8 text-center flex flex-col gap-4 rounded"
    >
      <h2 className="text-[#0E424E] font-[500] text-[24px] md:text-[36px] mb-2">
        Nearby Attractions
      </h2>
      {handle === 'orlando' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[#0E424E] font-avenir text-[16px] md:text-[20px] font-[400] max-w-5xl mx-auto">
            <div className="flex flex-col items-start">
              <p className="text-start">🎬 Universal Studios</p>
              <p className="text-[16px] text-start">
                Movie-themed rides & live shows
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">🎢 Major Theme Parks</p>
              <p className="text-[16px] text-start">
                Roller coaster rides, fun parks
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">‍🧜️ SeaWorld Orlando</p>
              <p className="text-[16px] text-start">
                Marine shows, coasters & events
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">🎡 Walt Disney World</p>
              <p className="text-[16px] text-start">
                4 parks including Magic Kingdom{' '}
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">🎟️ Entertainment </p>
              <p className="text-[16px] text-start">
                4 parks including Magic Kingdom{' '}
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">🛍️ Old Town</p>
              <p className="text-[16px] text-start">
                Retro rides, bars & live music
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">🌋 Volcano Bay</p>
              <p className="text-[16px] text-start">
                Tropical water park with thrilling slides
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">🍷 Disney Springs</p>
              <p className="text-[16px] text-start">
                Dining, nightlife & upscale shopping experiences
              </p>
            </div>
            <div className="hidden md:flex flex-col items-start">
              <p className="text-start"></p>
              <p className="text-[16px] text-start"></p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">🌆 Universal Citywalk™</p>
              <p className="text-[16px] text-start">
                Adult-friendly nightlife, dining
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">🎭 Pirates Dinner Adventure</p>
              <p className="text-[16px] text-start">
                Interactive dinner show for all ages
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[#0E424E] font-avenir text-[16px] md:text-[20px] font-[400] max-w-5xl mx-auto">
            <div className="flex flex-col items-start">
              <p className="text-start">🏞️ Delaware Water Gap</p>
              <p className="text-[16px] text-start">
                Scenic hiking, waterfalls & river views
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">⛷️ Camelback Mountain</p>
              <p className="text-[16px] text-start">
                Skiing, snow tubing & mountain adventures
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">🛶 Lake Wallenpaupack</p>
              <p className="text-[16px] text-start">
                Boating, fishing & lakeside fun
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">🎰 Mount Airy Casino Resort</p>
              <p className="text-[16px] text-start">
                Gaming, dining & live entertainment
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">🎢 Kalahari Resorts </p>
              <p className="text-[16px] text-start">
                Indoor waterpark, spa & family fun
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">🚠 Blue Mountain Resort</p>
              <p className="text-[16px] text-start">
                Winter sports & summer ziplining
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">🎯 The Crossings Premium Outlets</p>
              <p className="text-[16px] text-start">
                Name-brand shopping deals
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">🌲 Bushkill Falls</p>
              <p className="text-[16px] text-start">
                "The Niagara of Pennsylvania" — waterfalls & trails
              </p>
            </div>
            <div className="hidden md:flex flex-col items-start">
              <p className="text-start"></p>
              <p className="text-[16px] text-start"></p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">🐻 Claws 'N' Paws Wild Animal Park</p>
              <p className="text-[16px] text-start">
                Petting zoo, animal encounters & wildlife fun
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-start">
                🏡 Quiet Valley Living Historical Farm
              </p>
              <p className="text-[16px] text-start">
                Step back in time with 1800s farm life tours
              </p>
            </div>
          </div>
        </>
      )}
    </div>,
    <div
      key="details"
      className="bg-gray-100 p-4 md:p-8 text-center flex flex-col gap-4 rounded"
    >
      <h1 className="text-[#0E424E] font-[500] text-[24px] md:text-[36px]">
        🌊 Catch the Details
      </h1>
      <p className="text-[#0E424E] text-[16px] md:text-[20px] font-[400] max-w-[95%] md:max-w-[80%] mx-auto">
        {handle === 'orlando' ? (
          <>
            <ul className="list-disc list-inside text-[#0E424E] text-[16px] md:text-[20px] font-[400] text-center font-avenir">
              <li>
                We’re all about making travel easy — and giving you plenty of
                time to enjoy it. Here are a few helpful things to know after
                you book:
              </li>
              <li>
                Once you purchase your getaway, you’ll have up to 12 months to
                travel.
              </li>
              <li>
                Your Bonus Getaway will be provided after you complete your
                vacation.
              </li>
              <li>
                You’ll have 6 months to register your bonus getaway, and 18
                months to travel, giving you lots of flexibility to plan your
                next adventure.
              </li>
              <li>
                Optional upgrades, extended stays, and enhancements are
                available during booking — it’s your trip, your way.
              </li>
              <li>
                Taxes, resort fees, and optional add-ons vary depending on your
                selected destination.
              </li>
            </ul>
            <p className="font-avenir mt-2">
              Still have questions? Explore our FAQs for more details on travel
              timelines, booking, and what to expect.
            </p>
          </>
        ) : (
          <>
            <ul className="list-disc list-inside text-[#0E424E] text-[16px] md:text-[20px] font-[400] text-center font-avenir">
              <li>
                We’re all about making travel easy — and giving you plenty of
                time to enjoy it. Here are a few helpful things to know after
                you book:
              </li>
              <li>
                Once you purchase your getaway, you’ll have up to 12 months to
                travel.
              </li>
              <li>
                Your Bonus Getaway will be provided after you complete your
                vacation.
              </li>
              <li>
                You’ll have 6 months to register your bonus getaway, and 18
                months to travel, giving you lots of flexibility to plan your
                next adventure.
              </li>
              <li>
                Optional upgrades, extended stays, and enhancements are
                available during booking — it’s your trip, your way.
              </li>
              <li>
                Taxes, resort fees, and optional add-ons vary depending on your
                selected destination.
              </li>
            </ul>
            <p className="font-avenir mt-2">
              Still have questions? Explore our FAQs for more details on travel
              timelines, booking, and what to expect.
            </p>
          </>
        )}
      </p>
    </div>,
    <div key="gift">
      <h1 className="text-[#0E424E] font-[500] text-[24px] md:text-[36px] flex items-center justify-center gap-4 mb-3">
        <FaGift /> Your Bonus, Your Choice!
      </h1>
      <p className="text-[#676767] font-avenir text-[16px] md:text-[20px] mb-6 text-center max-w-5xl mx-auto">
        Your Bonus Vacation is included with your purchase today — it's the
        vacation after your vacation! You'll choose your favorite at checkout
        and unlock it after completing your Featured Getaway. Catch the wave,
        enjoy the journey, and discover just how rewarding travel can be.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {upsellProducts.length > 0 ? (
          upsellProducts.map((product: any, idx: number) => (
            <div
              key={product.id}
              className="rounded-[10px] bg-white shadow flex flex-col"
            >
              <div className="bg-[#F2B233] py-1 text-[#071F24] font-[500] text-[21px] flex justify-center items-center gap-3 rounded-t-[10px]">
                <span>
                  <FaGift />
                </span>
                <span>{product.title}</span>
              </div>
              <div className="relative bg-gray-100 min-h-[180px] md:min-h-[280px] overflow-hidden flex items-center justify-center rounded-b-[10px]">
                <img
                  src={product.featuredImage?.url || '/assets/orlando.jpg'}
                  alt={product.title}
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute bottom-0 w-full bg-white/20 backdrop-blur-md py-4 px-2">
                  <p className="font-[400] text-[16px] text-[#FEFEFE] text-center">
                    {product.description?.split('\n')[0]}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500 py-12">
            No upsell gifts available.
          </div>
        )}
      </div>
    </div>,
  ];

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
            className={`flex-1 min-w-[48%] md:min-w-0 px-2 md:px-4 py-2 font-[500] text-[16px] md:text-[21px] border-b-2 transition text-[#1A202C] opacity-60 whitespace-nowrap ${
              active === idx
                ? 'border-[#135868] text-[#135868] opacity-100'
                : 'border-transparent bg-transparent'
            }`}
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
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
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
