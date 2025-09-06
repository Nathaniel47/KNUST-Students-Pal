import { View, StyleSheet, Platform } from "react-native";
import { useEffect, useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OnBoardContainer from "./OnBoardContainer";
import SplashLogo from "./SplashLogo";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import { AuthProvider, AuthContext } from "./utility/AuthProvider";
import HomeTabs from "./HomeTab";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ScrollProvider } from "./utility/ScrollContext";
import { TabBarVisibilityProvider } from "./utility/TabBarVisibilityContext";
import { DrawerHeaderContextProvider } from "./utility/DrawerHeaderContext";
import { ToastProvider } from "./utility/ToastContext";
import { GlobalBottomSheetProvider } from "./utility/GlobalBottomSheetContext";
import FetchUpdatesProvider from "./utility/FetchContext";
import GuestSignIn from "./GuestSignIn";
import GuestSignUp from "./GuestSignup";

const Stack = createStackNavigator();

// Create a separate component that uses the AuthContext
const AppNavigator = () => {
  const [isReady, setIsReady] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { user, loadUser } = useContext(AuthContext);

  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("🔍 Starting auth check...");
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log("⏰ Auth check timeout - forcing completion");
        setIsCheckingAuth(false);
      }, 5000); 
      
      try {
        const userLoggedIn = await loadUser();
        console.log("✅ Auth check completed. User logged in:", userLoggedIn);
        clearTimeout(timeoutId); // Clear timeout on successful completion
      } catch (error) {
        console.error("❌ Error checking auth status:", error);
        clearTimeout(timeoutId);
      } finally {
        console.log("🏁 Setting isCheckingAuth to false");
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    console.log("🎯 State change - isCheckingAuth:", isCheckingAuth, "user:", user);
    
    if (!isCheckingAuth) {
      const delay = user ? 10 : 40;
      console.log(`⏰ Setting timer for ${delay}ms`);
      
      const timer = setTimeout(() => {
        console.log("🚀 Setting isReady to true");
        setIsReady(true);
      }, delay);
      
      return () => {
        console.log("🧹 Clearing timer");
        clearTimeout(timer);
      };
    }
  }, [isCheckingAuth, user]);

  // Show splash while checking auth status
  if (isCheckingAuth) {
    console.log("🔄 Showing splash (checking auth)");
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="logo"
          component={SplashLogo}
          options={{
            headerShown: false,
            headerTitle: "",
            animation: "slide_from_right",
          }}
        />
      </Stack.Navigator>
    );
  }

  console.log("📊 Render state - isReady:", isReady, "user:", !!user);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isReady ? (
        <Stack.Screen
          name="logo"
          component={SplashLogo}
          options={{
            headerShown: false,
            headerTitle: "",
            animation: "slide_from_right",
          }}
        />
      ) : user ? (
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
      ) : (
        <Stack.Screen
          name="Main"
          component={OnBoardContainer}
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      )}
      
      {/* Rest of your screens */}
      <Stack.Screen name="Login" component={LogIn} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="GuestSignIn" component={GuestSignIn} options={{ headerShown: false }} />
      <Stack.Screen name="GuestSignUp" component={GuestSignUp} options={{ headerShown: false }} />
      {!user && <Stack.Screen name="HomeTabs" component={HomeTabs} />}
    </Stack.Navigator>
  );
};

const Main = () => {
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
                      <AppNavigator />
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
  },
});

export default Main;