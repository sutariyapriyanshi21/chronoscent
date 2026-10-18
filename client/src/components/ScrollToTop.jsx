import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop ensures that whenever the user navigates to a new page
 * (e.g. clicking links in the footer or navigation), the viewport
 * automatically scrolls to the top of the new page.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
