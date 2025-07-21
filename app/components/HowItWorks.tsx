import SectionHeroBanner from './SectionHeroBanner';
import VacationProcess from './VacationProcess';

export default function HowItWorks() {
  return (
    <>
      <SectionHeroBanner
        tagline="Vacation booking made simple"
        title="How it works"
        description="We believe planning a vacation should feel as exciting as going on one. That’s why we’ve made the process simple and stress-free. Just follow a few easy steps to claim your exclusive offer, lock in your trip, and get ready to make some unforgettable memories."
        image="/assets/beach1.png"
      />
      <VacationProcess />
    </>
  );
}
