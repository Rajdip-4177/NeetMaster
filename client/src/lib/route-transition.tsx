import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";

interface RouteTransitionProps {
  children: ReactNode;
}

export default function RouteTransition({ children }: RouteTransitionProps) {
  const [location] = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fade-enter");

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fade-exit");
      
      // After the exit animation finishes, update the location
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fade-enter");
      }, 300); // This should match the CSS transition duration
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  return (
    <div className={`route-wrapper ${transitionStage}`}>
      {children}
    </div>
  );
} 