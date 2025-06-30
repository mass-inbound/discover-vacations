import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {FaFacebookF, FaInstagram, FaTwitter} from 'react-icons/fa';
import {MdEmail} from 'react-icons/md';
import {Link} from 'react-router';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-[#0E424E] text-white pt-12 pb-4">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
              {/* Brand/Logo */}
              <div className="flex flex-col gap-4">
                <img
                  src="/assets/footerIcon.png"
                  alt="Discover Vacations"
                  className="w-[300px] mb-2"
                />
                <p className="text-sm opacity-80">
                  Catch the Wave. Discover More For Less.
                </p>
                <div className="flex gap-3 mt-2">
                  <a
                    href="#"
                    className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <FaFacebookF />
                  </a>
                  <a
                    href="#"
                    className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="#"
                    className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <FaTwitter />
                  </a>
                </div>
              </div>
              {/* About */}
              <div>
                <h4 className="font-bold mb-6 text-lg">About</h4>
                <ul className="space-y-4 text-sm opacity-90">
                  <li>
                    <Link to={'/how-it-works'} className="hover:underline">
                      How it works
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Offers
                    </a>
                  </li>
                  <li>
                    <Link to={'/faq'} className="hover:underline">
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="hover:underline">
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Help */}
              <div>
                <h4 className="font-bold mb-6 text-lg">Help</h4>
                <ul className="space-y-4 text-sm opacity-90">
                  <li>
                    <a href="#" className="hover:underline">
                      Refund & Cancellation Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      TCPA Policy
                    </a>
                  </li>
                  <li>
                    <Link to="/contact-us" className="hover:underline">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Newsletter */}
              <div>
                <h4 className="font-bold mb-6 text-lg">Be the first know.</h4>
                <p className="text-sm opacity-80 mb-5">
                  Stay up to date on our upcoming sales and get access to
                  subscriber-only discount codes.
                </p>
                <form className="flex flex-col gap-4">
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2AB7B7] text-lg" />
                    <input
                      type="email"
                      placeholder="youremail@gmail.com"
                      className="pl-10 pr-3 py-2 rounded bg-[#EAF8F8] text-[#0E424E] w-full outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#2AB7B7] text-white rounded py-2 font-semibold hover:bg-[#229a9a] transition"
                  >
                    JOIN NOW
                  </button>
                </form>
              </div>
            </div>
            <div className="border-t border-white/20 mt-10 pt-4 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 text-xs opacity-80">
              <span>©2024 My Discover Vacations. All rights reserved</span>
              <div className="flex gap-4 mt-2 md:mt-0">
                <a href="#" className="hover:underline">
                  Privacy & Policy
                </a>
                <a href="#" className="hover:underline">
                  Terms of Use
                </a>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}
const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
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
    color: isPending ? 'grey' : 'white',
  };
}
