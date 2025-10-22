import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;
const DESKTOP_BREAKPOINT = 1280;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(
    undefined,
  );
  const [isDesktop, setIsDesktop] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${DESKTOP_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsTablet(window.innerWidth < TABLET_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsTablet(window.innerWidth < TABLET_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return { isMobile, isTablet, isDesktop };
}
