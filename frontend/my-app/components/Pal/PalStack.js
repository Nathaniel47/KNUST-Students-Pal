import { createStackNavigator } from "@react-navigation/stack";
import PalIntroPage from "./PalIntroPage";
import PalChatStack from "./PalChatStack";
import PalChatPage from "./PalChatPage";
import PalRecentChatPage from "./PalRecentChatPage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

const Stack = createStackNavigator();

const PalStack = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      console.log("method call");
      const unsubscribe = navigation
        .getParent() // This is the tab navigator
        ?.addListener("tabPress", (e) => {
          // Check if this tab is already focused
          const isFocused = navigation.isFocused();

          // If this screen is already focused and not on the first screen, prevent default
          if (isFocused && navigation.canGoBack()) {
            e.preventDefault(); // This prevents the default pop-to-top behavior
          }
        });

      return unsubscribe;
    }, [navigation])
  );
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="PalIntroPage" component={PalIntroPage} />
      <Stack.Screen name="PalChatPage" component={PalChatPage} options={{}} />
      <Stack.Screen name="PalRecentChatPage" component={PalRecentChatPage} />
    </Stack.Navigator>
  );
};

export default PalStack;
