import React from 'react';

interface SectionHeroBannerProps {
  tagline: string;
  title: string;
  description: string;
  image: string;
}

export default function SectionHeroBanner({
  tagline,
  title,
  description,
  image,
}: SectionHeroBannerProps) {
  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center mb-14"
      style={{minHeight: '340px', height: 'auto'}}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        style={{minHeight: 340, maxHeight: 500}}
      />
      <div className="absolute inset-0 bg-black/20 z-8" />
      <div className="relative z-8 flex flex-col items-center justify-center text-center w-full px-4 py-16 md:py-24">
        <span className="text-white text-base md:text-lg font-medium mb-2 drop-shadow">
          {tagline}
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
          {title}
        </h1>
        <p className="text-white text-base md:text-lg max-w-2xl drop-shadow">
          {description}
        </p>
      </div>
    </section>
  );
}
