import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Pal from "./Pal";
import Scheduler from "./Scheduler";
import Resources from "./Resources";
import CareerHub from "./CareerHub";
import Updates from "./Updates";
import { LinearGradient } from "expo-linear-gradient";

const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const NoHighlightTabButton = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={props.style}>{props.children}</View>
    </TouchableWithoutFeedback>
  );
};

const CustomDrawerIcon = () => (
  <View style={{ marginLeft: 15, padding: 4 }}>
    <View
      style={{
        width: 24,
        height: 2,
        backgroundColor: "#333",
        borderRadius: 2,
        marginBottom: 4,
      }}
    />
    <View
      style={{
        width: 18,
        height: 2,
        backgroundColor: "#333",
        borderRadius: 2,
        marginBottom: 4,
      }}
    />
    <View
      style={{
        width: 12,
        height: 2,
        backgroundColor: "#333",
        borderRadius: 2,
      }}
    />
  </View>
);

const BottomTab = () => {
  return (
    <Tabs.Navigator
      screenOptions={({ route: { name } }) => ({
        tabBarIcon: ({ focused, size, color }) => {
          let iconName;
          let isPal = name === "Pal";
          switch (name) {
            case "Updates":
              iconName = focused ? "newspaper" : "newspaper-outline";
              break;
            case "CareerHub":
              iconName = focused ? "briefcase" : "briefcase-outline";
              break;
            case "Pal":
              iconName = focused
                ? "chatbubble-ellipses"
                : "chatbubble-ellipses-outline";
              break;
            case "Resources":
              iconName = focused ? "book" : "book-outline";
              break;
            case "Scheduler":
              iconName = focused ? "calendar" : "calendar-outline";
              break;
            default:
          }

          if (isPal) {
            return (
              <View
                style={{
                  position: "absolute",
                  top: -18,
                  backgroundColor: "#00BF63",
                  borderRadius: 35,
                  width: 70,
                  height: 70,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                  elevation: 5,
                }}
              >
                <Ionicons name={iconName} size={32} color="white" />
              </View>
            );
          }
          return (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: 3,
                borderBottomColor: focused ? "#00BF63" : "transparent",
              }}
            >
              <Ionicons name={iconName} color={color} size={28} />
            </View>
          );
        },
        tabBarInactiveTintColor: "gray",
        tabBarActiveTintColor: "#00BF63",
        tabBarStyle: { height: 70 },

        headerShown: false,
      })}
    >
      <Tabs.Screen
        name="Updates"
        component={Updates}
        options={{
          tabBarButton: (props) => <NoHighlightTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="CareerHub"
        component={CareerHub}
        options={{
          tabBarButton: (props) => <NoHighlightTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="Pal"
        component={Pal}
        options={{
          tabBarLabel: () => null,
          tabBarButton: (props) => <NoHighlightTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="Resources"
        component={Resources}
        options={{
          tabBarButton: (props) => <NoHighlightTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="Scheduler"
        component={Scheduler}
        options={{
          tabBarButton: (props) => <NoHighlightTabButton {...props} />,
        }}
      />
    </Tabs.Navigator>
  );
};

const HomeTabs = ({ navigation }) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitle: "",
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerBackground: () => (
          <LinearGradient
            colors={["#fff", "#fff", "rgba(0, 191, 99, 0.08)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1 }}
          />
        ),

        headerRight: () => (
          <View style={{ marginRight: 20, flexDirection: "row", gap: 10 }}>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24}></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="person-circle-outline" size={24}></Ionicons>
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Drawer.Screen
        name="BottomTab"
        component={BottomTab}
        options={{ headerTitle: "" }}
      />
    </Drawer.Navigator>
  );
};

export default HomeTabs;
