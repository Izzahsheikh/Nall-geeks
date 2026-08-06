import { useEffect } from 'react';

// Applies the .visible class to all .reveal elements once they scroll into view.
export default function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('visible'), delay);
      }
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay || '0', 10);
            setTimeout(() => entry.target.classList.add('visible'), delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => {
      if (!el.classList.contains('visible')) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);
}
