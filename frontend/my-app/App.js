import "react-native-get-random-values";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import Main from "./components/Main";
import { StatusBar, View, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { toastConfig } from "./components/utility/config";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <StatusBar barStyle={"dark-content"} />
        <Main />
        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
