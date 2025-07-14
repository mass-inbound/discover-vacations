import SectionHeroBanner from './SectionHeroBanner';
import VacationProcess from './VacationProcess';

export default function HowItWorks() {
  return (
    <>
      <SectionHeroBanner
        tagline="Vacation booking made simple"
        title="Discover How it works"
        description="Choose your destination, select your offer, and pick your travel dates, it's that easy. We've streamlined the entire booking process so you can focus on getting excited for your trip, not figuring out how to plan it."
        image="/assets/beach1.png"
      />
      <VacationProcess />
    </>
  );
}
