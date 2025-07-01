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
    <div className="flex flex-col items-center w-full px-2 sm:px-0 ">
      <SectionHeroBanner
        tagline="FAQS"
        title="Looking for Answers?"
        description="You've come to the right place. From booking and payments to rescheduling and bonus gifts, we've gathered the most common questions right here to help you plan with confidence. Still have a question? Ask Discover and one of our team members will follow up with personalized support — or use our chat feature (coming soon) for instant help."
        image="/assets/beach2.png"
      />
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className="w-full max-w-3xl sm:rounded-lg rounded-md bg-white shadow-md mb-4 sm:mb-6 overflow-hidden transition-all duration-300 max-w-full"
        >
          <button
            className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between items-start justify-start p-3 sm:p-4 focus:outline-none group gap-2 sm:gap-0"
            onClick={() => toggle(idx)}
            aria-expanded={openIdx === idx}
            aria-controls={`faq-panel-${idx}`}
          >
            <div className="text-left w-full">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 break-words">
                {faq.question}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                {openIdx === idx ? faq.answer : faq.summary}
              </p>
            </div>
            <span
              className={`sm:ml-4 ml-0 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`}
            >
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
              <p className="text-gray-600 text-sm sm:text-base">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
