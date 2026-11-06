import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const SQRT_5000 = Math.sqrt(5000);

export const defaultTestimonials = [
  {
    tempId: 0,
    testimonial: "We used to rely on paper punch cards. Switching to Revia means we actually know who our best customers are.",
    by: "Amber & Oak Coffee",
    imgSrc: "https://images.unsplash.com/photo-1556928045-16f7f50be0f3?w=150&h=150&fit=crop&q=80"
  },
  {
    tempId: 1,
    testimonial: "Sending a 'we miss you' offer to customers who haven't visited in 30 days has been a game changer.",
    by: "Luxe Mane Salon",
    imgSrc: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150&h=150&fit=crop&q=80"
  },
  {
    tempId: 2,
    testimonial: "Setup took 5 minutes. The QR code on our front desk does all the work.",
    by: "Iron Flex Gym",
    imgSrc: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&h=150&fit=crop&q=80"
  },
  {
    tempId: 3,
    testimonial: "The ROI we've seen with Revia is incredible. It's paid for itself many times over.",
    by: "Victor, ProfitPeak",
    imgSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&q=80"
  },
  {
    tempId: 4,
    testimonial: "If I could give 11 stars, I'd give 12. It's so simple and intuitive for our staff.",
    by: "Andre, CreativeSolutions",
    imgSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof defaultTestimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter 
          ? "z-10 bg-[#2D1A47] text-white border-[#7C3AED]" 
          : "z-0 bg-white text-[#1E1548] border-purple-100 hover:border-[#7C3AED]/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 24px 0px rgba(124,58,237,0.3)" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className={cn("absolute block origin-top-right rotate-45", isCenter ? "bg-[#FF4E8D]" : "bg-purple-100")}
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(',')[0]}`}
        className="mb-4 h-14 w-12 bg-gray-100 object-cover object-top rounded-tl-lg rounded-br-lg"
        style={{
          boxShadow: isCenter ? "3px 3px 0px #FF4E8D" : "3px 3px 0px #F3E8FF"
        }}
      />
      <h3 className={cn(
        "text-base sm:text-xl font-medium leading-relaxed italic",
        isCenter ? "text-white" : "text-[#1E1548]"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "absolute bottom-8 left-8 right-8 mt-2 text-sm font-bold tracking-wide",
        isCenter ? "text-pink-300" : "text-gray-500"
      )}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC<{ testimonials?: typeof defaultTestimonials }> = ({ testimonials = defaultTestimonials }) => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setCardSize(365);
      } else if (width >= 768) {
        setCardSize(320);
      } else {
        setCardSize(290);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 500 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length - 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-4">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center text-xl rounded-full transition-colors shadow-sm cursor-pointer",
            "bg-white border-2 border-purple-100 hover:border-[#7C3AED] hover:text-[#7C3AED] text-[#1E1548]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center text-xl rounded-full transition-colors shadow-sm cursor-pointer",
            "bg-white border-2 border-purple-100 hover:border-[#7C3AED] hover:text-[#7C3AED] text-[#1E1548]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
