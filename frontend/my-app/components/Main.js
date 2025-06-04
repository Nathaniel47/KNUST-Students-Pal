import { View, StyleSheet, Platform } from "react-native";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OnBoardContainer from "./OnBoardContainer";
import SplashLogo from "./SplashLogo";
import HomeScreen from "./HomeScreen";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import { AuthProvider } from "./utility/AuthProvider";
import HomeTabs from "./HomeTab";

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
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
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
              // headerShown: Platform.OS === "ios",
              headerBackTitle: false,
              headerTintColor: "black",
              animation: "slide_from_right",
              headerTitleAlign: "center",
            }}
          ></Stack.Screen>

          <Stack.Screen
            name="Signup"
            component={SignUp}
            options={{
              // headerShown: Platform.OS === "ios",
              headerBackTitle: false,
              headerTintColor: "black",
              animation: "slide_from_right",
              headerTitleAlign: "center",
            }}
          ></Stack.Screen>
          <Stack.Screen name="HomeTabs" component={HomeTabs} options={{headerShown:false}}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // Ensure full-screen display
  },
});

export default Main;
