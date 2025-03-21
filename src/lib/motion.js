// Animation variants for use with Framer Motion
// (We're not using Framer Motion in this version, but the principles 
// are implemented with CSS transitions and animations)

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } }
};

export const slideUp = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { duration: 0.4 } }
};

// CSS class utilities for animations
export const getAnimationClass = (type, delay = 0) => {
  const baseClass = 'opacity-0';
  const animationClass = type === 'fade' ? 'animate-fade-in' : 
                        type === 'slide' ? 'animate-slide-up' : 
                        type === 'scale' ? 'animate-scale-in' : '';
  
  return `${baseClass} ${animationClass} animation-delay-${delay}`;
};

// Function to create a staggered animation effect for multiple elements
export const staggeredAnimation = (elements, type, staggerDelay = 100) => {
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.remove('opacity-0');
      el.classList.add(type === 'fade' ? 'animate-fade-in' : 
                      type === 'slide' ? 'animate-slide-up' : 
                      type === 'scale' ? 'animate-scale-in' : '');
    }, index * staggerDelay);
  });
}; 