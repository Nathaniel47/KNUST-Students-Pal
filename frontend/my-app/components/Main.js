import { View, StyleSheet, Platform } from "react-native";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OnBoardContainer from "./OnBoardContainer";
import SplashLogo from "./SplashLogo";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import { AuthProvider } from "./utility/AuthProvider";
import HomeTabs from "./HomeTab";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ScrollProvider } from "./utility/ScrollContext";
import { TabBarVisibilityProvider } from "./utility/TabBarVisibilityContext";
import { DrawerHeaderContextProvider } from "./utility/DrawerHeaderContext";
import { ToastProvider } from "./utility/ToastContext";
import { GlobalBottomSheetProvider } from "./utility/GlobalBottomSheetContext";
import FetchUpdatesProvider from "./utility/FetchContext";

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
      <ScrollProvider>
        <TabBarVisibilityProvider>
          <DrawerHeaderContextProvider>
            <ToastProvider>
              <FetchUpdatesProvider>
                <GlobalBottomSheetProvider>
                  <GestureHandlerRootView>
                    <NavigationContainer>
                      <Stack.Navigator screenOptions={{ headerShown: false }}>
                        {isReady ? (
                          <Stack.Screen
                            name="Main"
                            component={OnBoardContainer}
                            options={{
                              headerShown: false,
                              animation: "slide_from_right",
                            }}
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
                            headerShown: false,
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
                            headerShown: false,
                          }}
                        ></Stack.Screen>
                        <Stack.Screen
                          name="HomeTabs"
                          component={HomeTabs}
                        ></Stack.Screen>
                      </Stack.Navigator>
                    </NavigationContainer>
                  </GestureHandlerRootView>
                </GlobalBottomSheetProvider>
              </FetchUpdatesProvider>
            </ToastProvider>
          </DrawerHeaderContextProvider>
        </TabBarVisibilityProvider>
      </ScrollProvider>
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
