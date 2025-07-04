import {IoDiamond} from 'react-icons/io5';
import {FaCheck, FaGift} from 'react-icons/fa6';
import {Link} from 'react-router';
import React from 'react';

export function OfferCard({
  product,
  onSelect,
  cartIsEmpty = true,
}: {
  product: any;
  onSelect?: (product: any) => void;
  cartIsEmpty?: boolean;
}) {
  // Parse description as bullet points
  const bullets = product.description
    ? product.description
        .replace(/\/n/g, '\n')
        .split(/\r?\n/)
        .filter((b: string) => b.trim().length > 0)
    : [];
  const isExclusive = product.tags.includes('Exclusive');
  return (
    <div
      className="relative bg-white rounded-lg shadow flex flex-col"
      key={product.id}
    >
      {isExclusive && (
        <div className="absolute -top-7 left-1 flex items-center justify-center gap-1 bg-[#F2B233] text-[#FEFEFE] px-2 py-1 text-[14px] font-[400] rounded">
          <IoDiamond /> <span>Exclusive Offer</span>
        </div>
      )}
      <div className="relative w-full h-[280px] rounded-t mb-4 overflow-hidden">
        {/* Discount polygon badge */}
        <img
          src="/assets/polygonDiscount.svg"
          alt="Discount"
          className="absolute top-0 right-0 z-8"
        />
        <span className="absolute top-8 rotate-45 right-2 z-8 text-white text-[18px] font-[500]">
          82% OFF
        </span>
        {/* Destination image */}
        {product.featuredImage ? (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            No Image
          </div>
        )}
        {/* Destination title */}
        <h4 className="absolute top-3 left-4 font-bold text-white text-[20px] z-10">
          {product.title}
        </h4>
        {/* Details button */}
        <Link
          to={`/products/${product.handle}`}
          className="absolute left-4 bottom-3 text-[#26A5A5] bg-white px-4 py-1 text-[16px] font-medium z-10 rounded border border-transparent hover:border-[#26A5A5] transition"
        >
          Details
        </Link>
      </div>
      <ul className="text-sm text-[#000] mb-4 list-disc list-inside pl-4 space-y-2">
        {bullets.map((b: string, i: number) => (
          <li key={i} className="flex gap-2 items-center">
            <FaCheck className="text-amber-400" />{' '}
            <span className="max-w-[85%]">{b}</span>
          </li>
        ))}
      </ul>
      <div className="bg-[#f2b233] rounded-[8px] px-3 py-1 mx-4 flex gap-2 items-start justify-center">
        <FaGift className="min-w-4 mt-1" />
        <span className="text-[16px] font-[400] text-[#08252C]">
          Includes a Bonus Gift:Your Choice Vacation Getaway (valued at $300+)
        </span>
      </div>
      <div className="mt-8 p-4 bg-[#F5F5F5] flex flex-col gap-1 items-center justify-center border-t border-gray-300">
        <span className="text-[#676767] font-[400] text-[13px]">
          {/* You can add duration info as metafield or in description if needed */}
        </span>
        <p className="text-[13px] text-[#676767]">4 days/3 Nights</p>
        <div className="flex items-center justify-center gap-1">
          <span className="text-[#135868] font-[500] text-[27px]">
            ${product.priceRange.minVariantPrice.amount}
          </span>
          <span className="text-[#135868] font-[500] text-[12px]">
            per couple or <br /> family of four
          </span>
        </div>
        <span className="text-[#676767] font-[400] text-[13px]"></span>
      </div>
      <form
        method="post"
        className="w-full flex justify-center items-center"
        action="/cart"
      >
        <input
          type="hidden"
          name="variantId"
          value={product.variants.nodes[0].id}
        />
        <input type="hidden" name="offerTitle" value={product.title} />
        <input
          type="hidden"
          name="offerImage"
          value={product.featuredImage?.url || ''}
        />
        <input
          type="hidden"
          name="offerPrice"
          value={product.priceRange.minVariantPrice.amount}
        />
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
              ? product.tags.find((t: string) => t.match(/,|FL|PA/)) || ''
              : ''
          }
        />
        <input type="hidden" name="offerNights" value={product.nights || 3} />
        <input type="hidden" name="offerDays" value={product.days || 4} />
        <button
          type="submit"
          className={`bg-[#2AB7B7] h-[28px] w-full flex justify-center items-center rounded-b text-white font-[500] text-[12px] cursor-pointer ${!cartIsEmpty ? 'pointer-events-none opacity-50' : ''}`}
          disabled={!cartIsEmpty}
          title={
            !cartIsEmpty
              ? 'Only one offer can be added to cart at a time'
              : undefined
          }
        >
          {cartIsEmpty
            ? 'Select Offer'
            : 'Only one offer can be added to cart at a time'}
        </button>
      </form>
    </div>
  );
}
