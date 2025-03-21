import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const AnimatedCard = ({
  className,
  children,
  hoverEffect = 'lift',
  animateOnScroll = false,
  delay = 0,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(!animateOnScroll);
  
  useEffect(() => {
    if (animateOnScroll) {
      setTimeout(() => {
        setIsVisible(true);
      }, delay);
    }
  }, [animateOnScroll, delay]);
  
  const hoverClasses = {
    lift: 'hover:-translate-y-1',
    glow: 'hover:shadow-neo-hover',
    scale: 'hover:scale-[1.01]',
    tilt: 'hover:rotate-1',
    pulse: 'hover:animate-pulse',
    none: '',
  };
  
  return (
    <div
      className={cn(
        'rounded-xl bg-white overflow-hidden transition-all duration-300 ease-out shadow-neo',
        hoverEffect !== 'none' && 'group',
        hoverClasses[hoverEffect],
        animateOnScroll && 'animate-appear',
        !isVisible && 'opacity-0',
        isVisible && 'opacity-100',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default AnimatedCard; 