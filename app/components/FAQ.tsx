import React from 'react';

const faqs = [
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
  // Repeat 7 times for demo
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
  {
    question: 'Lorem Ipsum Neque porro qui dolorem?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
];

export default function FAQ() {
  return (
    <div className="flex flex-col items-center w-full py-8">
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className="w-full max-w-3xl bg-white rounded-lg shadow-md p-4 mb-6 flex items-start justify-between"
        >
          <div>
            <h3 className="text-xl font-semibold mb-1 text-gray-800">
              {faq.question}
            </h3>
            <p className="text-gray-600 text-sm">{faq.answer}</p>
          </div>
          <div className="ml-4 mt-2 text-teal-500">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#22D3EE" />
              <path
                d="M8 12.5l3 3 5-5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
} 