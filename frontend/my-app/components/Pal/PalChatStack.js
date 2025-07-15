import { createStackNavigator } from "@react-navigation/stack";
import PalChatPage from "./PalChatPage";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../utility/AuthProvider";
import { useContext, useCallback } from "react";
import PalRecentChatPage from "./PalRecentChatPage";

const Stack = createStackNavigator();

const PalChatStack = () => {
  const isChatPage = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      isChatPage.setIsInChat(false);

      return () => {
        isChatPage.setIsInChat(true);
      };
    }, [])
  );

  return (
    <Stack.Navigator screenOptions={{ headerTitle: "", headerShown: false }}>
      <Stack.Screen name="PalChatPage" component={PalChatPage} />
      <Stack.Screen
        name="PalRecentChatPage"
        component={PalRecentChatPage}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
};

export default PalChatStack;
