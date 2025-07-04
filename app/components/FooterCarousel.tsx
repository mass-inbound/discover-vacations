import {useEffect, useState} from 'react';
import {HiOutlineChevronLeft, HiOutlineChevronRight} from 'react-icons/hi';

export default function FooterCarousel() {
  const slides = [
    {src: '/assets/1.jpg', alt: 'View 1'},
    {src: '/assets/2.jpg', alt: 'View 2'},
    {src: '/assets/3.jpg', alt: 'View 3'},
    {src: '/assets/4.jpg', alt: 'View 4'},
    {src: '/assets/5.jpg', alt: 'View 5'},
    {src: '/assets/6.jpg', alt: 'View 6'},
    {src: '/assets/7.jpg', alt: 'View 7'},
    {src: '/assets/8.jpg', alt: 'View 8'},
    {src: '/assets/9.jpg', alt: 'View 9'},
    {src: '/assets/10.jpg', alt: 'View 10'},
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [imagesPerPage, setImagesPerPage] = useState(2);

  useEffect(() => {
    function handleResize() {
      setImagesPerPage(window.innerWidth < 768 ? 1 : 2);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pageCount = Math.ceil(slides.length / imagesPerPage);

  const prevSlide = () => {
    setCurrentPage((prev) => (prev === 0 ? pageCount - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentPage((prev) => (prev === pageCount - 1 ? 0 : prev + 1));
  };
  return (
    <section className="relative bg-[#EAF8F8] px-4 md:py-0 min-h-[460px]">
      <div
        className="relative w-full py-16 max-w-7xl overflow-hidden rounded-lg mx-auto"
        style={{maxHeight: 360}}
      >
        {/* Slides */}
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentPage * 100}%)`,
          }}
        >
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="min-w-full md:min-w-1/2 flex-shrink-0 flex items-center justify-center"
              style={{height: 360}}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="object-cover w-full h-full rounded-lg max-w-[320px] sm:max-w-[610px]"
                style={{maxHeight: 360}}
              />
            </div>
          ))}
        </div>
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute top-[60%] left-2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md focus:outline-none z-10"
        >
          <HiOutlineChevronLeft size={24} />
        </button>
        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute top-[60%] right-2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md focus:outline-none z-10"
        >
          <HiOutlineChevronRight size={24} />
        </button>
      </div>
      {/* Indicator Dots */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-8">
        {Array.from({length: pageCount}).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx)}
            className={`w-3 h-3 rounded-full focus:outline-none transition-opacity duration-300 ${currentPage === idx ? 'bg-[#2AB7B7] opacity-100' : 'bg-gray-300 opacity-50'}`}
          />
        ))}
      </div>
    </section>
  );
}
