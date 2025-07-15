import React, { createContext, useContext, useState } from "react";

const TabBarVisibilityContext = createContext();

export const TabBarVisibilityProvider = ({ children }) => {
  const [tabBarVisible, setTabBarVisible] = useState(true); // Default to visible

  return (
    <TabBarVisibilityContext.Provider
      value={{ tabBarVisible, setTabBarVisible }}
    >
      {children}
    </TabBarVisibilityContext.Provider>
  );
};

export const useTabBarVisibility = () => {
  const context = useContext(TabBarVisibilityContext);
  if (context === undefined) {
    throw new Error(
      "useTabBarVisibility must be used within a TabBarVisibilityProvider"
    );
  }
  return context;
};
