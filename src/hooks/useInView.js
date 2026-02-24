import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver hook — returns [ref, isVisible].
 * When the element enters the viewport the first time, isVisible becomes true
 * and stays true (fire-once by default).
 */
export default function useInView({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, isVisible];
}
