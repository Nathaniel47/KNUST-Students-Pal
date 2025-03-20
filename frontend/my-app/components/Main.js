import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import OnBoardContainer from "./OnBoardContainer";
import SplashLogo from "./SplashLogo";
import { useEffect, useState } from "react";

const Stack = createStackNavigator();

const Main = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isReady ? (
          <Stack.Screen name="main" component={OnBoardContainer} />
        ) : (
          <Stack.Screen name="logo" component={SplashLogo} />
        )}
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // Ensure full-screen display
  },
});

export default Main;
