import {useEffect, useRef, useState} from 'react';
import {IoDiamond} from 'react-icons/io5';
import {FaCheck, FaGift} from 'react-icons/fa6';
import {Link, useLoaderData, useNavigate} from 'react-router';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {OfferCard} from '~/components/OfferCard';

// --- GraphQL fragment and query ---
const PRODUCT_FRAGMENT = `#graphql
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

const DISCOVER_OFFERS_QUERY = `#graphql
  query DiscoverOffers(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first) {
        nodes {
          ...ProductItem
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

// --- Loader ---
export async function loader({context, request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  // Support multi-select for destination and vacationType
  const destinationParam = url.searchParams.get('destination');
  const vacationTypeParam = url.searchParams.get('vacationType');
  const destinationsSelected = destinationParam
    ? destinationParam.split(',')
    : [];
  const vacationTypesSelected = vacationTypeParam
    ? vacationTypeParam.split(',')
    : [];
  const min = Number(url.searchParams.get('min') || 0);
  const max = Number(url.searchParams.get('max') || 10000);
  const sort = url.searchParams.get('sort') || 'Price';

  // Fetch all products in the collection
  const {collection} = await context.storefront.query(DISCOVER_OFFERS_QUERY, {
    variables: {
      handle: 'vacation-package',
      first: 50, // adjust as needed
    },
  });

  // Handle missing collection gracefully
  if (!collection || !collection.products || !collection.products.nodes) {
    return {
      products: [],
      destinations: [],
      vacationTypes: [],
      maxProductPrice: 10000,
      selected: {
        destination: [],
        vacationType: [],
        min,
        max,
        sort,
      },
    };
  }

  let allProducts = collection.products.nodes;

  // --- Extract filter options BEFORE filtering ---
  const allTags = allProducts.flatMap((p: any) => p.tags);
  const destinations = Array.from(
    new Set(allTags.filter((t: string) => t.match(/,|FL|PA/))),
  );
  const vacationTypes = Array.from(
    new Set(allTags.filter((t: string) => t === 'Hotels' || t === 'Cruise')),
  );

  // --- Filtering ---
  let products = allProducts;
  if (destinationsSelected.length > 0) {
    products = products.filter((p: any) =>
      destinationsSelected.some((d) => p.tags.includes(d)),
    );
  }
  if (vacationTypesSelected.length > 0) {
    products = products.filter((p: any) =>
      vacationTypesSelected.some((v) => p.tags.includes(v)),
    );
  }
  products = products.filter(
    (p: any) =>
      Number(p.priceRange.minVariantPrice.amount) >= min &&
      Number(p.priceRange.maxVariantPrice.amount) <= max,
  );

  // --- Sorting ---
  if (sort === 'Price') {
    products = products.sort(
      (a: any, b: any) =>
        Number(a.priceRange.minVariantPrice.amount) -
        Number(b.priceRange.minVariantPrice.amount),
    );
  } else if (sort === 'Popularity') {
    // You can implement popularity logic if you have metafields or sales data
  } else if (sort === 'Rating') {
    // You can implement rating logic if you have metafields or reviews
  }

  // For price slider UI
  const maxProductPrice = Math.max(
    ...allProducts.map((p: any) => Number(p.priceRange.maxVariantPrice.amount)),
    10000,
  );

  return {
    products,
    destinations,
    vacationTypes,
    maxProductPrice,
    selected: {
      destination: destinationsSelected,
      vacationType: vacationTypesSelected,
      min,
      max,
      sort,
    },
  };
}

// --- Main Component ---
export default function DiscoverOfferPage() {
  const {products, destinations, vacationTypes, maxProductPrice, selected} =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const mainDivRef = useRef<HTMLDivElement>(null);

  // --- Filter state (controlled by URL) ---
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    selected.destination || [],
  );
  const [selectedVacationTypes, setSelectedVacationTypes] = useState<string[]>(
    selected.vacationType || [],
  );
  const [inputValues, setInputValues] = useState<{min: string; max: string}>({
    min: String(selected.min ?? 0),
    max: String(selected.max ?? maxProductPrice),
  });
  const [priceRange, setPriceRange] = useState<{min: number; max: number}>({
    min: selected.min ?? 0,
    max: selected.max ?? maxProductPrice,
  });
  const [sort, setSort] = useState(selected.sort || 'Price');
  const rangeRef = useRef<HTMLDivElement>(null);
  const rangeTrackRef = useRef<HTMLDivElement>(null);
  const minThumbRef = useRef<HTMLDivElement>(null);
  const maxThumbRef = useRef<HTMLDivElement>(null);
  // Track if user is dragging slider
  const [isDragging, setIsDragging] = useState(false);

  // Update URL on filter change (except price slider drag)
  useEffect(() => {
    if (isDragging) return;
    const params = new URLSearchParams();
    if (selectedDestinations.length > 0)
      params.set('destination', selectedDestinations.join(','));
    if (selectedVacationTypes.length > 0)
      params.set('vacationType', selectedVacationTypes.join(','));
    params.set('min', String(priceRange.min));
    params.set('max', String(priceRange.max));
    params.set('sort', sort);
    navigate(`?${params.toString()}`, {replace: true});
    // Scroll to main offers div after filter change
    setTimeout(() => {
      if (mainDivRef.current) {
        const topOffset = 120; // height of the navbar
        const elementPosition = mainDivRef.current.getBoundingClientRect().top;
        const offsetPosition = window.scrollY + elementPosition - topOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 400);
    // eslint-disable-next-line
  }, [
    selectedDestinations,
    selectedVacationTypes,
    priceRange,
    sort,
    isDragging,
  ]);

  // Handle checkbox changes
  const handleDestinationChange = (d: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d],
    );
  };
  const handleVacationTypeChange = (v: string) => {
    setSelectedVacationTypes((prev) =>
      prev.includes(v) ? prev.filter((item) => item !== v) : [...prev, v],
    );
  };
  // Handle price input changes
  const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    setInputValues((prev) => ({...prev, [type]: value}));
    if (value !== '') {
      const numValue = parseInt(value, 10);
      if (type === 'min' && numValue <= priceRange.max) {
        setPriceRange((prev) => ({...prev, min: numValue}));
      } else if (type === 'max' && numValue >= priceRange.min) {
        setPriceRange((prev) => ({...prev, max: numValue}));
      }
    }
  };
  // Price slider UI logic (as before)
  useEffect(() => {
    const rangeEl = rangeRef.current;
    const trackEl = rangeTrackRef.current;
    const minThumb = minThumbRef.current;
    const maxThumb = maxThumbRef.current;
    if (!rangeEl || !trackEl || !minThumb || !maxThumb) return;
    const minPercent = (priceRange.min / maxProductPrice) * 100;
    const maxPercent = (priceRange.max / maxProductPrice) * 100;
    minThumb.style.left = `${minPercent}%`;
    maxThumb.style.left = `${maxPercent}%`;
    trackEl.style.left = `${minPercent}%`;
    trackEl.style.width = `${maxPercent - minPercent}%`;
  }, [priceRange, maxProductPrice]);
  const handleThumbDrag = (type: 'min' | 'max') => {
    setIsDragging(true);
    const rangeEl = rangeRef.current;
    if (!rangeEl) return;
    const rect = rangeEl.getBoundingClientRect();
    const onMouseMove = (e: MouseEvent) => {
      const pos = Math.min(
        1,
        Math.max(0, (e.clientX - rect.left) / rect.width),
      );
      const value = Math.round(pos * maxProductPrice);
      if (type === 'min') {
        const newMin = Math.min(value, priceRange.max);
        setPriceRange((prev) => ({...prev, min: newMin}));
        setInputValues((prev) => ({...prev, min: newMin.toString()}));
      } else {
        const newMax = Math.max(value, priceRange.min);
        setPriceRange((prev) => ({...prev, max: newMax}));
        setInputValues((prev) => ({...prev, max: newMax.toString()}));
      }
    };
    const onMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // --- UI ---
  return (
    <div>
      {/* Hero */}
      <div
        style={{
          backgroundImage: "url('/assets/discoverImage.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div className="flex flex-col items-center">
          <p className="font-[500] text-[14px]">Plan Less, Experience More</p>
          <h1 className="font-[800] text-[46px]">
            {' '}
            Discover Your Next Vacation
          </h1>
          <p className="max-w-3xl font-[400] text-[16px] text-center">
            Explore our handpicked vacation offers — from theme park favorites,
            sunny beaches to cozy mountain retreats — all designed to deliver
            more vacation for less. Whether you were invited to view a specific
            destination or just browsing for inspiration, every offer includes
            real value, trusted accommodations, and an easy path to booking.
          </p>
          New locations are added regularly, so check back often — or catch the
          wave with the destination that's calling you now.
        </div>
      </div>

      {/* Main discover offers  */}
      <div className="max-w-[1400px] my-7 mx-auto" ref={mainDivRef}>
        {/* Sort by */}
        <div className="flex gap-2 items-center justify-end relative">
          <p className="font-[400] text-[18px] text-[#0E424E]">Sort by</p>
          <select
            className="border border-[#2AB7B7] rounded-[10px] p-3 w-[150px]"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="Price">Price</option>
            <option value="Popularity">Popularity</option>
            <option value="Rating">Rating</option>
          </select>
        </div>

        <div className="flex gap-14 my-14">
          {/* Filters */}
          <div className="w-[400px] p-6 border border-[#E5E5E5] rounded-[10px] shadow-md">
            {/* Destination Filter */}
            <div className="mb-6">
              <h2 className="text-[#0E424E] text-[18px] font-[500] mb-4">
                Destination
              </h2>
              <div className="flex flex-col gap-2">
                {((destinations ?? []).filter(Boolean) as string[]).map((d) => (
                  <label
                    key={d}
                    className="flex items-center gap-2 text-[#1A202C] text-[16px] font-[400]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDestinations.includes(d)}
                      onChange={() => handleDestinationChange(d)}
                      className="w-4 h-4"
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>

            {/* Vacation Type Filter */}
            <div className="mb-6">
              <h2 className="text-[#0E424E] text-[18px] font-[500] mb-4">
                Vacation Type
              </h2>
              <div className="flex flex-col gap-2">
                {((vacationTypes ?? []).filter(Boolean) as string[]).map(
                  (v) => (
                    <label
                      key={v}
                      className="flex items-center gap-2 text-[#1A202C] text-[16px] font-[400]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedVacationTypes.includes(v)}
                        onChange={() => handleVacationTypeChange(v)}
                        className="w-4 h-4"
                      />
                      {v}
                    </label>
                  ),
                )}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <button
                className="text-lg mb-2 flex justify-between items-center w-full text-left"
                // Accordion logic can be added if needed
                aria-expanded={true}
                aria-controls="price-panel"
              >
                PRICE RANGE
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-down transition-transform"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </button>
              <div
                id="price-panel"
                className="space-y-4 overflow-hidden transition-all max-h-60"
              >
                {/* Inputs */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValues.min}
                    onChange={(e) =>
                      handlePriceInputChange('min', e.target.value)
                    }
                    className="border border-gray-300 px-2 py-1 w-20 text-center"
                    aria-label="Minimum price"
                  />
                  <input
                    type="text"
                    value={inputValues.max}
                    onChange={(e) =>
                      handlePriceInputChange('max', e.target.value)
                    }
                    className="border border-gray-300 px-2 py-1 w-20 text-center"
                    aria-label="Maximum price"
                  />
                </div>
                {/* Slider */}
                <div
                  className="relative h-1 bg-gray-200 rounded mt-6 mb-8 mx-2"
                  ref={rangeRef}
                >
                  <div
                    className="absolute h-1 bg-gray-500 rounded"
                    ref={rangeTrackRef}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full cursor-pointer"
                    ref={minThumbRef}
                    style={{
                      left: `${(priceRange.min / maxProductPrice) * 100}%`,
                    }}
                    onMouseDown={() => handleThumbDrag('min')}
                    role="slider"
                    aria-valuemin={0}
                    aria-valuemax={maxProductPrice}
                    aria-valuenow={priceRange.min}
                    aria-label="Minimum price slider"
                    tabIndex={0}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full cursor-pointer"
                    ref={maxThumbRef}
                    style={{
                      left: `${(priceRange.max / maxProductPrice) * 100}%`,
                    }}
                    onMouseDown={() => handleThumbDrag('max')}
                    role="slider"
                    aria-valuemin={0}
                    aria-valuemax={maxProductPrice}
                    aria-valuenow={priceRange.max}
                    aria-label="Maximum price slider"
                    tabIndex={0}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {products.length === 0 && (
              <div className="col-span-2 text-center text-red-600 font-bold py-12">
                No offers found for selected filters.
              </div>
            )}
            {products.map((product: any) => (
              <OfferCard
                key={product.id}
                product={product}
                onSelect={(prod) =>
                  navigate(
                    `/cart?title=${encodeURIComponent(prod.title)}&location=${encodeURIComponent(prod.tags?.find((t: string) => t.match(/,|FL|PA/)) || '')}&image=${encodeURIComponent(prod.featuredImage?.url || '')}&price=${prod.priceRange.minVariantPrice.amount}`,
                  )
                }
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-[4rem] mb-8">
          <button className="text-[#2AB7B7] border border-transparent hover:border-[#2AB7B7] shadow-lg bg-white px-4 py-2 text-[16px] font-[500] rounded-md">
            Show more offers
          </button>
        </div>
      </div>
    </div>
  );
}
