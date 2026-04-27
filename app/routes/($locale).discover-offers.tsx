import { Suspense } from 'react';
import {
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
  Await,
} from 'react-router';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { OfferCard } from '~/components/OfferCard';
import { useOptimisticCart } from '@shopify/hydrogen';

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
      sortKey: PRICE
      reverse: false
    ) {
      nodes {
        ...ProductItem
      }
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

// Hero section content is stored in a metaobject with handle "discover-offers-hero"
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

export async function loader({ context }: LoaderFunctionArgs) {
  const [data, heroResponse] = await Promise.all([
    context.storefront.query(DISCOVER_OFFERS_QUERY, {
      variables: { first: 250, query: 'tag:Popular' },
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

  const products = data?.products?.nodes ?? [];

  const sortedProducts = [...products].sort(
    (a: any, b: any) =>
      Number(a.priceRange.minVariantPrice.amount) -
      Number(b.priceRange.minVariantPrice.amount),
  );

  return { products: sortedProducts, hero };
}

export default function DiscoverOfferPage() {
  const { products, hero: heroData } = useLoaderData<typeof loader>();
  const hero = heroData ?? {
    eyebrow: '',
    heading: '',
    body: '',
    backgroundImageUrl: '',
  };
  const navigate = useNavigate();
  const rootData = useRouteLoaderData('root');

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

      {/* Product grid */}
      <div className="max-w-[1400px] my-7 mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-1 sm:px-0 my-14">
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
        <div className="flex justify-center mt-[4rem] mb-8">
          <button className="text-[#2AB7B7] border border-transparent hover:border-[#2AB7B7] shadow-lg bg-white px-4 py-2 text-[16px] font-[500] rounded-md">
            Show more offers
          </button>
        </div>
      </div>
    </div>
  );
}
