import {Suspense, useState, useRef, useEffect} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {FaLocationDot} from 'react-icons/fa6';
import {HiChevronDown, HiMenu, HiX} from 'react-icons/hi';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDestinationsDropdown, setShowDestinationsDropdown] =
    useState(false);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll and update state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Change design after scrolling 50px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        showDestinationsDropdown &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setShowDestinationsDropdown(false);
      }
      if (
        showHelpDropdown &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setShowHelpDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDestinationsDropdown, showHelpDropdown]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileMenu]);

  // Nav items
  const navLinks = [
    {
      label: 'Destinations',
      dropdown: true,
      button: true,
      items: [
        {label: 'Orlando, FL', href: '/destinations/orlando'},
        {label: 'Poconos, PA', href: '/destinations/poconos'},
      ],
    },
    {label: 'How it Works', href: '/how-it-works'},
    {
      label: 'Help',
      dropdown: true,
      items: [
        {label: 'FAQ', href: '/faq'},
        {label: 'Contact Us', href: '/contact-us'},
      ],
    },
    {label: 'Log in', href: '/account'},
  ];

  return (
    <header
      className={` ${
        isScrolled
          ? 'bg-[rgba(255,255,255,0.70)] shadow-lg backdrop-blur-[4px] fixed top-4 left-8 right-8 h-[68px] rounded-[10px]'
          : 'bg-white shadow-sm w-full sticky top-0 h-[100px]'
      }  z-9 transition-all duration-300`}
    >
      <div className="max-w-8xl mx-auto md:px-12 px-3 flex items-center justify-between h-full">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2" end>
          <img
            src="/assets/navLogo.png"
            alt="Discover Vacations"
            className="w-[100px] md:w-[170px]"
          />
        </NavLink>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 ml-8 relative">
          {/* Destinations Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowDestinationsDropdown(true)}
            onMouseLeave={() => setShowDestinationsDropdown(false)}
          >
            <button
              className="flex items-center gap-2 bg-[#F2B233] hover:bg-[#e0a800] text-black font-medium px-4 py-2 rounded-[10px] text-[16px] shadow transition"
              onClick={() => setShowDestinationsDropdown((v) => !v)}
              type="button"
            >
              <FaLocationDot className="text-lg" />
              Destinations
              <HiChevronDown className="ml-1 text-base" />
            </button>
            {showDestinationsDropdown && (
              <div className="absolute left-0 bg-white rounded shadow-lg py-2 min-w-[180px] z-30">
                {navLinks[0]?.items?.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className="block px-4 py-2 text-[#151515] hover:bg-[#F2B233]/20 text-[16px]"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          {/* Other Nav Links */}
          <NavLink
            to="/how-it-works"
            className="text-[#151515] text-[16px] font-[400] hover:underline"
          >
            How it Works
          </NavLink>
          {/* Help Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowHelpDropdown(true)}
            onMouseLeave={() => setShowHelpDropdown(false)}
          >
            <button
              className="flex items-center gap-1 text-[#151515] text-[16px] font-[400] hover:underline"
              onClick={() => setShowHelpDropdown((v) => !v)}
              type="button"
            >
              Help
              <HiChevronDown className="ml-1 text-base" />
            </button>
            {showHelpDropdown && (
              <div className="absolute left-0 bg-white rounded shadow-lg py-2 min-w-[150px] z-30">
                {navLinks[2]?.items?.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className="block px-4 py-2 text-[#151515] hover:bg-[#F2B233]/20 text-[16px]"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          <NavLink
            to="/account"
            className="text-[#151515] text-[16px] font-[400] hover:underline"
          >
            Log in
          </NavLink>
          {/* Cart Button */}
          <div className="ml-4 bg-[#164C51] px-6 py-2 rounded-[10px]">
            <CartToggle cart={cart} />
          </div>
        </nav>
        {/* Mobile Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="bg-[#164C51] px-3 py-2 rounded-[10px]">
            <CartToggle cart={cart} />
          </div>
          <button className="p-2" onClick={() => setShowMobileMenu((v) => !v)}>
            {showMobileMenu ? (
              <HiX className="w-7 h-7" />
            ) : (
              <HiMenu className="w-7 h-7" />
            )}
          </button>
          {/* Always show cart button on mobile */}
        </div>
      </div>
      {/* Mobile Drawer */}
      {showMobileMenu && (
        <div ref={mobileMenuRef} className="fixed inset-0 bg-black/40 z-50">
          <div className="fixed top-0 left-0 w-72 h-full bg-white shadow-lg p-6 flex flex-col gap-6 animate-slideIn">
            <button
              className="self-end mb-4"
              onClick={() => setShowMobileMenu(false)}
            >
              <HiX className="w-7 h-7" />
            </button>
            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-4">
              {/* Destinations Dropdown */}
              <div>
                <button
                  className="flex items-center gap-2 bg-[#F2B233] text-black font-medium px-4 py-2 rounded-full text-[16px] shadow w-full justify-between"
                  onClick={() => setShowDestinationsDropdown((v) => !v)}
                  type="button"
                >
                  <span className="flex items-center gap-2">
                    <FaLocationDot className="text-lg" /> Destinations
                  </span>
                  <HiChevronDown
                    className={`ml-1 text-base transition-transform ${showDestinationsDropdown ? 'rotate-180' : ''}`}
                  />
                </button>
                {showDestinationsDropdown && (
                  <div className="mt-2 bg-white rounded shadow-lg py-2 min-w-[180px] z-30">
                    {navLinks[0]?.items?.map((item) => (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        className="block px-4 py-2 text-[#151515] hover:bg-[#F2B233]/20 text-[16px]"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
              <NavLink
                to="/how-it-works"
                className="text-[#151515] text-[16px] font-[400] hover:underline"
                onClick={() => setShowMobileMenu(false)}
              >
                How it Works
              </NavLink>
              {/* Help Dropdown */}
              <div>
                <button
                  className="flex items-center gap-1 text-[#151515] text-[16px] font-[400] hover:underline w-full justify-between"
                  onClick={() => setShowHelpDropdown((v) => !v)}
                  type="button"
                >
                  <span>Help</span>
                  <HiChevronDown
                    className={`ml-1 text-base transition-transform ${showHelpDropdown ? 'rotate-180' : ''}`}
                  />
                </button>
                {showHelpDropdown && (
                  <div className="mt-2 bg-white rounded shadow-lg py-2 min-w-[150px] z-30">
                    {navLinks[2]?.items?.map((item) => (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        className="block px-4 py-2 text-[#151515] hover:bg-[#F2B233]/20 text-[16px]"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
              <NavLink
                to="/account"
                className="text-[#151515] text-[16px] font-[400] hover:underline"
                onClick={() => setShowMobileMenu(false)}
              >
                Log in
              </NavLink>
              {/* Cart Button */}
              <div className="mt-4 ">
                <CartToggle cart={cart} />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <NavLink
      to="/cart"
      // onClick={(e) => {
      //   e.preventDefault();
      //   open('cart');
      //   publish('cart_viewed', {
      //     cart,
      //     prevCart,
      //     shop,
      //     url: window.location.href || '',
      //   } as CartViewPayload);
      // }}
      className="relative flex items-center text-white font-[500] text-[14px]"
    >
      <svg
        className="w-6 h-6 mr-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 0 0 7.48 19h9.04a2 2 0 0 0 1.83-1.3L21 13M7 13V6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v7"
        />
      </svg>
      Cart {count === null ? <span>&nbsp;</span> : count}
    </NavLink>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
