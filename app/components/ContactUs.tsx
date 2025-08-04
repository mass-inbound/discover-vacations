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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleInputChange = (e: any) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    });
    setChecked(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!checked) {
      setSubmitMessage('Please accept the terms and conditions.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phone,
        message: formData.message,
      };

      const response = await fetch(
        'https://rxmqy989nf.execute-api.us-east-2.amazonaws.com/submit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        clearForm();
        setSubmitMessage(
          "Thank you! Your message has been sent successfully. We'll get back to you within one business day.",
        );
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage(
        'There was an error submitting your form. Please try again or contact us directly at customercare@mydiscovervacations.com',
      );
    } finally {
      setIsSubmitting(false);
      // Clear message after 8 seconds
      setTimeout(() => setSubmitMessage(''), 8000);
    }
  };

  return (
    <>
      <div className="bg-white">
        <SectionHeroBanner
          tagline="Ask Discover"
          title="CONTACT US"
          description="We're here to help you Discover more, stress less. Ask away — your My Discover Vacation starts here. Whether you're planning a trip, managing a reservation, or just need a few details clarified, our team is ready to help.

Fill out the form below and we'll get back to you within one business day."
          image="/assets/beach3.png"
        />
        <div
          className="w-full flex flex-col md:flex-row gap-8 max-w-6xl mx-auto px-2 md:px-0 pb-12"
          style={{alignItems: 'stretch'}}
        >
          {/* Left: Form */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 bg-gray-100 rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8 flex flex-col gap-4 min-w-[0] animate-fade-in justify-between w-full max-w-full"
            style={{minHeight: 520}}
          >
            <div>
              <h2 className="text-xl sm:text-[21px] font-[500] text-[#071F24] mb-1">
                General Inquiry Form
              </h2>
              <p className="text-[#111] mb-4 text-sm sm:text-[13px] font-[400] opacity-70">
                For general questions or non-urgent help, please use our{' '}
                <span className="font-bold">
                  Ask Discover and one of our agents will reach out to you
                  shortly.
                </span>
              </p>

              {/* Success/Error Message */}
              {submitMessage && (
                <div
                  className={`mb-4 p-3 rounded-[10px] text-sm ${
                    submitMessage.includes('Thank you')
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  required
                  className="flex-1 rounded-[10px] border border-gray-100 shadow-lg bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-gray-800 focus:ring-2 focus:ring-green-200 focus:bg-white transition text-sm sm:text-base"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  required
                  className="flex-1 rounded-[10px] border border-gray-100 shadow-lg bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-gray-800 focus:ring-2 focus:ring-green-200 focus:bg-white transition text-sm sm:text-base mt-2 md:mt-0"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  className="flex-1 rounded-[10px] border border-gray-100 shadow-lg bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-gray-800 focus:ring-2 focus:ring-green-200 focus:bg-white transition text-sm sm:text-base"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="flex-1 rounded-[10px] border border-gray-100 shadow-lg bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-gray-800 focus:ring-2 focus:ring-green-200 focus:bg-white transition text-sm sm:text-base mt-2 md:mt-0"
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
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please write here."
                  rows={5}
                  required
                  className="w-full rounded-[10px] border border-gray-100 shadow-lg bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-gray-800 focus:ring-2 focus:ring-green-200 focus:bg-white transition resize-none text-sm sm:text-base"
                />
              </div>
              <div className="flex items-start gap-2 mt-2">
                <input
                  id="consent"
                  type="checkbox"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                  className="mt-1 accent-green-400"
                  required
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
              disabled={isSubmitting}
              className={`mt-2 font-semibold py-3 px-8 rounded-[10px] shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-200 self-start w-full text-base sm:text-[16px] sm:font-[600] ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#2AB7B7] hover:bg-[#1a8f8f]'
              }`}
              style={{color: 'white'}}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>

          {/* Right: Contact Cards */}
          <div
            className="flex flex-col flex-1 min-w-[0] max-w-full md:max-w-sm justify-between mt-8 md:mt-0 w-full"
            style={{
              minHeight: 520,
            }}
          >
            {/* Address Card */}
            <div className="flex flex-col gap-2 mb-2 bg-[#F5F5F5] rounded-[10px] px-4 py-8 shadow-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-1 text-[#2AB7B7]">
                <FaLocationDot size={20} />
                <span className="font-[400] text-[20px] text-[#0E424E]">
                  Corporate Address
                </span>
              </div>
              <div className="text-gray-700 text-sm leading-tight mb-2">
                2881 East Oakland Park Blvd
                <br />
                Suite 205
                <br />
                Fort Lauderdale, FL 33306
              </div>
            </div>

            {/* Email Card */}
            <div className="flex flex-col gap-2 mb-2 bg-[#F5F5F5] rounded-[10px] px-4 py-8 shadow-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-1 text-[#2AB7B7]">
                <FaEnvelope size={18} />
                <span className="font-[400] text-5 text-[#0E424E]">Email</span>
              </div>
              <div className="text-gray-700 text-sm mb-2">
                customercare@mydiscovervacations.com
              </div>
              <a
                href="mailto:customercare@mydiscovervacations.com"
                className="mt-2 max-w-[50%] rounded-[10px] py-2 font-medium text-center transition-all duration-150 border border-[#2AB7B7] text-[#2AB7B7] hover:bg-[#2AB7B7] hover:text-white"
              >
                Email Us
              </a>
            </div>

            {/* Live Chat Card */}
            <div className="flex flex-col gap-2 mb-2 bg-[#F5F5F5] rounded-[10px] px-4 py-8 shadow-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-1 text-[#2AB7B7]">
                <FaComments size={18} />
                <span className="font-[400] text-5 text-[#0E424E]">
                  Live Chat
                </span>
              </div>
              <div className="text-gray-700 text-sm mb-2">
                Team is available Mon-Sat 9am - 6pm EST.
              </div>
              <div className="relative group inline-block">
                <button
                  className="bg-gray-300 text-gray-500 cursor-not-allowed px-6 py-2 rounded-lg font-semibold flex items-center gap-2 opacity-60"
                  disabled
                >
                  COMING SOON
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
