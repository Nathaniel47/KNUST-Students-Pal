import { Text, View } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const PalRecentChatPage = () => {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent().getParent().getParent();
      console.log(parent.getState());
      parent?.setOptions({
        headerShown: false,
      });

      return () => {
        parent?.setOptions({
          headerShown: true,
        });
      };
    }, [])
  );
  return (
    <View>
      <Text>This is the recent chat page</Text>
    </View>
  );
};

export default PalRecentChatPage;
