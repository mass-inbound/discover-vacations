import {
  type MetaFunction,
  useLoaderData,
  useLocation,
  redirect,
  Link,
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
import {useMemo, useState, useEffect, useRef} from 'react';
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
          {
            key: 'TCPA Status',
            value: String(
              formData.get('consent') ? 'Approved' : 'Not Approved',
            ),
          },
        ],
      },
    ]);
    // Add cart-level attributes for Shopify Admin visibility
    await cart.updateAttributes([
      {key: 'First Name', value: String(formData.get('firstName') || '')},
      {key: 'Last Name', value: String(formData.get('lastName') || '')},
      {key: 'Email', value: String(formData.get('email') || '')},
      {key: 'Phone', value: String(formData.get('phone') || '')},
      {key: 'Adults', value: String(formData.get('adults') || '')},
      {key: 'Kids', value: String(formData.get('kids') || '')},
      {
        key: 'Consent',
        value: String(formData.get('consent') ? 'Approved' : 'Not Approved'),
      },
      {key: 'Check In', value: String(formData.get('checkIn') || '')},
      {key: 'Check Out', value: String(formData.get('checkOut') || '')},
    ]);
    const headers = cart.setCartId(result.cart.id);
    return redirect('/cart', {headers});
  }
  // Redirect to cart page (not checkout)
  return redirect('/cart');
}

export async function loader({context}: LoaderFunctionArgs) {
  const {cart, storefront} = context;
  // Fetch upsell products (tag: 'upsell')
  const UPSELL_PRODUCTS_QUERY = `#graphql
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
    query UpsellProducts($query: String!) {
      products(first: 6, query: $query) {
        nodes {
          ...ProductItem
        }
      }
    }
  `;
  const upsellRes = await storefront.query(UPSELL_PRODUCTS_QUERY, {
    variables: {query: 'tag:upsell'},
  });
  const upsellProducts = upsellRes?.products?.nodes || [];
  const cartData = await cart.get();
  return {cart: cartData, upsellProducts};
}

export default function Cart() {
  const {cart, upsellProducts} = useLoaderData<typeof loader>();
  // console.log('cart==>', cart);
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
      title: attrs['Offer Title'] || 'Title N/A',
      location: attrs['Offer Location'] || 'Location N/a',
      image: attrs['Offer Image'] || 'Image N/A',
      price: attrs['Offer Price'] || 'N/A',
      nights: attrs['offerNights'] || 'N/A',
      days: attrs['offerDays'] || 'N/A',
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
    phone: '', // formatted
    phoneRaw: '', // digits only
    adults: 0,
    kids: 0,
    consent: false,
  });

  // Validation state
  const [errors, setErrors] = useState<any>({});

  // Validation function
  function validateForm() {
    const newErrors: any = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Invalid email address.';
    }
    if (!form.phoneRaw.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(form.phoneRaw)) {
      newErrors.phone = 'Phone number must be 10 digits.';
    }
    if (!form.adults || Number(form.adults) < 1) {
      newErrors.adults = 'At least 1 adult is required.';
    }
    if (!form.consent) {
      newErrors.consent = 'You must agree to the terms.';
    }
    return newErrors;
  }

  function semivalidateForm() {
    const newErrors: any = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Invalid email address.';
    }
    if (!form.phoneRaw.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(form.phoneRaw)) {
      newErrors.phone = 'Phone number must be 10 digits.';
    }
    if (!form.adults || Number(form.adults) < 1) {
      newErrors.adults = 'At least 1 adult is required.';
    }
    return newErrors;
  }

  // Date range picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  // Calendar restriction: only allow selection 9 days after today
  const today = new Date();
  const minSelectableDate = addDays(today, 8);

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
      const diffInDays = Math.ceil(
        (day.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffInDays <= 3) {
        setCheckOut(day);
      } else {
        alert('You cannot select more than 4 days.');
      }
    } else {
      // clicked before existing checkIn
      setCheckIn(day);
      setCheckOut(null);
    }
  }

  // Function to format phone number
  function formatPhoneNumber(value: string) {
    const cleaned = ('' + value).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  }

  // Update handleInput function
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const {name, value, type, checked} = e.target;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '');
      setForm((prev) => ({
        ...prev,
        phone: formatPhoneNumber(digits),
        phoneRaw: digits,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
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
  function getUpsellProductsInCart(cart: any, upsellProducts: any[]) {
    if (!cart?.lines?.nodes?.length) return [];
    return cart.lines.nodes.filter((line: any) => {
      const attrs = Object.fromEntries(
        (line.attributes || []).map((attr: {key: string; value: string}) => [
          attr.key,
          attr.value,
        ]),
      );
      return upsellProducts.some((prod) => prod.title === attrs['Offer Title']);
    });
  }

  const upsellProductsInCart = getUpsellProductsInCart(cart, upsellProducts);

  const selectedBonus = upsellProductsInCart[0];
  const selectedBonusVariantId = selectedBonus?.merchandise?.id;

  const upsellRef = useRef<HTMLDivElement | null>(null);

  const handleUpsellScroll = () => {
    if (upsellRef.current) {
      const yOffset = -150; // negative navbar height
      const y =
        upsellRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

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
          <div>
            {/* General Information Form */}
            <form
              method="post"
              className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-0"
              onSubmit={(e) => {
                const validationErrors = validateForm();
                setErrors(validationErrors);
                if (Object.keys(validationErrors).length > 0) {
                  e.preventDefault();
                } else {
                  e.preventDefault(); // Prevent default form submission
                  if (cart?.checkoutUrl) {
                    window.location.href = cart.checkoutUrl;
                  }
                }
              }}
            >
              <div className="relative bg-[#FAFAFA] rounded-t-xl md:rounded-l-xl md:rounded-tr-none shadow-xl p-4 sm:p-6 md:p-8 flex flex-col gap-2 w-full">
                <div>
                  <h2 className="text-[21px] font-[500]">
                    General Information
                  </h2>
                  <p className="text-[#111] font-[400] text-[13px] mb-4 tracking-wide">
                    Please fill out the form to proceed to payment.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleInput}
                      placeholder="First Name"
                      className=" rounded-[10px] px-3 py-2 outline-none border border-gray-100 shadow-md"
                    />
                    {errors.firstName && (
                      <span className="text-red-500 text-xs">
                        {errors.firstName}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleInput}
                      placeholder="Last Name"
                      className=" rounded-[10px] px-3 py-2 outline-none border border-gray-100 shadow-md"
                    />
                    {errors.lastName && (
                      <span className="text-red-500 text-xs">
                        {errors.lastName}
                      </span>
                    )}
                  </div>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleInput}
                    placeholder="Email"
                    className=" rounded-[10px] px-3 py-2 outline-none border border-gray-100 shadow-md sm:col-span-2"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs col-span-2">
                      {errors.email}
                    </span>
                  )}
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleInput}
                    placeholder="Phone Number"
                    className=" rounded-[10px] px-3 py-2 outline-none border border-gray-100 shadow-md sm:col-span-2"
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-xs col-span-2">
                      {errors.phone}
                    </span>
                  )}
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
                  {errors.adults && (
                    <span className="text-red-500 text-xs col-span-2">
                      {errors.adults}
                    </span>
                  )}
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
                <div className="flex items-start mt-2">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={form.consent}
                    onChange={handleInput}
                    className="mr-2 mt-2"
                  />
                  <span className="text-[10px] font-[400] text-gray-600 mt-2">
                    Discover Vacations, LLC, may need to contact you to assist
                    in booking your vacation, and follow up on any questions. By
                    clicking this checkbox, you agree to the{' '}
                    <Link
                      to={'/policies/terms-conditions'}
                      className="underline"
                      tabIndex={-1}
                    >
                      Terms & Conditions
                    </Link>{' '}
                    &
                    <Link
                      to={'/policies/privacy-policy'}
                      className="underline"
                      tabIndex={-1}
                    >
                      {' '}
                      Privacy Policy
                    </Link>{' '}
                    all of which you agree you have read, understand and agree
                    to. By clicking the checkbox, you also agree and consent to
                    receive promotional emails, SMS texts and calls, including
                    pre-recorded messages and/or calls or texts made from an
                    Auto-dial telephone dialing system from Discover Vacations,
                    LLC., and its affiliates, parents and/or subsidiaries
                    (text/data and other charges may apply) at the
                    address/numbers provided regardless of that number being on
                    any Do not Call Registry. Your consent is not a condition of
                    any purchase. As an alternative to the consent above you may
                    enter the Promotion here. and , both of which I agree I have
                    read, understand and agree to. As an alternate to the above
                    consent, click here for other ways to take advantage of this
                    Promotion{' '}
                    <button
                      className="text-[#2AB7B7] underline"
                      onClick={(e) => {
                        const validationErrors = semivalidateForm();
                        setErrors(validationErrors);
                        if (Object.keys(validationErrors).length > 0) {
                          e.preventDefault();
                        } else {
                          e.preventDefault(); // Prevent default form submission
                          if (cart?.checkoutUrl) {
                            window.location.href = cart.checkoutUrl;
                          }
                        }
                      }}
                      tabIndex={-1}
                    >
                      here.
                    </button>
                  </span>
                </div>
                {errors.consent && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.consent}
                  </span>
                )}
                {/* Hidden offer data inputs */}
                <input
                  type="hidden"
                  name="offerTitle"
                  value={cartOffer?.title}
                />
                <input
                  type="hidden"
                  name="offerLocation"
                  value={cartOffer?.location}
                />
                <input
                  type="hidden"
                  name="offerImage"
                  value={cartOffer?.image}
                />
                <input
                  type="hidden"
                  name="offerPrice"
                  value={cartOffer?.price}
                />
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
              </div>

              {/* Date Picker & Toggle */}
              <div className="bg-[#164C51] rounded md:rounded-b-xl md:rounded-r-xl md:rounded-bl-none shadow-xl p-4 sm:p-6 md:p-8 flex flex-col items-center text-white min-h-[300px] md:min-h-[500px] h-full w-full">
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
                      tabIndex={-1}
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
                              checkIn &&
                              format(checkIn, 'yyyy-MM-dd') === dayStr;
                            const isEnd =
                              checkOut &&
                              format(checkOut, 'yyyy-MM-dd') === dayStr;
                            const inRange =
                              checkIn &&
                              checkOut &&
                              day > checkIn &&
                              day < checkOut;
                            const isDisabled = day < minSelectableDate;

                            return (
                              <button
                                key={idx}
                                onClick={() =>
                                  !isDisabled && handleDateClick(day)
                                }
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition
                                ${
                                  isStart || isEnd
                                    ? 'bg-[#2AB7B7] text-white'
                                    : inRange
                                      ? 'bg-[#2AB7B7]/30 text-white'
                                      : isDisabled
                                        ? 'text-gray-400 !cursor-not-allowed'
                                        : 'hover:bg-[#2AB7B7]/30'
                                }
                              `}
                                disabled={isDisabled}
                              >
                                {format(day, 'd')}
                              </button>
                            );
                          })()
                        ),
                      )}
                    </div>

                    {/* Check-In / Check-Out display */}
                    <div className="flex justify-center border-t border-b border-gray-400 p-4 text-center">
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
                            <button
                              className="mt-1 text-[#F2B233] text-sm"
                              tabIndex={-1}
                            >
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
                {cart?.checkoutUrl && !cartIsEmpty && (
                  <div className="w-full py-3 mt-auto flex items-center justify-center gap-2">
                    <div className="flex flex-col gap-8 mt-2">
                      <button
                        type="button"
                        onClick={handleUpsellScroll}
                        className="flex items-center justify-center gap-2 text-white border-b-3 border-[#F2B233] text-[16px] font-[600] font-plusjakarta cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                      >
                        <FaGift className="min-w-5 mb-1" />
                        <span className="tracking-wide text-shadow-2xs">
                          Select Bonus Vacation
                        </span>
                      </button>
                      <button
                        type="submit"
                        className="w-full bg-[#2AB7B7] text-white rounded-lg p-3 mt-auto font-semibold flex items-center justify-center gap-2 text-base hover:bg-[#239f9f]"
                      >
                        <BsCreditCard2BackFill size={20} />
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Offer Summary */}
          <div className="bg-gray-100 rounded-xl shadow flex flex-col min-h-[300px] md:min-h-[500px] mt-8 pb-8 md:pb-0 md:mt-0 w-full">
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
                  onClick={() => (window.location.href = '/discover-offers')}
                >
                  Find Destination
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  {/* Clear Cart Button */}
                  {allLineIds.length > 0 && (
                    <form method="post" className="absolute right-2 top-2 z-10">
                      <input type="hidden" name="action" value="remove" />
                      {allLineIds.map((id: string) => (
                        <input
                          key={id}
                          type="hidden"
                          name="lineIds"
                          value={id}
                        />
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
                  <span className="text-[28px] text-[#0E424E] flex gap-2">
                    ${Math.round(cartOffer?.price ?? 49)}{' '}
                    <span className="text-base font-normal flex flex-col leading-5">
                      {' '}
                      <span>per couple or </span>{' '}
                      <span>upto a family of four</span>
                    </span>
                  </span>
                </div>
                <ul className="text-sm text-[#135868] mx-8 my-2 space-y-2 tracking-wider font-plusjakarta">
                  {cartOffer?.description ? (
                    cartOffer.description
                      .split('\n')
                      .map((line: string, idx: number) => (
                        <li key={idx}>✔ {line}</li>
                      ))
                  ) : (
                    <>
                      <li>✔ Destination detail</li>
                    </>
                  )}
                </ul>
                <div className="relative bg-gradient-to-r from-[#f2b233] to-[#FFE7B8] rounded-[8px] px-3 py-1 mx-6 mt-4 flex gap-2 items-start justify-center">
                  <FaGift className="min-w-4 mt-1" />
                  <span className="text-[16px] font-[400] text-[#08252C] tracking-wide">
                    Includes a Bonus Vacation: Your Choice Vacation Bonus
                    (valued at $300+)
                  </span>
                  {/* {upsellProductsInCart.length == 0 && (
                    <img
                      className="absolute -bottom-12 right-15"
                      src="/assets/cart-arrow.svg"
                      alt=""
                    />
                  )} */}
                </div>
                {/* Show selected upsell products in cart */}
                {upsellProductsInCart.length > 0 && (
                  <div className="mx-8 mb-2 mt-5 flex flex-col gap-2">
                    <h4 className="text-[#0E424E] font-semibold text-lg mb-2">
                      Your Selected Bonus Vacation(s):
                    </h4>
                    {upsellProductsInCart.map((line: any, idx: number) => {
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
                          className="flex items-center gap-4 bg-[#FBE7C0] rounded-lg p-2 relative"
                        >
                          <img
                            src={attrs['Offer Image'] || '/assets/orlando.jpg'}
                            alt={attrs['Offer Title']}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <span className="text-[#0E424E] font-medium">
                            {attrs['Offer Title']}
                          </span>
                          {/* Remove (X) button */}
                          <form
                            method="post"
                            className="absolute top-2 right-2"
                          >
                            <input type="hidden" name="action" value="remove" />
                            <input
                              type="hidden"
                              name="lineIds"
                              value={line.id}
                            />
                            <button
                              type="submit"
                              className="bg-red-400 text-white hover:bg-red-500 text-lg font-bold px-2 rounded"
                              title="Remove"
                            >
                              ×
                            </button>
                          </form>
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* <button
                  type="button"
                  onClick={handleUpsellScroll}
                  className="flex items-center justify-center gap-2 text-[#070707] border-b-3 border-[#F2B233] text-[16px] font-[600] mt-14 mx-8 font-plusjakarta md:max-w-[60%] cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                >
                  <FaGift className="min-w-5 mb-1" />
                  <span className="tracking-wide text-shadow-2xs">
                    Select Your Bonus Vacation
                  </span>
                </button> */}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Discover More — Choose Your Bonus Vacation  */}

      <div className="max-w-7xl py-12 mx-auto px-8" ref={upsellRef}>
        <div className="text-center flex flex-col justify-center items-center mb-6">
          <h1 className="text-[#0E424E] font-[500] text-[28px] md:text-[36px] font-monteserrat pb-3">
            Discover More — Choose Your Bonus Vacation
          </h1>
          <p className="font-[400] text-[20px] text-[#101010] font-avenir max-w-[70%] mx-auto">
            Select the gift that excites you most and add it to your cart for
            $0.00.No pressure— *your selection can be updated later if you
            change your mind.
          </p>
        </div>
        <div className="h-[1px] bg-gray-300"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 my-10 gap-6">
          {upsellProducts.length > 0 ? (
            upsellProducts.map((product: any, idx: number) => (
              <div
                key={product.id}
                className="rounded-[10px] bg-white shadow flex flex-col"
              >
                <div className="bg-[#F2B233] py-1 text-[#071F24] font-[500] text-[21px] flex justify-center items-center gap-3 rounded-t-[10px]">
                  <span>
                    <FaGift />
                  </span>
                  {/* <span>Choice {String.fromCharCode(65 + idx)}</span> */}
                  <span>{product.title}</span>
                </div>
                <div className="relative bg-gray-100 min-h-[280px] overflow-hidden">
                  <img
                    src={product.featuredImage?.url || '/assets/orlando.jpg'}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 w-full bg-white/20 backdrop-blur-md py-4 px-2">
                    {/* <h3 className="text-lg font-semibold text-[#0E424E] mb-1 text-center">
                      {product.title}
                    </h3> */}
                    <p className="font-[400] text-[16px] text-[#FEFEFE] text-center">
                      {product.description?.split('\n')[0]}
                    </p>
                  </div>
                </div>

                <div className="">
                  <form
                    method="post"
                    action="/cart"
                    className="flex flex-col items-center"
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
                    {selectedBonus &&
                    selectedBonusVariantId === product.variants.nodes[0]?.id ? (
                      <button
                        type="button"
                        className="w-full text-[#071F24] rounded-b-lg py-2 px-4 font-semibold flex items-center justify-center gap-2 bg-[#F2B233] opacity-50 cursor-not-allowed"
                        disabled
                      >
                        Selected <BsPlusCircleFill />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className={`w-full text-[#071F24] rounded-b-lg py-2 px-4 font-semibold flex items-center justify-center gap-2 bg-[#F2B233] ${
                          !product.variants.nodes[0]?.id ||
                          (selectedBonus &&
                            selectedBonusVariantId !==
                              product.variants.nodes[0]?.id)
                            ? 'opacity-70 pointer-events-none'
                            : ''
                        }`}
                        disabled={
                          !product.variants.nodes[0]?.id ||
                          (selectedBonus &&
                            selectedBonusVariantId !==
                              product.variants.nodes[0]?.id)
                        }
                      >
                        Select <BsPlusCircleFill />
                      </button>
                    )}
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

        <p className="text-[#676767] font-[400] text-[16px] flex items-center justify-center tracking-wider text-center">
          Please contact us if you would like to change your gift later” to 🎁
          The Bonus Vacation is yours today — guaranteed! <br /> ✨ Pick your
          favorite now, but if you want to change it later, no worries — *you’ll
          unlock all three options once your Featured Vacation is complete.{' '}
          <br />
          Cant Decide? No worries-choose later! Create A CTA Button Lock In My
          Bonus Now Choose Later.
        </p>
      </div>
    </div>
  );
}
