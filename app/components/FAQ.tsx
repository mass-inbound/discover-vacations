import {useState} from 'react';
import SectionHeroBanner from './SectionHeroBanner';
import {FaCircleChevronDown} from 'react-icons/fa6';

const faqs = [
  {
    question:
      "What's included to make my vacation planning effortless and worry-free?",
    summary:
      "At Discover Vacations, we've built support, convenience, and peace of mind into every step of your journey: - Real support from real people — Our team is here to help before...",
    answer:
      "At Discover Vacations, we've built support, convenience, and peace of mind into every step of your journey:\n\n- Real support from real people — Our team is here to help before, during, and after your trip.\n- Secure, encrypted checkout — Your payment is protected using trusted technology.\n- Simple, guided booking — Select your dates, view available hotels, and manage your reservation easily through our online portal.\n- Flexible travel options — Choose dates that work for you, add extra nights, and upgrade accommodations when available — no pressure or hidden fees.",
  },
  {
    question: 'How do I complete the purchase of My Discover Vacation?',
    summary:
      'Booking your getaway is easy and streamlined with our online portal: 1. Choose A Location: Browse your exclusive offer and add to cart. 2. Pick A Date: Select now or later...',
    answer:
      "Booking your getaway is easy and streamlined with our online portal:\n\n1. Choose A Location: Browse your exclusive offer and add to cart.\n2. Pick A Date: Select now or later via the portal.\n3. Book Your Vacation: Complete your purchase to access the booking portal.\n\nYou'll receive a link via email/SMS to the My Discover Booking Hub. Enter your email and Package ID to log in or visit https://mydiscovervacations.com and click the MyDiscoverVacation button.",
  },
  {
    question: 'How do I access the My Discover Booking Hub after purchase?',
    summary:
      "Once your purchase is complete, you'll receive a link via email or SMS to access the My Discover Booking Hub. Enter your email and Package ID to log in. Or visit...",
    answer:
      "Once your purchase is complete, you'll receive a link via email or SMS to access the My Discover Booking Hub. Enter your email and Package ID to log in. Or visit https://mydiscovervacations.com and click the MyDiscoverVacation button to access the portal.",
  },
  {
    question: 'How was I selected for this offer?',
    summary:
      'You received this exclusive offer because you are part of our valued travel community. Whether through a past travel experience or direct connection, these offers are...',
    answer:
      'You received this exclusive offer because you are part of our valued travel community. Whether through a past travel experience or direct connection, these offers are by invitation only and not available to the general public.',
  },
  {
    question: "What's included in this vacation package?",
    summary:
      "You'll receive 4 Days / 3 Nights hotel accommodations for two adults at a participating hotel (3 stars+). After a short presentation on vacation ownership, you'll...",
    answer:
      "You'll receive 4 Days / 3 Nights hotel accommodations for two adults at a participating hotel (3 stars+). After a short presentation on vacation ownership, you'll receive a Bonus Vacation Gift — your choice of:\n\n- A 4-, 5-, or 7-night cruise for two\n- A 3-night U.S. hotel stay + $100 Visa Gift Card or Attraction Tickets (Orlando or Las Vegas only)\n- A 7-night resort condo stay for up to 4 travelers",
  },
  {
    question: 'How do I qualify for this Vacation Offer and Bonus Gift?',
    summary:
      'To receive the discounted vacation offer and bonus gift, both travelers must attend a full presentation hosted by a trusted resort partner. Both adults must be...',
    answer:
      'To receive the discounted vacation offer and bonus gift, both travelers must attend a full presentation hosted by a trusted resort partner. Both adults must be present to qualify.',
  },
  {
    question: 'Who is eligible to book this offer?',
    summary:
      'Eligibility: Must be a U.S. or Canadian resident, employed or retired Speak English or Spanish Married/cohabiting: one must be 28+, both must attend Retirees: 55+...',
    answer:
      'Eligibility:\n- Must be a U.S. or Canadian resident, employed or retired\n- Speak English or Spanish\n- Married/cohabiting: one must be 28+, both must attend\n- Retirees: 55+\n- Single women: 28+, Single men: 35+\nNot eligible: full-time students, timeshare employees, or those who attended a similar presentation in the last 12 months.',
  },
  {
    question: 'What kind of hotel will I be staying in?',
    summary:
      'All hotels are rated 3 stars or above (e.g., Holiday Inn Express Orlando, Hampton Inn Poconos). Resort fees, parking, and taxes are extra and due at check-in....',
    answer:
      'All hotels are rated 3 stars or above (e.g., Holiday Inn Express Orlando, Hampton Inn Poconos). Resort fees, parking, and taxes are extra and due at check-in.',
  },
  {
    question: 'How do I book my dates?',
    summary:
      "After purchase, you'll receive a confirmation email with booking access. In the portal, select preferred/alternate dates, choose a hotel, and add any upgrades....",
    answer:
      "After purchase, you'll receive a confirmation email with booking access. In the portal, select preferred/alternate dates, choose a hotel, and add any upgrades. A specialist will reconfirm your trip ~30 days before travel.",
  },
  {
    question: 'Can I change my reservation?',
    summary:
      'Changes made within 72 hours of arrival are subject to forfeiture. Other changes may incur a $25 fee and rate differences. No-shows or early departures void...',
    answer:
      'Changes made within 72 hours of arrival are subject to forfeiture. Other changes may incur a $25 fee and rate differences. No-shows or early departures void the vacation.',
  },
  {
    question: 'What fees will I pay at the hotel?',
    summary:
      'Typical hotel charges: - Parking/Valet: $10–$20 per night - Taxes: $37–$87 total - Resort fees: $15–$30/night - Credit card hold: $100–$250 for incidentals...',
    answer:
      'Typical hotel charges:\n- Parking/Valet: $10–$20 per night\n- Taxes: $37–$87 total\n- Resort fees: $15–$30/night\n- Credit card hold: $100–$250 for incidentals',
  },
  {
    question: "What's the deadline to travel?",
    summary:
      'Main trip must be completed within 12 months of purchase. Bonus Vacation must be registered within 6 months and used within 18 months....',
    answer:
      'Main trip must be completed within 12 months of purchase. Bonus Vacation must be registered within 6 months and used within 18 months.',
  },
  {
    question: 'Do I get my deposit back?',
    summary:
      'Deposits collected during booking may be credited to attractions/activities if you attend the required presentation. Refunds are not issued unless otherwise...',
    answer:
      'Deposits collected during booking may be credited to attractions/activities if you attend the required presentation. Refunds are not issued unless otherwise noted.',
  },
  {
    question: 'Can I cancel my vacation package?',
    summary:
      'Cancel in writing within 30 days of purchase. After that, sales are final unless extended with fees. Cancel via the Ask Discover form, phone, or mail (address...',
    answer:
      'Cancel in writing within 30 days of purchase. After that, sales are final unless extended with fees. Cancel via the Ask Discover form, phone, or mail (address provided in the doc).',
  },
  {
    question: 'Where do I manage my reservation?',
    summary:
      'All bookings are handled at https://portal.MyDiscoverVacations.com. View your confirmation, add enhancements, and manage your trip all in one place....',
    answer:
      'All bookings are handled at https://portal.MyDiscoverVacations.com. View your confirmation, add enhancements, and manage your trip all in one place.',
  },
  {
    question: 'What if I have questions about my bonus gift or rebate?',
    summary:
      "You'll receive bonus travel information by email about 21 days before your scheduled trip....",
    answer:
      "You'll receive bonus travel information by email about 21 days before your scheduled trip.",
  },
  {
    question: 'I have more questions. How do I get help?',
    summary:
      'For non-urgent help, use the Ask Discover form on the website. For urgent matters or travel within 5 days, call the provided number. Live Chat is coming...',
    answer:
      'For non-urgent help, use the Ask Discover form on the website. For urgent matters or travel within 5 days, call the provided number. Live Chat is coming soon.',
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="flex flex-col items-center w-full sm:px-0 ">
      <SectionHeroBanner
        tagline="FAQS"
        title="Looking for Answers?"
        description="You've come to the right place. From booking and payments to rescheduling and bonus gifts, we've gathered the most common questions right here to help you plan with confidence. Still have a question? Ask Discover and one of our team members will follow up with personalized support — or use our chat feature (coming soon) for instant help."
        image="/assets/beach2.png"
      />
      <div className="w-full max-w-6xl px-4 sm:px-6 sm:py-12">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="w-full pb-2 max-w-3xl sm:rounded-lg rounded-md bg-[#F5F5F5] shadow-md mb-4 mb-12 overflow-hidden transition-all duration-300 max-w-full"
          >
            <button
              className="w-full flex items-start justify-between p-3 sm:p-4 focus:outline-none group gap-2"
              onClick={() => toggle(idx)}
              aria-expanded={openIdx === idx}
              aria-controls={`faq-panel-${idx}`}
            >
              <div className="text-left w-full">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 break-words">
                  {faq.question}
                </h3>
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${openIdx === idx ? 'max-h-[500px] opacity-100' : 'max-h-[48px] opacity-100'}`}
                >
                  {openIdx === idx ? (
                    <p className="text-gray-600 text-sm sm:text-base">
                      {faq.answer}
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm sm:text-base">
                      {faq.summary}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`flex-shrink-0 transition-transform duration-500 ease-in-out ${openIdx === idx ? 'rotate-180' : ''}`}
              >
                <FaCircleChevronDown size={20} className="text-[#2AB7B7]" />
              </span>
            </button>

            <div id={`faq-panel-${idx}`} className="hidden"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
