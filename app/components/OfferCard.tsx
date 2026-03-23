import { IoDiamond } from 'react-icons/io5';
import { FaCheck, FaGift } from 'react-icons/fa6';
import { Link } from 'react-router';
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
        <div className="absolute -top-7 left-3 flex items-center justify-center gap-1 bg-[#F2B233] text-[#FEFEFE] px-2 py-1 text-[14px] font-[400] rounded-t-[10px]">
          <IoDiamond /> <span>Exclusive Offer</span>
        </div>
      )}
      <Link
        to={`/products/${product.handle}`}
        className="cursor-pointer hover:shadow-xl transition duration-200"
      >
        <div className="relative w-full h-[280px] rounded-t-[10px] mb-4 overflow-hidden">
          {/* Discount polygon badge */}
          <img
            src="/assets/polygonDiscount.svg"
            alt="Discount"
            className="absolute top-0 right-0 z-8"
          />
          <span className="absolute top-4 right-4 z-8 text-white text-[21px] font-[700] leading-6">
            82% <br />
            OFF
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
          <h4 className="absolute top-5 left-5 font-[700] text-white text-[22px] z-10 drop-shadow-2xl max-w-[80%]">
            {product.title}
          </h4>
          {/* Details button */}
          <Link
            to={`/products/${product.handle}`}
            className="absolute left-5 bottom-3 text-[#26A5A5] bg-white px-5 py-1 text-[16px] font-[500] z-10 rounded border border-transparent hover:border-[#26A5A5] transition"
          >
            Details
          </Link>
        </div>
        <ul className="text-4 font-[400] tracking-wide text-[#000] mb-4 list-disc list-inside pl-4 space-y-2">
          {bullets.map((b: string, i: number) => (
            <li key={i} className="flex gap-2 items-center">
              {/* <FaCheck className="text-amber-400" />{' '} */}
              <span className="max-w-[85%] ml-4">{b}</span>
            </li>
          ))}
        </ul>
        <div className="bg-gradient-to-r from-[#f2b233] to-[#FFE7B8] rounded-[8px] px-3 py-1 mx-4 flex gap-2 items-start justify-center">
          <FaGift className="min-w-4 mt-1" />
          <span className="text-[16px] font-[400] text-[#08252C] font-avenir">
            Includes a Bonus Vacation: Choice Vacation Getaway (valued at $300+)
          </span>
        </div>
        <div className="mt-8 p-4 bg-[#F5F5F5] flex flex-col gap-1 items-center justify-center border-t border-gray-300">
          <span className="text-[#676767] font-[400] text-[13px]">
            {/* You can add duration info as metafield or in description if needed */}
          </span>
          <p className="text-[13px] text-[#676767]">4 days / 3 nights</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#135868] font-[700] text-[27px] font-monteserrat">
              ${Math.round(product.priceRange.minVariantPrice.amount)}
            </span>
            <span className="text-[#135868] font-[600] text-[12px] font-avenir">
              per couple or <br /> family of four
            </span>
          </div>
          <span className="text-[#676767] font-[400] text-[13px]"></span>
        </div>
      </Link>
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
          className={`bg-[#2AB7B7] h-[43px] hover:bg-[#229a9a] duration-200 w-full flex justify-center items-center rounded-b-[10px] text-white font-[500] text-[16px] cursor-pointer ${!cartIsEmpty ? 'pointer-events-none opacity-50' : ''}`}
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
