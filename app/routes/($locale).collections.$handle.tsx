import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  type MetaFunction,
  useAsyncValue,
  useLoaderData,
  useRouteLoaderData,
} from 'react-router';
import {Analytics, useOptimisticCart} from '@shopify/hydrogen';
import {Await, Link} from 'react-router';
import {Suspense, useState} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {OfferCard} from '~/components/OfferCard';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{ title: `${data?.collection.title ?? ''} Collection` }];
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
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, first: 50},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData('root') as
    | {cart?: Promise<CartApiQueryFragment | null>}
    | undefined;

  return (
    <div>
      <div
        className="w-full flex items-center justify-center px-2 md:px-0 py-8 md:py-0 relative"
        style={{
          backgroundImage: `url('${collection.image?.url || '/assets/discoverImage.png'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center max-w-4xl px-4">
          <p className="font-[500] text-[12px] md:text-[14px]">
            Curated vacation experiences
          </p>
          <h1 className="font-[800] text-[28px] md:text-[46px] uppercase">
            {collection.title}
          </h1>
          <p className="max-w-3xl font-[400] text-[13px] md:text-[16px] text-center">
            {collection.description ||
              'Explore this destination collection and discover vacation offers designed for every travel style.'}
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
          className="hidden md:block absolute top-10 -right-20 opacity-30 w-[280px]"
        />
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-[61px] font-[500] text-center mb-4 text-[#0E424E]">
            Discover Your Next Vacation
          </h2>
          <p className="font-[400] text-[20px] text-[#101010] mx-auto max-w-3xl text-center mb-10">
            Discover a collection of vacations
          </p>

          {rootData?.cart ? (
            <Suspense fallback={<div>Loading offers...</div>}>
              <Await resolve={rootData.cart}>
                <CollectionOffersTabs products={collection.products.nodes} />
              </Await>
            </Suspense>
          ) : (
            <CollectionOffersGrid
              products={collection.products.nodes}
              cartIsEmpty={true}
            />
          )}
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
          <img
            src="/assets/wavePattern.png"
            alt=""
            className="hidden md:block w-[176px]"
          />
        </div>
      </section>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

function CollectionOffersTabs({products}: {products: any[]}) {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  const cartCount = cart?.totalQuantity ?? 0;
  const cartIsEmpty = !cartCount || cartCount === 0;

  const [active, setActive] = useState(0);
  const tabs = ['All Offers', 'Exclusive Deals'];

  const filteredProducts =
    active === 0
      ? products
      : products.filter(
          (product) =>
            Array.isArray(product.tags) && product.tags.includes('Exclusive'),
        );

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
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      <CollectionOffersGrid products={filteredProducts} cartIsEmpty={cartIsEmpty} />
    </div>
  );
}

function CollectionOffersGrid({
  products,
  cartIsEmpty,
}: {
  products: any[];
  cartIsEmpty: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {products.length > 0 ? (
        products.map((product) => (
          <OfferCard key={product.id} product={product} cartIsEmpty={cartIsEmpty} />
        ))
      ) : (
        <div className="col-span-3 text-center text-gray-500 py-12">
          No offers found in this collection.
        </div>
      )}
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    description
    tags
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
    bonusVacationLine: metafield(namespace: "custom", key: "bonus_vacation_line") {
      value
    }
    variants(first: 1) {
      nodes {
        id
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        id
        url
        altText
      }
      products(first: $first) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
