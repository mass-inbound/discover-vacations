import {useState} from 'react';
import SectionHeroBanner from './SectionHeroBanner';
import {FaCircleChevronDown} from 'react-icons/fa6';

const faqs = [
  {
    question: 'Need Assistance?',
    summary:
      'For the fastest service, we recommend using our Ask Discover form located in the Help Section or email us at customercare@mydiscovervacations.com and one of our service agents will respond as soon as possible. Response times may vary, but we aim to reply within one business day. Please note: Phone and mail inquiries may experience longer wait times.',
    answer: (
      <>
        For the fastest service, we recommend using our Ask Discover form
        located in the Help Section or email us at{' '}
        <a
          href="mailto:customercare@mydiscovervacations.com"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          customercare@mydiscovervacations.com
        </a>{' '}
        and one of our service agents will respond as soon as possible. Response
        times may vary, but we aim to reply within one business day. Please
        note: Phone and mail inquiries may experience longer wait times.
      </>
    ),
  },
  {
    question:
      "What's included to make my vacation planning effortless and worry-free?",
    summary:
      'At Discover Vacations, we put you in control — with support when you need it: Manage your trip online anytime, Flexible travel options, Real support, Secure encrypted checkout...',
    answer: (
      <>
        At Discover Vacations, we put you in control — with support when you
        need it:
        <ul className="mt-2 list-disc pl-6">
          <li>
            Manage your trip online anytime — Use our secure Booking Portal to
            view hotels, choose your dates, upgrade accommodations (when
            available), and finalize your reservation — all at your convenience.
          </li>
          <li>
            Flexible travel options — Travel on your schedule. Add extra nights,
            explore available upgrades, and book when it works for you — no
            pressure, no hidden fees.
          </li>
          <li>
            Real support, just in case — Prefer a helping hand? Our friendly
            team is here before, during, and after your trip to guide you if
            needed.
          </li>
          <li>
            Secure, encrypted checkout — Your payment is protected with trusted
            technology and verified systems.
          </li>
        </ul>
      </>
    ),
  },
  {
    question: 'How do I complete the purchase of My Discover Vacation?',
    summary:
      'Booking your getaway is simple and secure through our Customer Booking Portal. Choose a Location, Pick a Date, Book Your Vacation...',
    answer: (
      <>
        Booking your getaway is simple and secure through our{' '}
        <strong>Customer Booking Portal</strong>. Here's how it works:
        <br />
        <br />
        <strong>1. Choose a Location:</strong>
        <br />
        Browse your exclusive offer and add it to your cart.
        <br />
        <br />
        <strong>2. Pick a Date:</strong>
        <br />
        Know your travel dates? Select them before checkout.
        <br />
        Not ready yet? No problem — complete your purchase now and log into the
        Booking Portal anytime to book when you're ready.
        <br />
        <br />
        <strong>3. Book Your Vacation:</strong>
        <br />
        After purchase, you'll receive access to your personalized booking
        portal — where reserving your trip is quick, easy, and secure.
        <ul className="mt-2 list-disc pl-6">
          <li>
            Look out for an email or SMS with a link to the Booking Portal.
          </li>
          <li>
            Or visit{' '}
            <a
              href="https://portal.mydiscovervacations.com"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://portal.mydiscovervacations.com
            </a>{' '}
            directly.
          </li>
          <li>Log in using your email address and Shopify Offer Number.</li>
          <li>
            Then, choose your preferred dates, select your hotel, and submit
            your request.
          </li>
        </ul>
      </>
    ),
  },
  {
    question:
      'How do I access the My Discover Vacations Customer Booking Portal after purchase?',
    summary:
      "Once your purchase is complete, you'll receive a link via email or SMS to access your Booking Portal. Simply enter your email address and Offer ID to log in...",
    answer: (
      <>
        Once your purchase is complete, you'll receive a link via email or SMS
        to access your Booking Portal. Simply enter your email address and Offer
        ID to log in and begin selecting your travel dates and hotel.
        Alternatively, visit{' '}
        <a
          href="https://portal.mydiscovervacations.com"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://portal.mydiscovervacations.com
        </a>{' '}
        and follow the prompts.
      </>
    ),
  },
  {
    question: 'How was I selected for this offer?',
    summary:
      'You received this exclusive offer because you are part of our valued travel community! Whether you connected with us in person or were invited through a past travel experience...',
    answer: (
      <>
        You received this exclusive offer because you are part of our valued
        travel community! Whether you connected with us in person or were
        invited through a past travel experience, this opportunity is extended
        by invitation only. These offers are not available to the general public
        and are crafted exclusively for those we believe will benefit most from
        our curated vacation experiences.
      </>
    ),
  },
  {
    question: "What's included in this vacation package?",
    summary:
      "You'll receive 4 Days / 3 Nights hotel accommodations for two adults at a participating hotel tied to your exclusive invitation — all rated 3 stars and above...",
    answer: (
      <>
        You'll receive <strong>4 Days / 3 Nights</strong> hotel accommodations
        for two adults at a participating hotel tied to your exclusive
        invitation — all rated 3 stars and above. As a thank you for
        participating in a short, fun presentation on vacation ownership, you'll
        also receive a <strong>Bonus Vacation</strong> — your{' '}
        <strong>CHOICE</strong> of:
        <ul className="mt-2 list-disc pl-6">
          <li>
            A 4-, 5-, or 7-night cruise for two aboard Carnival, NCL, Royal
            Caribbean or similar for two adults.
          </li>
          <li>
            A 3-night U.S. hotel stay + a $100 Perks Card or Attraction Tickets
            (Orlando or Las Vegas only)
          </li>
          <li>
            A 7-night resort condo stay for up to 4 travelers in U.S., Mexico,
            or Caribbean destinations
          </li>
        </ul>
      </>
    ),
  },
  {
    question: 'How do I qualify for this Vacation Offer and Bonus?',
    summary:
      'To receive your discounted vacation offer and bonus vacation, both travelers will attend an informative presentation in full, hosted by one of our trusted resort partners...',
    answer: (
      <>
        To receive your discounted vacation offer and bonus vacation, both
        travelers will attend an informative presentation in full, hosted by one
        of our trusted resort partners. It's a great way to discover exclusive
        travel benefits at beautiful resorts for less.{' '}
        <strong>
          Both adults must attend the full presentation together to qualify.
        </strong>
      </>
    ),
  },
  {
    question: 'Who is eligible to book this offer?',
    summary:
      'To be eligible: You must be a U.S. or Canadian resident, employed or retired, and meet general financial qualifications. Must speak English or Spanish...',
    answer: (
      <>
        <strong>To be eligible:</strong>
        <ul className="mt-2 list-disc pl-6">
          <li>
            You must be a U.S. or Canadian resident, employed or retired, and
            meet general financial qualifications, which may vary by
            destination.
          </li>
          <li>Must speak English or Spanish.</li>
          <li>
            If married or cohabiting, one person must be 28+ years old and both
            must attend the presentation.
          </li>
          <li>Retirees must be 55+.</li>
          <li>Single women: 28+, Single men: 35+</li>
        </ul>
        <p className="mt-2">
          <strong>Not eligible:</strong> full-time students, employees of
          timeshare/vacation companies, or anyone who has attended a similar
          presentation in the last 12 months.
        </p>
      </>
    ),
  },
  {
    question: 'What kind of hotel will I be staying in?',
    summary:
      'Your hotel options will be available in your Booking Portal and are based on availability at the time of booking. Enjoy a relaxing stay in well-appointed accommodations...',
    answer: (
      <>
        Your hotel options will be available in your Booking Portal and are
        based on availability at the time of booking. Enjoy a relaxing stay in
        well-appointed accommodations designed for comfort and value. These
        select-service hotels include trusted national brands like Marriott
        Courtyard and Holiday Inn & Suites, as well as welcoming resort
        partners. Expect cozy rooms with plush bedding, free Wi-Fi, and
        convenient in-room amenities such as a mini fridge and coffee maker.
        Many properties also feature on-site perks like breakfast, fitness
        centers, and 24-hour front desk service—perfect for vacationers like
        you. (Please note: Resort fees, parking, and taxes are not included.)
      </>
    ),
  },
  {
    question: 'How do I book my dates?',
    summary:
      "After your purchase, you'll receive a confirmation email with access to our My Discover Booking Portal. There you'll: Choose preferred travel dates, Select your hotel...",
    answer: (
      <>
        After your purchase, you'll receive a confirmation email with access to
        our My Discover Booking Portal. There you'll:
        <ul className="mt-2 list-disc pl-6">
          <li>Choose preferred travel dates</li>
          <li>Select your hotel from the available options</li>
          <li>Add upgrades if desired</li>
          <li>
            You will receive confirmation with all your details (do not book
            airfare until your dates are confirmed)
          </li>
        </ul>
        <p className="mt-2">
          Approximately 30 days prior to your trip a reservation specialist will
          reconfirm details of your package with you.
        </p>
      </>
    ),
  },
  {
    question: 'Do I need to book airfare on my own?',
    summary:
      'Yes. Airfare is not included with your vacation package and must be booked separately. We strongly recommend waiting until you receive your official confirmation...',
    answer: (
      <>
        Yes. Airfare is not included with your vacation package and must be
        booked separately. We strongly recommend waiting until you receive your
        official confirmation with travel dates before making any flight
        arrangements.
      </>
    ),
  },
  {
    question: 'Can I book more than one room or travel with other couples?',
    summary:
      "Each vacation package is designed for one qualified couple and one hotel room. While you're welcome to travel with friends or family, all parties must meet eligibility requirements...",
    answer: (
      <>
        Each vacation package is designed for one qualified couple and one hotel
        room. While you're welcome to travel with friends or family, all parties
        must meet eligibility requirements and attend the presentation together.
        Only the primary couple on the reservation will receive the Bonus
        Vacation or promotional gifts.
      </>
    ),
  },
  {
    question: 'Can I change my reservation?',
    summary:
      'Changes made within 72 hours of arrival are subject to forfeiture. Other changes may incur a $25 fee and any difference in hotel rates...',
    answer: (
      <>
        Changes made within 72 hours of arrival are subject to forfeiture. Other
        changes may incur a $25 fee and any difference in hotel rates. No-shows
        or early departures void the vacation.
      </>
    ),
  },
  {
    question: 'What fees will I pay at the hotel?',
    summary:
      'Expect to pay: Parking and Valet Fees ($10-20 per night), Hotel taxes ($37-$87 total), Resort fees ($15-$30/night)...',
    answer: (
      <>
        Expect to pay:
        <ul className="mt-2 list-disc pl-6">
          <li>Parking and Valet Fees ($10-20 per night)</li>
          <li>Hotel taxes ($37-$87 total)</li>
          <li>Resort fees ($15-$30/night)</li>
          <li>A credit card hold of $100-$250 for incidentals at check-in</li>
        </ul>
      </>
    ),
  },
  {
    question: "What's the deadline to travel?",
    summary:
      "You must complete your Focus Vacation and Presentation within 12 months of purchase. Once completed, you'll unlock your Bonus Vacation...",
    answer: (
      <>
        You must complete your Focus Vacation and Presentation within 12 months
        of purchase. Once completed, you'll unlock your Bonus Vacation, which
        must be registered within 6 months and used within 18 months of that
        registration date.
      </>
    ),
  },
  {
    question: 'Do I get my deposit back?',
    summary:
      'Any deposit collected during booking may be credited toward local attractions or activities, provided you attend the required presentation...',
    answer: (
      <>
        Any deposit collected during booking may be credited toward local
        attractions or activities, provided you attend the required
        presentation. Deposits are not refunded unless otherwise stated.
      </>
    ),
  },
  {
    question: 'Can I cancel my vacation package?',
    summary:
      'You may cancel in writing within 30 days of purchase. After that, all sales are final unless extended with applicable fees...',
    answer: (
      <>
        You may cancel in writing within 30 days of purchase. After that, all
        sales are final unless extended with applicable fees. To begin the
        cancellation process, please complete your request online by visiting
        the Ask Discover form and submitting your cancellation request. You may
        also call us at (954) 315-8753 or mail a written request to: Discover
        Vacations, 2881 E. Oakland Park Blvd, Suite 205, Fort Lauderdale, FL
        33306.
      </>
    ),
  },
  {
    question: 'Where do I manage my Reservation?',
    summary:
      'All bookings are handled at https://portal.MyDiscoverVacations.com. You can view your confirmation, add enhancements, and manage your trip all in one place...',
    answer: (
      <>
        All bookings are handled at{' '}
        <a
          href="https://portal.MyDiscoverVacations.com"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://portal.MyDiscoverVacations.com
        </a>
        . You can view your confirmation, add enhancements, and manage your trip
        all in one place.
      </>
    ),
  },
  {
    question: 'What if I have questions about my bonus or rebate?',
    summary:
      'Your Bonus Vacation is unlocked after you complete your Focus Vacation and Presentation. If you have questions before or after your trip...',
    answer: (
      <>
        Your Bonus Vacation is unlocked after you complete your Focus Vacation
        and Presentation. If you have questions before or after your trip, just
        use the Ask Discover feature in your Customer Booking Portal—our team is
        here to help!
      </>
    ),
  },
  {
    question: 'Can I bring children or additional guests?',
    summary:
      'Yes! Most of our partner hotels offer rooms that can accommodate families. You may add additional guests at the time of booking...',
    answer: (
      <>
        Yes! Most of our partner hotels offer rooms that can accommodate
        families. You may add additional guests at the time of booking, and
        extra fees may apply depending on the hotel's policy. Please check
        availability in your Booking Portal or contact us for assistance.
      </>
    ),
  },
  {
    question: "What happens if I don't attend the presentation?",
    summary:
      'The discounted pricing and bonus vacation are offered in exchange for your participation in the resort presentation...',
    answer: (
      <>
        The discounted pricing and bonus vacation are offered in exchange for
        your participation in the resort presentation. If the presentation is
        not attended, your vacation may be charged at full retail value and the
        bonus offer will be voided.
      </>
    ),
  },
  {
    question: 'Can I choose my destination for the Bonus Vacation?',
    summary:
      "Yes! Once you've completed your Focus Vacation and Presentation, you'll unlock access to your Bonus Vacation options...",
    answer: (
      <>
        Yes! Once you've completed your Focus Vacation and Presentation, you'll
        unlock access to your Bonus Vacation options. These include cruise
        lines, resort condos, or bonus hotel stays in select destinations.
        You'll be able to choose the reward that fits your preferences and
        travel timeline.
      </>
    ),
  },
  {
    question:
      "Do I need to attend the presentation if I've already done one before?",
    summary:
      'Yes. Attendance at a new presentation is required to qualify for this vacation and your bonus offer...',
    answer: (
      <>
        Yes. Attendance at a new presentation is required to qualify for this
        vacation and your bonus offer. If you've participated in a similar
        vacation ownership presentation within the last 12 months, you may not
        be eligible. Eligibility is verified during the reservation process and
        reconfirmed approximately 30 days prior to travel.
      </>
    ),
  },
  {
    question: '📞 I have more questions. How do I get help?',
    summary:
      'We’re here to support you! For general questions or non-urgent help, please use our Ask Discover form on the website ....',
    answer: (
      <>
        We’re here to support you! For general questions or non-urgent help,
        please use our Ask Discover form on the website — your message will be
        directed to the right team. If you're traveling within 5 days or need
        immediate assistance, please call us directly at (954) 315-8753. <br />
        Live Chat is coming soon for real-time assistance right from our site!
      </>
    ),
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
        description="You've come to the right place. From booking and payments to rescheduling and bonus details, we've gathered the most common questions right here to help you plan with confidence. Still have a question? Ask Discover and one of our team members will follow up with personalized support — or use our chat feature (coming soon) for instant help."
        image="/assets/beach2.png"
      />
      <div className="w-full max-w-6xl px-4 sm:px-6 sm:py-12">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="mx-auto max-w-3xl pb-2 rounded-md sm:rounded-lg bg-[#F5F5F5] shadow-md mb-12 overflow-hidden transition-all duration-300"
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

        <h2 className="text-center text-2xl font-bold text-[#30A8B3] font-plusjakarta mb-5 md:mb-0 px-3 md:px-0">
          Discover More. Spend Less. Travel Better
        </h2>
      </div>
    </div>
  );
}
