import {useEffect, useRef, useState} from 'react';
import {IoDiamond} from 'react-icons/io5';
import {FaCheck, FaGift} from 'react-icons/fa6';

type PriceRange = {min: number; max: number};

type PriceRangeFilterProps = {
  maxProductPrice?: number;
};

export default function DiscoverOfferPage({
  maxProductPrice = 10000,
}: PriceRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Sort by');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = ['Price', 'Popularity', 'Rating'];

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const MIN = 0;
  const MAX = maxProductPrice;

  // Accordion state
  const [openSections, setOpenSections] = useState<{price: boolean}>({
    price: true,
  });

  // Input values as strings
  const [inputValues, setInputValues] = useState<{min: string; max: string}>({
    min: MIN.toString(),
    max: MAX.toString(),
  });

  // Numeric price range
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: MIN,
    max: MAX,
  });

  // Refs for slider track and thumbs
  const rangeRef = useRef<HTMLDivElement>(null);
  const rangeTrackRef = useRef<HTMLDivElement>(null);
  const minThumbRef = useRef<HTMLDivElement>(null);
  const maxThumbRef = useRef<HTMLDivElement>(null);

  // Toggle accordion sections
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({...prev, [section]: !prev[section]}));
  };

  // Handle input field changes
  const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
    if (!/^\d*$/.test(value)) return;

    setInputValues((prev) => ({...prev, [type]: value}));

    if (value !== '') {
      const numValue = parseInt(value, 10);
      if (type === 'min' && numValue <= priceRange.max) {
        setPriceRange((prev) => ({...prev, min: numValue}));
      } else if (type === 'max' && numValue >= priceRange.min) {
        setPriceRange((prev) => ({...prev, max: numValue}));
      }
    }
  };

  // Update slider thumbs and track
  useEffect(() => {
    const rangeEl = rangeRef.current;
    const trackEl = rangeTrackRef.current;
    const minThumb = minThumbRef.current;
    const maxThumb = maxThumbRef.current;
    if (!rangeEl || !trackEl || !minThumb || !maxThumb) return;

    const rangeWidth = rangeEl.offsetWidth;
    const minPercent = (priceRange.min / MAX) * 100;
    const maxPercent = (priceRange.max / MAX) * 100;

    // Position thumbs
    minThumb.style.left = `${minPercent}%`;
    maxThumb.style.left = `${maxPercent}%`;

    // Position and size track
    trackEl.style.left = `${minPercent}%`;
    trackEl.style.width = `${maxPercent - minPercent}%`;
  }, [priceRange, MAX]);

  // Drag handler
  const handleThumbDrag = (type: 'min' | 'max') => {
    const rangeEl = rangeRef.current;
    if (!rangeEl) return;
    const rect = rangeEl.getBoundingClientRect();

    const onMouseMove = (e: MouseEvent) => {
      const pos = Math.min(
        1,
        Math.max(0, (e.clientX - rect.left) / rect.width),
      );
      const value = Math.round(pos * MAX);

      if (type === 'min') {
        const newMin = Math.min(value, priceRange.max);
        setPriceRange((prev) => ({...prev, min: newMin}));
        setInputValues((prev) => ({...prev, min: newMin.toString()}));
      } else {
        const newMax = Math.max(value, priceRange.min);
        setPriceRange((prev) => ({...prev, max: newMax}));
        setInputValues((prev) => ({...prev, max: newMax.toString()}));
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div>
      <div
        style={{
          backgroundImage: "url('/assets/discoverImage.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div className="flex flex-col items-center">
          <p className="font-[500] text-[14px]">Plan Less, Experience More</p>
          <h1 className="font-[800] text-[46px]"> ALL VACATION OFFERS</h1>
          <p className="max-w-3xl font-[400] text-[16px] text-center">
            Browse our full range of vacation package from beach escapes to
            scenic retreats. Each offer includes flexible pricing, convenient
            options, and a seamless booking experience to match your travel
            needs.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] my-7 mx-auto">
        <div
          className="flex gap-2 items-center justify-end relative"
          ref={dropdownRef}
        >
          <p className="font-[400] text-[18px] text-[#0E424E]">Sort by</p>
          <button
            className="border border-[#2AB7B7] rounded-[10px] p-3 flex items-center justify-between w-[150px]"
            onClick={toggleDropdown}
          >
            <span>{selected}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-[#2AB7B7] transform transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isOpen && (
            <ul className="absolute top-full right-0 mt-2 w-[150px] bg-white border border-[#2AB7B7] rounded-[10px] shadow-lg z-10">
              {options.map((option) => (
                <li
                  key={option}
                  className="p-2 hover:bg-[#E6F7F7] hover:rounded-[10px] cursor-pointer"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-14 my-14">
          <div className="w-[400px] p-6 border border-[#E5E5E5] rounded-[10px] shadow-md">
            {/* Destination Filter */}
            <div className="mb-6">
              <h2 className="text-[#0E424E] text-[18px] font-[500] mb-4">
                Destination
              </h2>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-[#1A202C] text-[16px] font-[400]">
                  <input type="checkbox" className="w-4 h-4" />
                  Orlando, FL (4)
                </label>
                <label className="flex items-center gap-2 text-[#1A202C] text-[16px] font-[400]">
                  <input type="checkbox" className="w-4 h-4" />
                  Poconos, PA (1)
                </label>
              </div>
            </div>

            {/* Vacation Type Filter */}
            <div className="mb-6">
              <h2 className="text-[#0E424E] text-[18px] font-[500] mb-4">
                Vacation Type
              </h2>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-[#1A202C] text-[16px] font-[400]">
                  <input type="checkbox" className="w-4 h-4" />
                  Hotels
                </label>
                <label className="flex items-center gap-2 text-[#1A202C] text-[16px] font-[400]">
                  <input type="checkbox" className="w-4 h-4" />
                  Cruise
                </label>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <button
                className="text-lg mb-2 flex justify-between items-center w-full text-left"
                onClick={() => toggleSection('price')}
                aria-expanded={openSections.price}
                aria-controls="price-panel"
              >
                PRICE RANGE
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className={`bi bi-chevron-down transition-transform ${openSections.price ? '' : '-rotate-90'}`}
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </button>

              <div
                id="price-panel"
                className={`space-y-4 overflow-hidden transition-all ${openSections.price ? 'max-h-60' : 'max-h-0'}`}
              >
                {/* Inputs */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValues.min}
                    onChange={(e) =>
                      handlePriceInputChange('min', e.target.value)
                    }
                    className="border border-gray-300 px-2 py-1 w-20 text-center"
                    aria-label="Minimum price"
                  />
                  <input
                    type="text"
                    value={inputValues.max}
                    onChange={(e) =>
                      handlePriceInputChange('max', e.target.value)
                    }
                    className="border border-gray-300 px-2 py-1 w-20 text-center"
                    aria-label="Maximum price"
                  />
                </div>

                {/* Slider */}
                <div
                  className="relative h-1 bg-gray-200 rounded mt-6 mb-8 mx-2"
                  ref={rangeRef}
                >
                  <div
                    className="absolute h-1 bg-gray-500 rounded"
                    ref={rangeTrackRef}
                  />

                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full cursor-pointer"
                    ref={minThumbRef}
                    style={{left: '0%'}}
                    onMouseDown={() => handleThumbDrag('min')}
                    role="slider"
                    aria-valuemin={MIN}
                    aria-valuemax={MAX}
                    aria-valuenow={priceRange.min}
                    aria-label="Minimum price slider"
                    tabIndex={0}
                  />

                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full cursor-pointer"
                    ref={maxThumbRef}
                    style={{left: '100%'}}
                    onMouseDown={() => handleThumbDrag('max')}
                    role="slider"
                    aria-valuemin={MIN}
                    aria-valuemax={MAX}
                    aria-valuenow={priceRange.max}
                    aria-label="Maximum price slider"
                    tabIndex={0}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right side content  */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="relative bg-white rounded-lg shadow flex flex-col">
              <div className="absolute -top-7 left-1 flex items-center justify-center gap-1 bg-[#F2B233] text-[#FEFEFE] px-2 py-1 text-[14px] font-[400] rounded">
                <IoDiamond /> <span>Exclusive Offer</span>
              </div>

              <div className="relative w-full h-[280px] rounded-t mb-4 overflow-hidden">
                {/* Discount polygon badge */}
                <img
                  src="/assets/polygonDiscount.svg"
                  alt="Discount"
                  className="absolute top-0 right-0 z-8"
                />

                {/* Destination image */}
                <img
                  src="/assets/DestinationImage.png"
                  alt="Orlando, FL"
                  className="w-full h-full object-cover"
                />

                {/* Destination title */}
                <h4 className="absolute top-3 left-4 font-bold text-white text-[20px] z-10">
                  Orlando, FL
                </h4>

                {/* Details button */}
                <button className="absolute left-4 bottom-3 text-[#26A5A5] bg-white px-4 py-1 text-[16px] font-medium z-10 rounded">
                  Details
                </button>
              </div>

              <ul className="text-sm text-[#000] mb-4 list-disc list-inside pl-4 space-y-2">
                <li className="flex gap-2 items-center">
                  <FaCheck className="text-amber-400" />{' '}
                  <span>2 night hotel accommodation for two adults</span>
                </li>
                <li className="flex gap-2 items-center">
                  <FaCheck className="text-amber-400" />{' '}
                  <span>Includes flights, Park Hopper tickets, City Bus</span>
                </li>
              </ul>
              <div className="bg-[#FBE7C0] rounded-[8px] px-3 py-1 mx-4 flex gap-2 items-center justify-center">
                <FaGift />
                <span className="text-[16px] font-[400] text-[#151515]">
                  Includes a Gift: Your Next Vacation, On Us
                </span>
              </div>
              <div className="mt-8 p-4 bg-[#F5F5F5] flex flex-col gap-1 items-center justify-center border-t border-gray-300">
                <span className="text-[#676767] font-[400] text-[13px]">
                  3 night/4 days
                </span>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[#135868] font-[500] text-[27px]">
                    $49
                  </span>
                  <span className="text-[#135868] font-[500] text-[12px]">
                    per <br /> couple
                  </span>
                </div>
                <span className="text-[#676767] font-[400] text-[13px]">
                  not included taxes + fees
                </span>
              </div>
              <div className="bg-[#2AB7B7] h-[28px] flex justify-center items-center rounded-b text-white font-[500] text-[12px]">
                Select Offer
              </div>
            </div>

            <div className="relative bg-white rounded-lg shadow flex flex-col">
              <div className="relative w-full h-[280px] rounded-t mb-4 overflow-hidden">
                {/* Discount polygon badge */}
                <img
                  src="/assets/polygonDiscount.svg"
                  alt="Discount"
                  className="absolute top-0 right-0 z-8"
                />

                {/* Destination image */}
                <img
                  src="/assets/DestinationImage2.png"
                  alt="Orlando, FL"
                  className="w-full h-full object-cover"
                />

                {/* Destination title */}
                <h4 className="absolute top-3 left-4 font-bold text-white text-[20px] z-10">
                  Poconos, PA
                </h4>

                {/* Details button */}
                <button className="absolute left-4 bottom-3 text-[#26A5A5] bg-white px-4 py-1 text-[16px] font-medium z-10 rounded">
                  Details
                </button>
              </div>

              <ul className="text-sm text-[#000] mb-4 list-disc list-inside pl-4 space-y-2">
                <li className="flex gap-2 items-center">
                  <FaCheck className="text-amber-400" />{' '}
                  <span>3 nights hotel accommodations for two adults</span>
                </li>
                <li className="flex gap-2 items-center">
                  <FaCheck className="text-amber-400" />{' '}
                  <span>Enjoy Exclusive Perks During Your Stay</span>
                </li>
              </ul>
              <div className="bg-[#FBE7C0] rounded-[8px] px-3 py-1 mx-4 flex gap-2 items-center justify-center">
                <FaGift />
                <span className="text-[16px] font-[400] text-[#151515]">
                  Includes a Gift: Your Next Vacation, On Us
                </span>
              </div>
              <div className="mt-8 p-4 bg-[#F5F5F5] flex flex-col gap-1 items-center justify-center border-t border-gray-300">
                <span className="text-[#676767] font-[400] text-[13px]">
                  3 night/4 days
                </span>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[#135868] font-[500] text-[27px]">
                    $49
                  </span>
                  <span className="text-[#135868] font-[500] text-[12px]">
                    per <br /> couple
                  </span>
                </div>
                <span className="text-[#676767] font-[400] text-[13px]">
                  not included taxes + fees
                </span>
              </div>
              <div className="bg-[#2AB7B7] h-[28px] flex justify-center items-center rounded-b text-white font-[500] text-[12px]">
                Select Offer
              </div>
            </div>
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
