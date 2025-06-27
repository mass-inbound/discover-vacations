import {useState} from 'react';
import SectionHeroBanner from './SectionHeroBanner';
import {FaCircleChevronDown} from 'react-icons/fa6';

const faqs = [
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
  // Repeat 7 times for demo
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="flex flex-col items-center w-full ">
      <SectionHeroBanner
        tagline="FAQS"
        title="Frequently asked questions"
        description="Find quick answers to the most common questions about booking, payments, cancellations, and more. Still need help? Our support team is always here for you."
        image="/assets/beach2.png"
      />
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className="w-full max-w-3xl bg-white rounded-lg shadow-md mb-6 overflow-hidden transition-all duration-300"
        >
          <button
            className="w-full flex items-center justify-between p-4 focus:outline-none group"
            onClick={() => toggle(idx)}
            aria-expanded={openIdx === idx}
            aria-controls={`faq-panel-${idx}`}
          >
            <div className="text-left">
              <h3 className="text-xl font-semibold text-gray-800">
                {faq.question}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {openIdx === idx ? faq.answer : faq.summary}
              </p>
            </div>
            <span
              className={`ml-4 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`}
            >
              {/* <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="#22D3EE" />
                <path
                  d="M8 12.5l3 3 5-5"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg> */}
              <FaCircleChevronDown size={20} className="text-[#2AB7B7]" />
            </span>
          </button>
          <div
            id={`faq-panel-${idx}`}
            className={`grid transition-all duration-300 ease-in-out ${openIdx === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'} bg-white`}
            style={{
              padding: openIdx === idx ? '0 1rem 1rem 1rem' : '0 1rem',
            }}
          >
            <div className="overflow-hidden">
              <p className="text-gray-600 text-sm">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
