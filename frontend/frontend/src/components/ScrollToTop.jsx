import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Access the current URL location
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the very top-left of the window
    window.scrollTo(0, 0);
  }, [pathname]); // Trigger this every time the path changes

  return null; // This component doesn't render any UI
};

export default ScrollToTop;