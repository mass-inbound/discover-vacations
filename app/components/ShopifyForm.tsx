import {ShopifyForm as ShopifyFormsEmbed} from 'shopify-hydrogen-form-embed';
import {useState} from 'react';
import {FaLocationDot} from 'react-icons/fa6';
import {FaEnvelope, FaComments} from 'react-icons/fa';
import SectionHeroBanner from './SectionHeroBanner';

// Note: Styling now handled via Shopify Forms embed props

export default function ShopifyForm() {
  const [submitMessage, setSubmitMessage] = useState('');

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
          {/* Left: Shopify Forms Embed */}
          <div
            className="flex-1 bg-gray-100 rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8 flex flex-col gap-4 min-w-[0] animate-fade-in justify-between w-full max-w-full"
            style={{minHeight: 520}}
          >
            <div>
              {/* <h2 className="text-xl sm:text-[21px] font-[500] text-[#071F24] mb-1">
                General Inquiry Form
              </h2> */}

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

              <ShopifyFormsEmbed
                shopUrl="discover-vacations.myshopify.com"
                formId="589236"
                formStyle={`
                    .form-container {
                      background-color: #F4E4BC;
                      padding: 20px;
                      border-radius: 10px;
                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    button {
                      background-color: #2ab7b7;
                      color: #FFFFFF;
                      border-radius: 5px;
                      padding: 10px 20px;
                      border: none;
                      cursor: pointer;
                      transition: background-color 0.3s ease;
                    }
                    button:hover {
                      background-color: #1a9b9b;
                    }
                  `}
                formProps={{
                  'data-forms-padding-top': '20',
                  'data-forms-padding-bottom': '20',
                  'data-forms-text-color': '#333333',
                  'data-forms-button-background-color': '#2ab7b7',
                  'data-forms-button-label-color': '#FFFFFF',
                }}
              />
              <p className="text-[#111] my-4 text-[10px] sm:text-[12px] font-[400] opacity-70">
                For general questions or non-urgent help, please use our{' '}
                <span className="font-bold">
                  Ask Discover and one of our agents will reach out to you
                  shortly.
                </span>
              </p>
            </div>
          </div>

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
