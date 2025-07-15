// src/contexts/ScrollContext.js
import React, { createContext, useContext } from "react";
import Animated, { useSharedValue } from "react-native-reanimated";

// Create a context that will hold our shared animated values
const ScrollContext = createContext(null);

// The provider component that will wrap our application
// It initializes the shared values and makes them available to children
export const ScrollProvider = ({ children }) => {
  // scrollY: This will store the current vertical scroll offset of our FlatList/ScrollView.
  const scrollY = useSharedValue(0);

  // previousScrollY: This helps us determine if the user is scrolling up or down.
  // We compare the current scrollY with the previous one.
  const previousScrollY = useSharedValue(0);

  // scrollDirection: Stores 'up' or 'down' to simplify conditional animations.
  const scrollDirection = useSharedValue("up");

  return (
    <ScrollContext.Provider
      value={{ scrollY, previousScrollY, scrollDirection }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

// Custom hook to easily consume the scroll context in any component
export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    // This error helps catch bugs where the hook is used outside the provider
    throw new Error("useScrollContext must be used within a ScrollProvider");
  }
  return context;
};
