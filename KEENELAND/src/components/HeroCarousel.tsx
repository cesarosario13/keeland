import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface CarouselSlide {
  image: string;
  title: string;
  description: string;
}

const slides: CarouselSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Crea Tus Propias Apuestas',
    description: 'Compite con amigos en torneos personalizados y predicciones únicas'
  },
  {
    image: 'https://images.unsplash.com/photo-1688873157896-432c9a44eaae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: '¡Bono de Bienvenida!',
    description: '100% hasta $500 en tu primer depósito'
  },
  {
    image: 'https://images.unsplash.com/photo-1714865212999-a9817814b080?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Apuestas Deportivas',
    description: 'Las mejores cuotas en partidos en vivo'
  },
  {
    image: 'https://images.unsplash.com/photo-1655159428752-c700435e9983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Jackpot Progresivo',
    description: 'Más de $45,000 esperando a ser ganados'
  }
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-80 rounded-xl overflow-hidden bg-card shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <ImageWithFallback
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-background text-3xl mb-2"
              >
                {slides[currentSlide].title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-background/90"
              >
                {slides[currentSlide].description}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <Button
        onClick={goToPrevious}
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card text-primary rounded-full shadow-lg backdrop-blur-sm"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        onClick={goToNext}
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card text-primary rounded-full shadow-lg backdrop-blur-sm"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-primary w-8' 
                : 'bg-background/60 hover:bg-background/80 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}