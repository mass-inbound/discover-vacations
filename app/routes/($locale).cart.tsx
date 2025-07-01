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
import {useMemo, useState} from 'react';
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
  // Get all form fields
  const variantId = formData.get('variantId');
  const quantity = 1;
  // Add to cart if variantId is present
  let result;
  if (variantId) {
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
        ],
      },
    ]);
  }
  // Redirect to checkout or show confirmation
  return redirect('/checkout');
}

export async function loader({context}: LoaderFunctionArgs) {
  const {cart} = context;
  return await cart.get();
}

export default function Cart() {
  const cart = useLoaderData<typeof loader>();
  const location = useLocation();

  // Parse offer data from query string
  const params = new URLSearchParams(location.search);
  const offer = {
    title: params.get('title') || 'Magical Orlando Getaway',
    location: params.get('location') || 'Orlando, FL',
    image: params.get('image') || '/assets/DestinationImage.png',
    price: params.get('price') || 49,
    nights: 3,
    days: 4,
    expires: '00:00:00',
    description: params.get('description') || '',
  };

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

  return (
    <div className="min-h-screen ">
      <div className="py-8 px-2 flex flex-col items-start mx-auto max-w-7xl">
        <div className="flex items-center gap-2 mb-6 bg-[#BDE9E9] px-4 py-1 rounded-[10px]">
          <MdOutlineShoppingCart size={25} className="text-[#164C51]" />
          <span className="text-[27px] font-[500] text-[#164C51]">
            YOUR CART
          </span>
        </div>
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8">
          <form method="post" className="grid grid-cols-[60%_40%]">
            {/* General Information Form */}
            <div className="bg-[#FAFAFA] rounded-l-xl shadow-xl p-8 flex flex-col gap-2">
              <div>
                <h2 className="text-[21px] font-[500]">General Information</h2>
                <p className="text-[#111] font-[400] text-[13px] mb-4 tracking-wide">
                  Please fill out the form to proceed to payment.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  className=" rounded-[10px] px-3 py-2 outline-none border border-gray-100 col-span-2 shadow-md"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleInput}
                  placeholder="Phone Number"
                  className=" rounded-[10px] px-3 py-2 outline-none border border-gray-100 col-span-2 shadow-md"
                />
              </div>
              <h3 className="text-[21px] font-[500] mt-5">
                How Many Traveling
              </h3>
              <div className="grid grid-cols-2 gap-4 my-2">
                <div>
                  <label className="block font-[400] text-4 text-[#071F24]">
                    Adults
                  </label>
                  <input
                    name="adults"
                    type="number"
                    min={1}
                    value={form.adults}
                    onChange={handleInput}
                    className="rounded-[10px] px-3 py-2 outline-none border border-gray-100 col-span-2 shadow-md w-full"
                  />
                </div>
                <div>
                  <label className="block font-[400] text-4 text-[#071F24]">
                    Kids
                  </label>
                  <input
                    name="kids"
                    type="number"
                    min={0}
                    value={form.kids}
                    onChange={handleInput}
                    className="rounded-[10px] px-3 py-2 outline-none border border-gray-100 col-span-2 shadow-md w-full"
                  />
                </div>
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
                purchase. By clicking Continue Booking, I confirm that I'm over
                age 25, and agree to the Privacy Policy and Terms & Conditions,
                both of which I agree I have read, understand and agree to. As
                an alternate to the above consent, click here for other ways to
                take advantage of this promotion.
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
              <input type="hidden" name="offerTitle" value={offer.title} />
              <input
                type="hidden"
                name="offerLocation"
                value={offer.location}
              />
              <input type="hidden" name="offerImage" value={offer.image} />
              <input type="hidden" name="offerPrice" value={offer.price} />
              <input type="hidden" name="offerNights" value={offer.nights} />
              <input type="hidden" name="offerDays" value={offer.days} />
              <input
                type="hidden"
                name="offerDescription"
                value={offer.description || ''}
              />
              <input
                type="hidden"
                name="variantId"
                value={params.get('variantId') || ''}
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
              {/* <button
                type="submit"
                className="w-full bg-[#2AB7B7] text-white rounded-lg py-3 mt-auto font-semibold flex items-center justify-center gap-2"
              >
                <BsCreditCard2BackFill size={20} />
                Proceed to Payment
              </button> */}
            </div>

            {/* Date Picker & Toggle */}
            <div className="bg-[#164C51] rounded-r-xl shadow-xl p-8 flex flex-col items-center text-white min-h-[500px]">
              <div className="flex items-center justify-between mb-12">
                <span className="font-medium text-lg">
                  Do you know your dates?
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
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
                <div className="space-y-4">
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
                <div className="flex items-center justify-center h-32">
                  <span className="text-xl font-semibold"></span>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#2AB7B7] text-white rounded-lg py-3 mt-auto font-semibold flex items-center justify-center gap-2"
              >
                <BsCreditCard2BackFill size={20} />
                Proceed to Payment
              </button>
            </div>
          </form>

          {/* Offer Summary */}
          <div className="bg-gray-100 rounded-xl shadow flex flex-col min-h-[500px]">
            <div className="bg-[#2AB7B7] text-white rounded-t-xl px-4 py-2 h-[50px] flex items-center justify-center gap-4">
              <span className="font-[500] text-[21px]">Offer Expires:</span>
              <div className="font-mono flex items-center gap-1 mt-1">
                00 <span className="text-xs">HR</span> : 00{' '}
                <span className="text-xs">MIN</span> : 00{' '}
                <span className="text-xs">SEC</span>
              </div>
            </div>
            <div className="relative">
              {/* Image */}
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-[180px] object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black opacity-20" />

              {/* Text */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10">
                <h2 className="text-[27px] font-[500]">{offer.title}</h2>
                <p className="text-[20px] font-[400]">{offer.location}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg flex flex-col items-center m-8 p-4">
              <span className="text-sm text-gray-500">
                {offer.days} Days / {offer.nights} Nights
              </span>
              <span className="text-[28px] text-[#0E424E]">
                ${offer.price}{' '}
                <span className="text-base font-normal">per couple</span>
              </span>
              <span className="text-xs text-gray-400">
                not included taxes + fees
              </span>
            </div>
            <ul className="text-sm text-[#135868] mx-8 my-2 space-y-2">
              {offer.description ? (
                offer.description
                  .split('\n')
                  .map((line: string, idx: number) => (
                    <li key={idx}>✔ {line}</li>
                  ))
              ) : (
                <>
                  <li>✔ 3 nights hotel accommodations</li>
                  <li>✔ Enjoy Exclusive Perks During Your Stay</li>
                </>
              )}
            </ul>
            <button className="bg-[#F2B233] text-white rounded-lg py-2 px-4 mx-8 my-2 font-semibold flex items-center gap-2 max-w-[80%]">
              <FaGift />
              Choice of Your Next Vacation Getaway
            </button>
            <a
              href="#"
              className="text-[#0E424E] underline text-[16px] font-[600] mt-4 mx-8"
            >
              Need Help? Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* your next vacation, on us  */}

      <div className="max-w-7xl py-12 mx-auto">
        <div className="text-center flex flex-col justify-center items-center mb-6">
          <h1 className="text-[#0E424E] font-[500] text-[36px]">
            Your Next Vacation, On Us
          </h1>
          <p className="font-[400] text-[20px] text-[#676767]">
            Choose one of the exclusive vacation packages below, a special
            reward to start planning your next escape.
          </p>
        </div>
        <div className="h-[1px] bg-gray-300"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 my-10">
          <div className="rounded-[10px]">
            <div className="bg-[#F2B233] py-1 text-white font-[500] text-[21px] flex justify-center items-center gap-3 rounded-t-[10px]">
              <span>
                <FaGift />
              </span>
              <span>Choice A</span>
            </div>
            <div className="bg-gray-100 flex items-center justify-center p-5 min-h-[280px]">
              <p className="font-[400] text-[20px] text-[#0E424E] text-center px-6">
                4,5 or 7- Night Cruise aboard Carnival, NCL or Royal Caribbean
                for two adults.
              </p>
            </div>
            <div className="bg-[#F2B233] py-1 text-white font-[500] text-[21px] flex justify-center items-center gap-3 rounded-b-[10px] cursor-pointer">
              <span>Select</span>
              <span>
                <BsPlusCircleFill />
              </span>
            </div>
          </div>
        </div>

        <p className="text-[#676767] font-[400] text-[16px] flex items-center justify-center tracking-wider">
          Please contact us if you would like to change your gift later.
        </p>
      </div>
    </div>
  );
}
