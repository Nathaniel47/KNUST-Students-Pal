import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Animated,
  ScrollView,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AllPage from "./AllPage";
import NewsPage from "./NewsPage";
import AnnouncementPage from "./AnnouncementsPage";
import EventsPage from "./EventsPage";
import { useEffect, useRef } from "react";
import CustomMaterialTopTabsHeader from "./CustomMaterialTopTabsHeader";

const Tabs = createMaterialTopTabNavigator();

// const CustomTabBars = ({ state, descriptors, navigation }) => {
//   const handleTabPress = (index, routeName) => {
//     navigation.navigate(routeName);
//   };

//   return (
//     <View style={styles.tabBarWrapper}>
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.tabBar}
//       >
//         {state.routes.map((route, index) => {
//           const { options } = descriptors[route.key];
//           const label = options.title || route.name;
//           const isFocused = state.index === index;

//           return (
//             <TouchableOpacity
//               key={route.key}
//               onPress={() => handleTabPress(index, route.name)}
//               activeOpacity={0.7}
//             >
//               <Animated.View
//                 style={[styles.tabButton, isFocused && styles.focusedTabButton]}
//               >
//                 <Text
//                   style={[styles.tabText, isFocused && styles.focusedTabText]}
//                 >
//                   {label}
//                 </Text>
//               </Animated.View>
//             </TouchableOpacity>
//           );
//         })}
//       </ScrollView>
//     </View>
//   );
// };

const UpdateMaterialTopTabs = () => {
  return (
    <Tabs.Navigator
      tabBar={(props) => <CustomMaterialTopTabsHeader {...props} />}
      // screenOptions={{
      //   tabBarActiveTintColor: "black",
      //   tabBarInactiveTintColor: "#00BF63",
      //   tabBarAndroidRipple: {
      //     color: "transparent",
      //   },
      //   tabBarBounces: true,
      //   tabBarGap: 5,
      //   tabBarItemStyle: {
      //     width: "auto",
      //     borderRadius: 30,
      //     borderColor: "gray",
      //     borderWidth: 1,
      //     paddingHorizontal: 20,
      //     marginHorizontal: 5,
      //     justifyContent: "center",
      //     alignItems: "center",
      //     backgroundColor: "#fff",
      //   },
      //   tabBarScrollEnabled: true,
      //   tabBarStyle: {
      //     backgroundColor: "rgba(0,191,99,0.08)",
      //     elevation: 0,
      //     paddingHorizontal: 10,
      //     shadowOpacity: 0,
      //     height: 70,
      //     justifyContent: "center",
      //   },
      //   tabBarIndicatorStyle: { backgroundColor: "transparent" },
      //   tabBarLabelStyle: {
      //     fontSize: 14,
      //     fontWeight: "bold",
      //     textTransform: "none",
      //   },
      // }}
    >
      <Tabs.Screen name="All" component={AllPage} />
      <Tabs.Screen name="News" component={NewsPage} />
      <Tabs.Screen name="Announcement" component={AnnouncementPage} />
      <Tabs.Screen name="Events" component={EventsPage} />
    </Tabs.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    backgroundColor: "rgba(7, 101, 55, 0.08)",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  tabButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderColor: "gray",
    borderWidth: 1,
  },
  focusedTabButton: {
    backgroundColor: "#6200ee",
  },
  tabText: {
    fontSize: 14,
    color: "#00BF63",
    fontWeight: "bold",
  },
  focusedTabText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default UpdateMaterialTopTabs;
