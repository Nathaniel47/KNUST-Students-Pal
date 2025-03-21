import { View, StyleSheet, Platform } from "react-native";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OnBoardContainer from "./OnBoardContainer";
import SplashLogo from "./SplashLogo";
import LogIn from "./LogIn";
import SignUp from "./SignUp";

const Stack = createStackNavigator();

const Main = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isReady ? (
          <Stack.Screen
            name="Main"
            component={OnBoardContainer}
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
        ) : (
          <Stack.Screen
            name="logo"
            component={SplashLogo}
            options={{
              headerShown: false,
              headerTitle: "",
              animation: "slide_from_right",
            }}
          />
        )}
        <Stack.Screen
          name="Login"
          component={LogIn}
          options={{
            headerShown: Platform.OS === "ios",
            headerBackTitle: false,
            headerTintColor: "black",
            animation: "slide_from_right",
          }}
        ></Stack.Screen>

        <Stack.Screen
          name="Signup"
          component={SignUp}
          options={{
            headerShown: Platform.OS === "ios",
            headerBackTitle: false,
            headerTintColor: "black",
            animation: "slide_from_right",
          }}
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // Ensure full-screen display
  },
});

export default Main;
