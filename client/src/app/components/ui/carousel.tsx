"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";

interface SlideData {
  title: string;
  src: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, title } = slide;

  return (
    <li
      ref={slideRef}
      className="flex flex-1 flex-col items-center justify-center relative text-center text-white transition-all duration-300 ease-in-out w-[80vw] md:h-[80vh] h-[25vh] mx-2 z-10"
      onClick={() => handleSlideClick(index)}
      style={{
        display: current === index ? "block" : "none",
      }}
    >
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <img
          className="w-full h-full object-cover opacity-100 transition-opacity duration-600 ease-in-out"
          alt={title}
          src={src}
          onLoad={imageLoaded}
          loading="eager"
          decoding="sync"
        />
        <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
        <div className="absolute z-10 bottom-8 text-black left-10 text-3xl shadow-2xl p-10 font-semibold transition-transform duration-500 ease-in-out transform translate-y-5 group-hover:translate-y-0 group-hover:opacity-100" 
        style={{borderRadius: "100px 100px 100px 0px"}}>
          {title}
        </div>
      </div>
    </li>
  );
};

interface CarouselProps {
  slides: SlideData[];
}

export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleSlideClick = (index: number) => {
    setCurrent(index);
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <ul className="relative flex justify-center w-full overflow-hidden">
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
          />
        ))}
      </ul>

      <div className="absolute flex justify-between w-full top-1/2 transform -translate-y-1/2 px-4">
        <button
          className="p-2 bg-white/50 rounded-full"
          onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}
        >
          ◀
        </button>
        <button
          className="p-2 bg-white/50 rounded-full"
          onClick={() => setCurrent((current + 1) % slides.length)}
        >
          ▶
        </button>
      </div>

      <div className="absolute bottom-4 z-10 right-10 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${current === index ? "bg-white" : "bg-gray-400"}`}
            onClick={() => handleSlideClick(index)}
          />
        ))}
      </div>
    </div>
  );
}