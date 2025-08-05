import React, {useState} from 'react';
import {FaLocationDot} from 'react-icons/fa6';
import {FaEnvelope, FaComments} from 'react-icons/fa';
import SectionHeroBanner from './SectionHeroBanner';

export default function NewContactUs() {
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
          <div
            className="flex-1 bg-gray-100 rounded-xl shadow-lg border border-gray-200 sm:p-6 md:p-8 flex flex-col gap-4 min-w-[0] min-h-screen md:min-h-[820px] animate-fade-in justify-between w-full max-w-full"
            style={{minHeight: 820}}
          >
            <div className="w-full">
              <iframe
                id="JotFormIFrame-252155661988065"
                title="General Inquiry Form"
                allowTransparency={true}
                allow="geolocation; microphone; camera; fullscreen; payment"
                src="https://forms.inboundrequest.com/252155661988065"
                style={{
                  minWidth: '100%',
                  maxWidth: '100%',
                  border: 'none',
                  height: '100%',
                  minHeight: 800,
                }}
              ></iframe>
            </div>
          </div>
          {/* Right: Contact Cards */}
          <div
            className="flex flex-col flex-1 min-w-[0] max-w-full md:max-w-sm gap-8 mt-8 md:mt-0 w-full"
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
