import React, {useState} from 'react';
import {FaLocationDot} from 'react-icons/fa6';
import {FaEnvelope, FaComments} from 'react-icons/fa';
import SectionHeroBanner from './SectionHeroBanner';
// Figma green color
const green = '#8DD3C7';
const greenHover = '#6fc1b2';
const greyBg = '#F5F5F5';

export default function ContactUs() {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <div>
        <SectionHeroBanner
          tagline="General Inquiry"
          title="Ask Discover
We're here to help you Discover more, stress less."
          description="Ask away — your My Discover Vacation starts here.
Whether you're planning a trip, managing a reservation, or just need a few details clarified, our team is ready to help. Fill out the form below and we'll get back to you within one business day."
          image="/assets/beach3.png"
        />
        <div
          className="w-full flex flex-col md:flex-row gap-8 max-w-6xl mx-auto px-2 md:px-0 pb-12"
          style={{alignItems: 'stretch'}}
        >
          {/* Left: Form */}
          <form
            className="flex-1 bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col gap-4 min-w-[0] animate-fade-in justify-between w-full max-w-full"
            style={{minHeight: 520}}
          >
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
                General Inquire Form
              </h2>
              <p className="text-gray-500 mb-4 text-sm sm:text-base">
                Please fill out to form for sending your message.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-gray-800 focus:ring-2 focus:ring-green-200 focus:bg-white transition text-sm sm:text-base"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-gray-800 focus:ring-2 focus:ring-green-200 focus:bg-white transition text-sm sm:text-base mt-2 md:mt-0"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-gray-800 focus:ring-2 focus:ring-green-200 focus:bg-white transition text-sm sm:text-base"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-gray-800 focus:ring-2 focus:ring-green-200 focus:bg-white transition text-sm sm:text-base mt-2 md:mt-0"
                />
              </div>
              <div className="mt-4">
                <label
                  className="block text-gray-700 font-medium mb-1"
                  htmlFor="message"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  placeholder="Please write here."
                  rows={5}
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-gray-800 focus:ring-2 focus:ring-green-200 focus:bg-white transition resize-none text-sm sm:text-base"
                />
              </div>
              <div className="flex items-start gap-2 mt-2">
                <input
                  id="consent"
                  type="checkbox"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                  className="mt-1 accent-green-400"
                />
                <label
                  htmlFor="consent"
                  className="text-xs text-gray-500 select-none"
                >
                  By submitting this form, you consent to be contacted by
                  Discover Vacations via phone, email, or SMS. Standard
                  messaging rates may apply.
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="mt-2 font-semibold py-2 px-8 rounded-md shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-200 self-start w-full sm:w-auto text-base"
              style={{background: green, color: 'white'}}
            >
              Submit
            </button>
          </form>
          {/* Right: Contact Cards */}
          <div
            className="flex flex-col gap-6 flex-1 min-w-[0] max-w-full md:max-w-sm justify-between mt-8 md:mt-0 w-full"
            style={{
              background: greyBg,
              borderRadius: '0.75rem',
              padding: '2rem 1.5rem',
              minHeight: 520,
            }}
          >
            {/* Address Card */}
            <div className="flex flex-col gap-2 mb-2">
              <div
                className="flex items-center gap-2 mb-1 text-green-500"
                style={{color: green}}
              >
                <FaLocationDot size={20} />
                <span className="font-semibold text-gray-700">Address</span>
              </div>
              <div className="text-gray-700 text-sm leading-tight mb-2">
                2881 F.Oakland Park Blvd
                <br />
                Suite 205
                <br />
                Fort Lauderdale, FL 33306
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full border rounded-md py-2 font-medium text-center transition-all duration-150"
                style={{borderColor: green, color: green, background: 'white'}}
              >
                Get Directions
              </a>
            </div>
            {/* Email Card */}
            <div className="flex flex-col gap-2 mb-2">
              <div
                className="flex items-center gap-2 mb-1 text-green-500"
                style={{color: green}}
              >
                <FaEnvelope size={18} />
                <span className="font-semibold text-gray-700">Email</span>
              </div>
              <div className="text-gray-700 text-sm mb-2">
                customercare@mydiscovervacations.com
              </div>
              <a
                href="mailto:customercare@mydiscovervacations.com"
                className="mt-2 w-full border rounded-md py-2 font-medium text-center transition-all duration-150"
                style={{borderColor: green, color: green, background: 'white'}}
              >
                Email Us
              </a>
            </div>
            {/* Live Chat Card */}
            <div className="flex flex-col gap-2">
              <div
                className="flex items-center gap-2 mb-1 text-green-500"
                style={{color: green}}
              >
                <FaComments size={18} />
                <span className="font-semibold text-gray-700">Live Chat</span>
              </div>
              <div className="text-gray-700 text-sm mb-2">
                Team is available Mon-Sat 9am - 6pm EST.
              </div>
              <div className="relative group inline-block">
                <button
                  className="bg-gray-300 text-gray-500 cursor-not-allowed px-6 py-2 rounded-lg font-semibold flex items-center gap-2 opacity-60"
                  disabled
                >
                  Live Chat
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
