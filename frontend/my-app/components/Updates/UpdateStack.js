import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, TextInput, StyleSheet } from "react-native";
import UpdateMaterialTopTabs from "./UpdateMaterialTopTabs";
import { NavigationContainer } from "@react-navigation/native";
import NewsPage from "./NewsPage";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "react-native";

const CustomHeader = () => (
  <View style={styles.searchBox}>
    <View style={styles.searchContent}>
      <Ionicons name="search" size={24} />
      <TextInput placeholder="Search updates..." style={styles.searchInput} />
    </View>
  </View>
);

const Stack = createStackNavigator();
const UpdateStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UpdateMaterialTopTabs"
        component={UpdateMaterialTopTabs}
        // options={{ headerTitle: "", header: () => <CustomHeader /> }}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    backgroundColor: "rgba(0, 191, 99, 0.08)",
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 20,
    paddingLeft: 10,
    gap: 5,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  searchInput: {
    width: "90%",
    fontSize: 16,
  },
});

export default UpdateStack;
