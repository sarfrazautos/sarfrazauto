"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function LenisScroll({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const isHomePage = pathname === "/" || pathname === "/home";
    if (!isHomePage) {
      document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-scrolling", "lenis-stopped");
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    return () => {
      lenis.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-scrolling", "lenis-stopped");
    };
  }, [pathname]);

  return <>{children}</>;
}
