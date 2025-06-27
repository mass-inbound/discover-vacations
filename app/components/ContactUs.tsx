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
      <SectionHeroBanner
        tagline="General Inquire"
        title="Contact Us"
        description="Have a question, request, or just want to say hello? Fill out the form below or reach out to us directly, our team will get back to you as soon as possible."
        image="/assets/beach3.png"
      />
      <div
        className="w-full flex flex-col md:flex-row gap-8 max-w-6xl mx-auto px-2 md:px-0 pb-12"
        style={{alignItems: 'stretch'}}
      >
        {/* Left: Form */}
        <form
          className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4 min-w-[320px] animate-fade-in justify-between"
          style={{minHeight: 520}}
        >
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">
              General Inquire Form
            </h2>
            <p className="text-gray-500 mb-4">
              Please fill out to form for sending your message.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:ring-2 focus:ring-green-200 focus:bg-white transition"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:ring-2 focus:ring-green-200 focus:bg-white transition"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:ring-2 focus:ring-green-200 focus:bg-white transition"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:ring-2 focus:ring-green-200 focus:bg-white transition"
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
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 focus:ring-2 focus:ring-green-200 focus:bg-white transition resize-none"
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
                purchase. By clicking Continue Booking, I confirm that I am over
                age 25, and agree to the Privacy Policy and Terms & Conditions,
                both of which I agree I have read, understand and agree to. As
                an alternate to the above consent, click here for other ways to
                take advantage of this promotion.
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 font-semibold py-2 px-18 rounded-md shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-200 self-start"
            style={{background: green, color: 'white'}}
          >
            Submit
          </button>
        </form>
        {/* Right: Contact Cards */}
        <div
          className="flex flex-col gap-6 flex-1 min-w-[260px] max-w-sm justify-between"
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
            <button
              className="mt-2 w-full border rounded-md py-2 font-medium text-center transition-all duration-150"
              style={{borderColor: green, color: green, background: 'white'}}
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
