import {useState} from 'react';
import {FaCheck, FaGift} from 'react-icons/fa6';
import {IoDiamond} from 'react-icons/io5';
import {Link, useLoaderData} from 'react-router';
import {OfferCard} from '~/components/OfferCard';

export async function loader({context}: any) {
  const PRODUCTS_QUERY = `#graphql
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
    query PoconosProducts($query: String!) {
      products(first: 20, query: $query) {
        nodes {
          ...ProductItem
        }
      }
    }
  `;
  const res = await context.storefront.query(PRODUCTS_QUERY, {
    variables: {query: 'tag:Poconos'},
  });
  return {products: res?.products?.nodes || []};
}

export default function ProductDetail() {
  const {products} = useLoaderData<typeof loader>();
  return (
    <div>
      <div
        className="w-full flex items-center justify-center px-2 md:px-0 py-8 md:py-0"
        style={{
          backgroundImage: `url('/assets/poconosCover.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div className="flex flex-col items-center">
          <p className="font-[500] text-[12px] md:text-[14px]">
            Nature, Comfort, and Cozy Escapes
          </p>
          <h1 className="font-[800] text-[28px] md:text-[46px]">
            {' '}
            OFFERS IN POCONOS, PA
          </h1>
          <p className="max-w-3xl font-[400] text-[13px] md:text-[16px] text-center">
            Discover all-season vacation offers in the heart of the Poconos.
            Whether it’s a romantic cabin, a spa weekend, or a mountain
            adventure, enjoy a smooth booking process and exceptional value.
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
          className="hidden md:block absolute top-10 -right-12 opacity-30 w-[280px]"
        />
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-[61px] font-[500] text-center mb-4 text-[#0E424E]">
            Discover Your Next Vacation
          </h2>
          <p className="font-[400] text-[20px] text-[#676767] mx-auto max-w-3xl text-center mb-10">
            Discover a collection of vacations
          </p>
          {/* Tabs */}
          <Tabs products={products} />
        </div>

        <div className="flex justify-center mt-[4rem] mb-8">
          <Link
            to={'/discover-offers'}
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
    </div>
  );
}

function Tabs({products}: {products: any[]}) {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <OfferCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500 py-12">
            No offers found for this tab.
          </div>
        )}
      </div>
    </div>
  );
}
