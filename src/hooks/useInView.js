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
    if (isVisible && once) return undefined;
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return undefined;

    let observer;
    let active = true;

    const revealIfInViewport = () => {
      if (!active) return true;
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const isInViewport =
        rect.bottom >= viewportHeight * 0.05 &&
        rect.top <= viewportHeight * 0.95 &&
        rect.right >= 0 &&
        rect.left <= viewportWidth;

      if (isInViewport) {
        setIsVisible(true);
      } else if (!once) {
        setIsVisible(false);
      }
      return isInViewport;
    };

    const onViewportChange = () => {
      const visible = revealIfInViewport();
      if (visible && once) {
        window.removeEventListener("scroll", onViewportChange);
        window.removeEventListener("resize", onViewportChange);
      }
    };

    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);
    onViewportChange();

    if (!("IntersectionObserver" in window)) {
      return () => {
        active = false;
        window.removeEventListener("scroll", onViewportChange);
        window.removeEventListener("resize", onViewportChange);
      };
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
            window.removeEventListener("scroll", onViewportChange);
            window.removeEventListener("resize", onViewportChange);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(el);
    return () => {
      active = false;
      observer.disconnect();
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
    };
  }, [threshold, once, isVisible]);

  return [ref, isVisible];
}
