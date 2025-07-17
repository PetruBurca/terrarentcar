import { useEffect, useRef } from "react";

export const usePerformance = () => {
  const performanceRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    // Measure Core Web Vitals
    if ("PerformanceObserver" in window) {
      try {
        // Largest Contentful Paint
        performanceRef.current = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log("LCP:", lastEntry.startTime);
        });
        performanceRef.current.observe({
          entryTypes: ["largest-contentful-paint"],
        });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            console.log("FID:", entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ["first-input"] });

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          console.log("CLS:", clsValue);
        });
        clsObserver.observe({ entryTypes: ["layout-shift"] });

        return () => {
          performanceRef.current?.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      } catch (error) {
        console.warn("Performance monitoring not supported:", error);
      }
    }
  }, []);

  const measureTime = (name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
  };

  return { measureTime };
};
