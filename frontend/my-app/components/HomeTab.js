import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Scheduler from "./Scheduler";
import Resources from "./Resources";
import CareerHub from "./CareerHub";
import { LinearGradient } from "expo-linear-gradient";
import PalStack from "./Pal/PalStack";
import UpdateStack from "./Updates/UpdateStack";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import CustomBottomTabBar from "./CustomBottomTabBar";
import SearchPage from "./SearchPage";
import { useDrawerHeaderContext } from "./utility/DrawerHeaderContext";

const BOTTOM_TAB_BAR_HEIGHT = 70;

const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const NoHighlightTabButton = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={props.style}>{props.children}</View>
    </TouchableWithoutFeedback>
  );
};

const CustomDrawerIcon = ({ navigation }) => (
  <Pressable
    style={{ marginLeft: 15, padding: 4 }}
    onPress={() => {
      navigation.openDrawer();
    }}
  >
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
  </Pressable>
);

const BottomTab = () => {
  const navigation = useNavigation();

  return (
    <Tabs.Navigator
      tabBar={(props) => <CustomBottomTabBar {...props} />}
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
              iconName = "help-circle-outline"; // Fallback icon
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
                <Ionicons name={iconName} size={28} color="white" />
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
              <Ionicons name={iconName} color={color} size={24} />
            </View>
          );
        },
        tabBarInactiveTintColor: "gray",
        tabBarActiveTintColor: "#00BF63",
        // tabBarStyle is now set dynamically by the useEffect above
        // Remove the fixed height: 70 here, as it will be managed by tabBarAnimatedStyle
        tabBarStyle: {
          // Default styles, these can be overridden by the animated style
          backgroundColor: "white",
          height: BOTTOM_TAB_BAR_HEIGHT,
        },
        headerShown: false, // Ensure headers are handled by nested navigators
      })}
    >
      <Tabs.Screen
        name="Updates"
        component={UpdateStack} // Your UpdateStack component
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
        component={PalStack} // Your PalStack component
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

const HomeTabs = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <View>
            <Text>hello people</Text>
          </View>
          <DrawerItem label="Settings" />
        </DrawerContentScrollView>
      )}
      screenOptions={({ navigation }) => {
        return {
          headerTitle: "",
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            height: 80,
          },
          headerBackground: () => (
            <LinearGradient
              colors={["#fff", "#fff", "rgba(0, 191, 99, 0.05)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ flex: 1 }}
            />
          ),

          headerRight: () => (
            <View
              style={{
                marginRight: 20,
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Search");
                }}
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  borderWidth: 1,
                  borderRadius: 20,
                  paddingHorizontal: 20,
                  alignSelf: "center",
                  width: 230,
                  marginTop: 2,
                  backgroundColor: "#fff",
                  paddingVertical: 10,
                  height: 40,
                }}
              >
                <Ionicons name="search-outline" size={20} />
                <Text>Search updates....</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="notifications-outline" size={24}></Ionicons>
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="person-circle-outline" size={24}></Ionicons>
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => <CustomDrawerIcon navigation={navigation} />,
        };
      }}
    >
      <Drawer.Screen
        name="BottomTab"
        component={BottomTab}
        options={{ headerTitle: "" }}
      />
      <Drawer.Screen name="Search" component={SearchPage} />
    </Drawer.Navigator>
  );
};

export default HomeTabs;
