import React, { useState, useEffect } from "react";

import SplashScreen from "./components/SplashScreen";
import MainApp from "./components/MainApp";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => setShowSplash(false), 5000); // Show splash for 5 seconds
  }, []);

  return showSplash ? (
    <SplashScreen onFinish={() => setShowSplash(false)} />
  ) : (
    <MainApp />
  );
};

export default App;
