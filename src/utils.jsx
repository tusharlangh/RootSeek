import React, { createContext, useEffect, useState, useCallback } from "react";

export const WindowContext = createContext(0);

const WindowSize = ({ children }) => {
  const getSize = () => (typeof window !== "undefined" ? window.innerWidth : 0);

  const [size, setSize] = useState(getSize);

  const onChange = useCallback(() => {
    setSize(getSize());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("resize", onChange);
    return () => window.removeEventListener("resize", onChange);
  }, [onChange]);

  return (
    <WindowContext.Provider value={size}>{children}</WindowContext.Provider>
  );
};

export default WindowSize;
