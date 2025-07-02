import {IoDiamond} from 'react-icons/io5';
import {FaCheck, FaGift} from 'react-icons/fa6';
import {Link} from 'react-router';
import React from 'react';

export function OfferCard({
  product,
  onSelect,
}: {
  product: any;
  onSelect?: (product: any) => void;
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
      <div className="bg-[#FBE7C0] rounded-[8px] px-3 py-1 mx-4 flex gap-2 items-center justify-center">
        <FaGift />
        <span className="text-[16px] font-[500] text-[#151515]">
          Includes a Bonus Gift: Your Choice Vacation Getaway
        </span>
      </div>
      <div className="mt-8 p-4 bg-[#F5F5F5] flex flex-col gap-1 items-center justify-center border-t border-gray-300">
        <span className="text-[#676767] font-[400] text-[13px]">
          {/* You can add duration info as metafield or in description if needed */}
        </span>
        <div className="flex items-center justify-center gap-1">
          <span className="text-[#135868] font-[500] text-[27px]">
            ${product.priceRange.minVariantPrice.amount}
          </span>
          <span className="text-[#135868] font-[500] text-[12px]">
            per <br /> family of four
          </span>
        </div>
        <span className="text-[#676767] font-[400] text-[13px]">
          not included taxes + fees
        </span>
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
          className="bg-[#2AB7B7] h-[28px] w-full flex justify-center items-center rounded-b text-white font-[500] text-[12px] cursor-pointer"
        >
          Select Offer
        </button>
      </form>
    </div>
  );
}
