import {
  type MetaFunction,
  useLoaderData,
  useLocation,
  redirect,
} from 'react-router';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import {
  data,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  type HeadersFunction,
} from '@shopify/remix-oxygen';
import {CartMain} from '~/components/CartMain';
import {useMemo, useState, useEffect} from 'react';
import {MdOutlineShoppingCart} from 'react-icons/md';
import {format, startOfMonth, endOfMonth, getDay, addMonths} from 'date-fns';
import {addDays} from 'date-fns';
import {BiChevronLeft, BiChevronRight} from 'react-icons/bi';
import {BsCreditCard2BackFill, BsPlusCircleFill} from 'react-icons/bs';
import {FaGift} from 'react-icons/fa6';

export const meta: MetaFunction = () => {
  return [{title: `Hydrogen | Cart`}];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;
  const formData = await request.formData();
  // Handle clear cart
  const actionType = formData.get('action');
  if (actionType === 'remove') {
    const lineIds = formData.getAll('lineIds');
    if (lineIds.length > 0) {
      await cart.removeLines(lineIds.map(String));
    }
    return redirect('/cart');
  }
  // Get all form fields
  const variantId = formData.get('variantId');
  const quantity = 1;
  // Add to cart if variantId is present
  let result;
  if (variantId) {
    // Set offer expiration 30 minutes from now
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    result = await cart.addLines([
      {
        merchandiseId: variantId as string,
        quantity,
        attributes: [
          {key: 'First Name', value: String(formData.get('firstName') || '')},
          {key: 'Last Name', value: String(formData.get('lastName') || '')},
          {key: 'Email', value: String(formData.get('email') || '')},
          {key: 'Phone', value: String(formData.get('phone') || '')},
          {key: 'Adults', value: String(formData.get('adults') || '')},
          {key: 'Kids', value: String(formData.get('kids') || '')},
          {key: 'Check In', value: String(formData.get('checkIn') || '')},
          {key: 'Check Out', value: String(formData.get('checkOut') || '')},
          {key: 'Offer Title', value: String(formData.get('offerTitle') || '')},
          {
            key: 'Offer Location',
            value: String(formData.get('offerLocation') || ''),
          },
          {key: 'Offer Image', value: String(formData.get('offerImage') || '')},
          {key: 'Offer Price', value: String(formData.get('offerPrice') || '')},
          {
            key: 'offerNights',
            value: String(formData.get('offerNights') || ''),
          },
          {key: 'offerDays', value: String(formData.get('offerDays') || '')},
          {
            key: 'offerDescription',
            value: String(formData.get('offerDescription') || ''),
          },
          {key: 'Offer Expires At', value: expiresAt},
        ],
      },
    ]);
  }
  // Redirect to cart page (not checkout)
  return redirect('/cart');
}

export async function loader({context}: LoaderFunctionArgs) {
  const {cart, storefront} = context;
  // Fetch choice products (tag: 'choice')
  const CHOICE_PRODUCTS_QUERY = `#graphql
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
    query ChoiceProducts($query: String!) {
      products(first: 6, query: $query) {
        nodes {
          ...ProductItem
        }
      }
    }
  `;
  const choiceRes = await storefront.query(CHOICE_PRODUCTS_QUERY, {
    variables: {query: 'tag:choice'},
  });
  const choiceProducts = choiceRes?.products?.nodes || [];
  const cartData = await cart.get();
  return {cart: cartData, choiceProducts};
}

export default function Cart() {
  const {cart, choiceProducts} = useLoaderData<typeof loader>();
  const location = useLocation();

  // Helper to extract offer from cart lines
  function getOfferFromCart(cart: any) {
    if (!cart?.lines?.nodes?.length) return null;
    // Find the most recent line with offer attributes
    const line = cart.lines.nodes[cart.lines.nodes.length - 1];
    const attrs = Object.fromEntries(
      (line.attributes || []).map((attr: {key: string; value: string}) => [
        attr.key,
        attr.value,
      ]),
    );
    return {
      title: attrs['Offer Title'] || 'Magical Orlando Getaway',
      location: attrs['Offer Location'] || 'Orlando, FL',
      image: attrs['Offer Image'] || '/assets/orlando.jpg',
      price: attrs['Offer Price'] || 49,
      nights: attrs['offerNights'] || 3,
      days: attrs['offerDays'] || 4,
      description: attrs['offerDescription'] || '',
      expiresAt: attrs['Offer Expires At'] || null,
    };
  }

  const cartOffer = getOfferFromCart(cart);

  // Form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    adults: 0,
    kids: 0,
    consent: false,
  });

  // Date range picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  // helper to generate days grid for the visible month
  const monthData = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days: Date[] = [];
    // pad empty slots before the 1st
    for (let i = 0; i < (getDay(start) + 6) % 7; i++) {
      days.push(null as any);
    }
    for (let d = start; d <= end; d = addDays(d, 1)) {
      days.push(d);
    }
    return days;
  }, [currentMonth]);

  function handleDateClick(day: Date) {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(day);
      setCheckOut(null);
    } else if (day > checkIn) {
      setCheckOut(day);
    } else {
      // clicked before existing checkIn
      setCheckIn(day);
      setCheckOut(null);
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const {name, value, type, checked} = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  // Countdown hook
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

  const {hours, minutes, seconds, expired} = useCountdown(cartOffer?.expiresAt);
  const cartIsEmpty = !cart?.lines?.nodes?.length;

  // Helper to get all line IDs for clearing the cart
  const allLineIds = cart?.lines?.nodes?.map((line: any) => line.id) || [];

  // Helper: get all choice products in cart
  function getChoiceProductsInCart(cart: any, choiceProducts: any[]) {
    if (!cart?.lines?.nodes?.length) return [];
    return cart.lines.nodes.filter((line: any) => {
      const attrs = Object.fromEntries(
        (line.attributes || []).map((attr: {key: string; value: string}) => [
          attr.key,
          attr.value,
        ]),
      );
      return choiceProducts.some((prod) => prod.title === attrs['Offer Title']);
    });
  }

  const choiceProductsInCart = getChoiceProductsInCart(cart, choiceProducts);

  console.log(cartOffer, 'cartOffer');
  return (
    <div className="min-h-screen ">
      <div className="py-8 px-2 sm:px-4 md:px-8 flex flex-col items-start mx-auto max-w-7xl w-full">
        <div className="flex items-center gap-2 mb-6 bg-[#BDE9E9] px-4 py-1 rounded-[10px]">
          <MdOutlineShoppingCart size={25} className="text-[#164C51]" />
          <span className="text-[27px] font-[500] text-[#164C51]">
            YOUR CART
          </span>
        </div>
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 ">
            {/* General Information Form */}
            <form
              method="post"
              className="bg-[#FAFAFA] rounded-t-xl md:rounded-l-xl md:rounded-tr-none shadow-xl p-4 sm:p-6 md:p-8 flex flex-col gap-2 w-full"
            >
              <div>
                <h2 className="text-[21px] font-[500]">General Information</h2>
                <p className="text-[#111] font-[400] text-[13px] mb-4 tracking-wide">
                  Please fill out the form to proceed to payment.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleInput}
                  placeholder="First Name"
                  className=" rounded-[10px] px-3 py-2 outline-none border border-gray-100 shadow-md"
                />
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleInput}
                  placeholder="Last Name"
                  className=" rounded-[10px] px-3 py-2 outline-none border border-gray-100 shadow-md"
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleInput}
                  placeholder="Email"
                  className=" rounded-[10px] px-3 py-2 outline-none border border-gray-100 shadow-md sm:col-span-2"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleInput}
                  placeholder="Phone Number"
                  className=" rounded-[10px] px-3 py-2 outline-none border border-gray-100 shadow-md sm:col-span-2"
                />
              </div>
              <h3 className="text-[21px] font-[500] mt-5">
                How Many Traveling
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
                <label
                  htmlFor="adults"
                  className="block font-[400] text-4 text-[#071F24]"
                >
                  Adults
                </label>
                <input
                  id="adults"
                  name="adults"
                  type="number"
                  min={1}
                  value={form.adults}
                  onChange={handleInput}
                  className="rounded-[10px] px-3 py-2 outline-none border border-gray-100 col-span-2 shadow-md w-full"
                />
                <label
                  htmlFor="kids"
                  className="block font-[400] text-4 text-[#071F24]"
                >
                  Kids
                </label>
                <input
                  id="kids"
                  name="kids"
                  type="number"
                  min={0}
                  value={form.kids}
                  onChange={handleInput}
                  className="rounded-[10px] px-3 py-2 outline-none border border-gray-100 col-span-2 shadow-md w-full"
                />
              </div>
              <div className="text-[10px] font-[400] text-gray-600 mt-2">
                I understand by clicking the Check box, I hereby give prior
                express written consent to receive e-mail, SMS/Text messages,
                ringless voice mail, ringless voicemail drops, voicemail drops,
                direct-to- voicemail messages, other messaging, and/or
                telemarketing/telephonic sales calls about offers, products,
                services and/or deals from an automatic telephone dialing
                system, autodialer, and/or artificial or pre-recorded voice, or
                recorded messages, including through voice assisted technology
                or ringless voicemail technology from or on behalf of Discover
                Vacations, LLC at the telephone number(s) and address(es) that I
                have provided above, regardless of whether my telephone number
                is on any Do Not Call registry. My consent is not a condition of
                purchase. By clicking Continue Booking, I confirm that I&apos;m
                over age 25, and agree to the Privacy Policy and Terms &
                Conditions, both of which I agree I have read, understand and
                agree to. As an alternate to the above consent, click here for
                other ways to take advantage of this promotion.
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={handleInput}
                  className="mr-2"
                />
                <span className="text-xs text-gray-700">
                  I agree to the terms and conditions
                </span>
              </div>
              {/* Hidden offer data inputs */}
              <input type="hidden" name="offerTitle" value={cartOffer?.title} />
              <input
                type="hidden"
                name="offerLocation"
                value={cartOffer?.location}
              />
              <input type="hidden" name="offerImage" value={cartOffer?.image} />
              <input type="hidden" name="offerPrice" value={cartOffer?.price} />
              <input
                type="hidden"
                name="offerNights"
                value={cartOffer?.nights}
              />
              <input type="hidden" name="offerDays" value={cartOffer?.days} />
              <input
                type="hidden"
                name="offerDescription"
                value={cartOffer?.description || ''}
              />
              <input
                type="hidden"
                name="variantId"
                value={
                  new URLSearchParams(location.search).get('variantId') || ''
                }
              />
              {/* Date picker values as hidden inputs */}
              <input
                type="hidden"
                name="checkIn"
                value={checkIn ? checkIn.toISOString() : ''}
              />
              <input
                type="hidden"
                name="checkOut"
                value={checkOut ? checkOut.toISOString() : ''}
              />
            </form>

            {/* Date Picker & Toggle */}
            <div className="bg-[#164C51] rounded md:rounded-b-xl md:rounded-r-xl md:rounded-bl-none shadow-xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-between text-white min-h-[300px] md:min-h-[500px] h-full w-full">
              <div className="flex items-center justify-between mb-12 w-full">
                <span className="font-medium text-lg">
                  Do you know your dates?
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <span className="sr-only">Toggle date picker</span>
                  <input
                    type="checkbox"
                    checked={showDatePicker}
                    onChange={() => setShowDatePicker((v) => !v)}
                    className="sr-only peer"
                  />
                  <div className="w-16 h-8 bg-gray-200 peer-checked:bg-[#2AB7B7] rounded-full p-1 flex items-center transition-colors">
                    <span
                      className={`w-1/2 text-xs font-semibold text-center transition-colors ${
                        showDatePicker ? 'text-white' : 'text-white'
                      }`}
                    >
                      YES
                    </span>
                    <span
                      className={`w-1/2 text-xs font-semibold text-center transition-colors ${
                        showDatePicker ? 'text-white' : 'text-[#2AB7B7]'
                      }`}
                    >
                      NO
                    </span>
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                        showDatePicker ? 'translate-x-8' : ''
                      }`}
                    />
                  </div>
                </label>
              </div>

              {/* Calendar or "NO" fallback */}
              {showDatePicker ? (
                <div className="space-y-4 w-full">
                  {/* Month nav */}
                  <div className="flex items-center justify-between text-white">
                    <BiChevronLeft
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => setCurrentMonth((m) => addMonths(m, -1))}
                    />
                    <span className="font-semibold">
                      {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <BiChevronRight
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => setCurrentMonth((m) => addMonths(m, +1))}
                    />
                  </div>

                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-1 text-xs min-h-[240px]">
                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                      <div
                        key={d}
                        className="text-center text-[#2AB7B7] font-bold"
                      >
                        {d}
                      </div>
                    ))}
                    {monthData.map((day, idx) =>
                      !day ? (
                        <div key={idx} />
                      ) : (
                        (() => {
                          const dayStr = format(day, 'yyyy-MM-dd');
                          const isStart =
                            checkIn && format(checkIn, 'yyyy-MM-dd') === dayStr;
                          const isEnd =
                            checkOut &&
                            format(checkOut, 'yyyy-MM-dd') === dayStr;
                          const inRange =
                            checkIn &&
                            checkOut &&
                            day > checkIn &&
                            day < checkOut;

                          return (
                            <button
                              key={idx}
                              onClick={() => handleDateClick(day)}
                              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition
                                ${
                                  isStart || isEnd
                                    ? 'bg-[#2AB7B7] text-white'
                                    : inRange
                                      ? 'bg-[#2AB7B7]/30 text-white'
                                      : 'hover:bg-[#2AB7B7]/30'
                                }
                              `}
                            >
                              {format(day, 'd')}
                            </button>
                          );
                        })()
                      ),
                    )}
                  </div>

                  {/* Check-In / Check-Out display */}
                  <div className="flex justify-center border-t border-b border-gray-400 p-4">
                    {['Check-In', 'Check-Out'].map((label, i) => {
                      const val = i === 0 ? checkIn : checkOut;
                      return (
                        <div
                          key={label}
                          className="flex flex-col items-center px-2"
                        >
                          <span className="text-xs bg-white text-[#070707] px-4 py-1 rounded">
                            {label}
                          </span>
                          <button className="mt-1 text-[#F2B233] text-sm">
                            {val ? format(val, 'MMM d') : 'Select'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 w-full">
                  <span className="text-xl font-semibold"></span>
                </div>
              )}
              {/* <button
                type="submit"
                className="w-full bg-[#2AB7B7] text-white rounded-lg py-3 mt-auto font-semibold flex items-center justify-center gap-2 text-base"
              >
                <BsCreditCard2BackFill size={20} />
                Proceed to Payment
              </button> */}
              {cart?.checkoutUrl && (
                <div className="flex justify-end mt-8">
                  <a
                    href={cart.checkoutUrl}
                    className="w-full bg-[#2AB7B7] text-white rounded-lg p-3 mt-auto font-semibold flex items-center justify-center gap-2 text-base"
                  >
                    <BsCreditCard2BackFill size={20} />
                    Proceed to Checkout
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Offer Summary */}
          <div className="bg-gray-100 rounded-xl shadow flex flex-col min-h-[300px] md:min-h-[500px] mt-8 md:mt-0 w-full">
            <div className="bg-[#2AB7B7] text-white rounded-t-xl px-4 py-2 h-[50px] flex items-center justify-center gap-4">
              <span className="font-[500] text-[21px]">Offer Expires:</span>
              <div className="font-mono flex items-center gap-1 mt-1">
                {cartOffer?.expiresAt ? (
                  expired ? (
                    <span className="text-red-500">Expired</span>
                  ) : (
                    <>
                      {String(hours).padStart(2, '0')}{' '}
                      <span className="text-xs">HR</span> :{' '}
                      {String(minutes).padStart(2, '0')}{' '}
                      <span className="text-xs">MIN</span> :{' '}
                      {String(seconds).padStart(2, '0')}{' '}
                      <span className="text-xs">SEC</span>
                    </>
                  )
                ) : (
                  <span>-- : -- : --</span>
                )}
              </div>
            </div>
            {/* If cart is empty, show Find Destination button */}
            {cartIsEmpty ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <button
                  className="bg-[#2AB7B7] text-white px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-[#229a9a] transition"
                  onClick={() => (window.location.href = '/')}
                >
                  Find Destination
                </button>
              </div>
            ) : (
              <>
                {/* Clear Cart Button */}
                {allLineIds.length > 0 && (
                  <form method="post" className="flex justify-end mb-4">
                    <input type="hidden" name="action" value="remove" />
                    {allLineIds.map((id: string) => (
                      <input key={id} type="hidden" name="lineIds" value={id} />
                    ))}
                    <button
                      type="submit"
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition"
                      style={{marginLeft: 'auto'}}
                    >
                      Clear Cart
                    </button>
                  </form>
                )}
                <div className="relative">
                  {/* Image */}
                  <img
                    src={cartOffer?.image ?? '/assets/orlando.jpg'}
                    alt={cartOffer?.title ?? 'Offer'}
                    className="w-full h-[180px] object-cover"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black opacity-20" />
                  {/* Text */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10">
                    <h2 className="text-[27px] font-[500]">
                      {cartOffer?.title ?? 'Magical Orlando Getaway'}
                    </h2>
                    <p className="text-[20px] font-[400]">
                      {cartOffer?.location ?? 'Orlando, FL'}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg flex flex-col items-center m-8 p-4">
                  <span className="text-sm text-gray-500">
                    {cartOffer?.days ?? 4} Days / {cartOffer?.nights ?? 3}{' '}
                    Nights
                  </span>
                  <span className="text-[28px] text-[#0E424E]">
                    ${cartOffer?.price ?? 49}{' '}
                    <span className="text-base font-normal">
                      {' '}
                      per couple or upto a family of four
                    </span>
                  </span>
                  <span className="text-xs text-gray-400">
                    not included taxes + fees
                  </span>
                </div>
                <ul className="text-sm text-[#135868] mx-8 my-2 space-y-2">
                  {cartOffer?.description ? (
                    cartOffer.description
                      .split('\n')
                      .map((line: string, idx: number) => (
                        <li key={idx}>✔ {line}</li>
                      ))
                  ) : (
                    <>
                      <li>
                        ✔ 3 nights hotel accommodations in Magical Orlando per
                        couple or up to a family of 4
                      </li>
                    </>
                  )}
                </ul>
                <button className="bg-[#F2B233] text-white rounded-lg py-2 px-4 mx-8 my-2 font-semibold flex items-center gap-2 max-w-[80%]">
                  <FaGift />
                  Choice of Your Next Vacation Getaway
                </button>
                {/* Show selected choice products in cart */}
                {choiceProductsInCart.length > 0 && (
                  <div className="mx-8 my-2 flex flex-col gap-2">
                    <h4 className="text-[#0E424E] font-semibold text-lg mb-2">
                      Your Selected Bonus Vacation(s):
                    </h4>
                    {choiceProductsInCart.map((line: any, idx: number) => {
                      const attrs = Object.fromEntries(
                        (line.attributes || []).map(
                          (attr: {key: string; value: string}) => [
                            attr.key,
                            attr.value,
                          ],
                        ),
                      );
                      return (
                        <div
                          key={line.id}
                          className="flex items-center gap-4 bg-[#FBE7C0] rounded-lg p-2"
                        >
                          <img
                            src={attrs['Offer Image'] || '/assets/orlando.jpg'}
                            alt={attrs['Offer Title']}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <span className="text-[#0E424E] font-medium">
                            {attrs['Offer Title']}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <button
                  type="button"
                  className="text-[#0E424E] underline text-[16px] font-[600] mt-4 mx-8"
                  onClick={() => {
                    /* handle contact us click */
                  }}
                >
                  Need Help? Contact Us
                </button>
                {/* Proceed to Checkout Button */}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Discover More — Choose Your Bonus Vacation  */}

      <div className="max-w-7xl py-12 mx-auto px-8">
        <div className="text-center flex flex-col justify-center items-center mb-6">
          <h1 className="text-[#0E424E] font-[500] text-[36px]">
            Discover More — Choose Your Bonus Vacation
          </h1>
          <p className="font-[400] text-[20px] text-[#676767]">
            Select your preferred gift and add it to your cart for $0.00. It
            will be confirmed during your vacation, and you&apos;ll have the
            chance to change it if you&apos;d like.
          </p>
        </div>
        <div className="h-[1px] bg-gray-300"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 my-10 gap-6">
          {choiceProducts.length > 0 ? (
            choiceProducts.map((product: any, idx: number) => (
              <div key={product.id} className="rounded-[10px] bg-white shadow">
                <div className="bg-[#F2B233] py-1 text-white font-[500] text-[21px] flex justify-center items-center gap-3 rounded-t-[10px]">
                  <span>
                    <FaGift />
                  </span>
                  <span>Choice {String.fromCharCode(65 + idx)}</span>
                </div>
                <div className="bg-gray-100 flex items-center justify-center p-5 min-h-[180px]">
                  <img
                    src={product.featuredImage?.url || '/assets/orlando.jpg'}
                    alt={product.title}
                    className="w-full h-[120px] object-cover rounded"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#0E424E] mb-2 text-center">
                    {product.title}
                  </h3>
                  <p className="font-[400] text-[16px] text-[#0E424E] text-center mb-2">
                    {product.description?.split('\n')[0]}
                  </p>
                  <form
                    method="post"
                    action="/cart"
                    className="flex flex-col items-center mt-2"
                  >
                    <input
                      type="hidden"
                      name="variantId"
                      value={product.variants.nodes[0]?.id || ''}
                    />
                    <input
                      type="hidden"
                      name="offerTitle"
                      value={product.title}
                    />
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
                      className="bg-[#F2B233] text-white rounded-lg py-2 px-4 font-semibold flex items-center gap-2 mt-2"
                      disabled={!product.variants.nodes[0]?.id}
                    >
                      <BsPlusCircleFill /> Select
                    </button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-12">
              No bonus vacations available.
            </div>
          )}
        </div>

        <p className="text-[#676767] font-[400] text-[16px] flex items-center justify-center tracking-wider">
          Please contact us if you would like to change your gift later.
        </p>
      </div>
    </div>
  );
}
