import { useEffect, useRef, useState, Suspense } from 'react';
import { IoDiamond } from 'react-icons/io5';
import { FaCheck, FaGift } from 'react-icons/fa6';
import {
  Link,
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
  Await,
} from 'react-router';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { OfferCard } from '~/components/OfferCard';
import { useOptimisticCart } from '@shopify/hydrogen';

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
    heroBadge: metafield(namespace: "custom", key: "hero_badge") {
      value
    }
    duration: metafield(namespace: "custom", key: "duration") {
      value
    }
    shortDescription: metafield(namespace: "custom", key: "short_description") {
      value
    }
    tcpaPolicyUrl: metafield(namespace: "custom", key: "tcpa_policy_url") {
    value
  }
  priceLabel: metafield(namespace: "custom", key: "price_label") {
      value
    }
    variants(first: 1) {
      nodes {
        id
      }
    }
  }
` as const;

const DISCOVER_OFFERS_QUERY = `#graphql
  query DiscoverOffers(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      query: $query
      sortKey: UPDATED_AT
      reverse: true
    ) {
      nodes {
        ...ProductItem
      }
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const DISCOVER_OFFERS_HERO_QUERY = `#graphql
  query DiscoverOffersHero($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: {type: "hero_section", handle: "discover-offers-hero"}) {
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
` as const;

// --- Loader ---
export async function loader({ context, request }: LoaderFunctionArgs) {
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

  // Fetch all products and the hero metaobject in parallel
  const [data, heroResponse] = await Promise.all([
    context.storefront.query(DISCOVER_OFFERS_QUERY, {
      variables: {
        first: 250,
        query: 'tag:Popular',
      },
    }),
    context.storefront.query(DISCOVER_OFFERS_HERO_QUERY, {
      cache: context.storefront.CacheShort(),
    }),
  ]);

  const heroFields = heroResponse?.metaobject?.fields ?? [];
  const heroFieldMap = Object.fromEntries(
    heroFields.map((f: any) => [f.key, f]),
  );
  const hero = {
    eyebrow: heroFieldMap.eyebrow?.value ?? '',
    heading: heroFieldMap.heading?.value ?? '',
    body: heroFieldMap.body?.value ?? '',
    backgroundImageUrl:
      heroFieldMap.background_image?.reference?.image?.url ?? '',
  };

  // Handle missing products gracefully
  if (!data?.products?.nodes) {
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

  let allProducts = data.products.nodes;

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
    hero,
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
  const { products, destinations, vacationTypes, maxProductPrice, selected, hero: heroData } =
    useLoaderData<typeof loader>();
  const hero = heroData ?? {
    eyebrow: '',
    heading: '',
    body: '',
    backgroundImageUrl: '',
  };
  const navigate = useNavigate();
  const mainDivRef = useRef<HTMLDivElement>(null);
  const rootData = useRouteLoaderData('root');

  // --- Filter state (controlled by URL) ---
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    selected.destination || [],
  );
  const [selectedVacationTypes, setSelectedVacationTypes] = useState<string[]>(
    selected.vacationType || [],
  );
  const [inputValues, setInputValues] = useState<{ min: string; max: string }>({
    min: String(selected.min ?? 0),
    max: String(selected.max ?? maxProductPrice),
  });
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
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
    navigate(`?${params.toString()}`, { replace: true });
    // Scroll to main offers div after filter change
    // setTimeout(() => {
    //   if (mainDivRef.current) {
    //     const topOffset = 120; // height of the navbar
    //     const elementPosition = mainDivRef.current.getBoundingClientRect().top;
    //     const offsetPosition = window.scrollY + elementPosition - topOffset;

    //     window.scrollTo({
    //       top: offsetPosition,
    //       behavior: 'smooth',
    //     });
    //   }
    // }, 400);
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
    setInputValues((prev) => ({ ...prev, [type]: value }));
    if (value !== '') {
      const numValue = parseInt(value, 10);
      if (type === 'min' && numValue <= priceRange.max) {
        setPriceRange((prev) => ({ ...prev, min: numValue }));
      } else if (type === 'max' && numValue >= priceRange.min) {
        setPriceRange((prev) => ({ ...prev, max: numValue }));
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
        setPriceRange((prev) => ({ ...prev, min: newMin }));
        setInputValues((prev) => ({ ...prev, min: newMin.toString() }));
      } else {
        const newMax = Math.max(value, priceRange.min);
        setPriceRange((prev) => ({ ...prev, max: newMax }));
        setInputValues((prev) => ({ ...prev, max: newMax.toString() }));
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
          backgroundImage: `url('${hero.backgroundImageUrl || '/assets/discoverImage.png'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
        }}
        className="px-4 md:px-0"
      >
        <div className="flex flex-col items-center">
          {hero.eyebrow ? (
            <p className="font-[500] text-[14px]">{hero.eyebrow}</p>
          ) : null}
          {hero.heading ? (
            <h1 className="font-[800] text-[46px]">{hero.heading}</h1>
          ) : null}
          {hero.body ? (
            <p className="max-w-3xl font-[400] text-[16px] text-center whitespace-pre-line">
              {hero.body.replace(/\\n/g, '\n')}
            </p>
          ) : null}
        </div>
      </div>

      {/* Main discover offers  */}
      <div
        className="max-w-[1400px] my-7 mx-auto px-4 md:px-0"
        ref={mainDivRef}
      >
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

        <div className="flex flex-col md:flex-row gap-14 my-14">
          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-1 sm:px-0">
            <Suspense fallback={<div>Loading cart...</div>}>
              <Await resolve={rootData.cart}>
                {(originalCart) => {
                  const cart = useOptimisticCart(originalCart);
                  const cartCount = cart?.totalQuantity ?? 0;
                  const cartIsEmpty = !cartCount || cartCount === 0;
                  return products.map((product: any) => (
                    <div key={product.id} className="py-8 md:py-0">
                      <OfferCard
                        product={product}
                        cartIsEmpty={cartIsEmpty}
                        onSelect={(prod) =>
                          navigate(
                            `/cart?title=${encodeURIComponent(prod.title)}&location=${encodeURIComponent(prod.tags?.find((t: string) => t.match(/,|FL|PA/)) || '')}&image=${encodeURIComponent(prod.featuredImage?.url || '')}&price=${prod.priceRange.minVariantPrice.amount}`,
                          )
                        }
                      />
                    </div>
                  ));
                }}
              </Await>
            </Suspense>
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
