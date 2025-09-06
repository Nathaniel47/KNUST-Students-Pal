import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
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
import { AuthContext } from "./utility/AuthProvider";

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
        height: 1.8,
        backgroundColor: "#333",
        borderRadius: 2,
        marginBottom: 4,
      }}
    />
    <View
      style={{
        width: 18,
        height: 1.8,
        backgroundColor: "#333",
        borderRadius: 2,
        marginBottom: 4,
      }}
    />
    <View
      style={{
        width: 12,
        height: 1.8,
        backgroundColor: "#333",
        borderRadius: 2,
      }}
    />
  </Pressable>
);

const CustomDrawerContent = (props) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            const result = await logout();
            if (result.success) {
              props.navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
              });
            }
          },
        },
      ],
    );
  };

  const menuItems = [
    {
      label: "Profile",
      icon: "person-outline",
      onPress: () => {
        // Navigate to profile screen or show profile modal
        console.log("Navigate to Profile");
      },
    },
    {
      label: "Settings",
      icon: "settings-outline",
      onPress: () => {
        // Navigate to settings screen
        console.log("Navigate to Settings");
      },
    },
    {
      label: "Notifications",
      icon: "notifications-outline",
      onPress: () => {
        // Navigate to notifications settings
        console.log("Navigate to Notifications");
      },
    },
    {
      label: "Help & Support",
      icon: "help-circle-outline",
      onPress: () => {
        // Navigate to help screen
        console.log("Navigate to Help");
      },
    },
    {
      label: "About",
      icon: "information-circle-outline",
      onPress: () => {
        // Show about information
        console.log("Show About");
      },
    },
    {
      label: "Privacy Policy",
      icon: "shield-checkmark-outline",
      onPress: () => {
        // Navigate to privacy policy
        console.log("Navigate to Privacy Policy");
      },
    },
  ];

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      {/* User Profile Section */}
      <View style={styles.userSection}>
        <LinearGradient
          colors={["#00BF63", "#00A855"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.userBackground}
        >
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={32} color="white" />
            </View>
            <View style={styles.userTextContainer}>
              <Text style={styles.userName}>{user || "User"}</Text>
              <Text style={styles.userEmail}>Welcome back!</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <DrawerItem
            key={index}
            label={item.label}
            icon={({ color, size }) => (
              <Ionicons name={item.icon} size={size} color={color} />
            )}
            onPress={item.onPress}
            labelStyle={styles.menuItemLabel}
            style={styles.menuItem}
            activeTintColor="#00BF63"
            inactiveTintColor="#666"
          />
        ))}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
          onPress={handleLogout}
          labelStyle={[styles.menuItemLabel, styles.logoutLabel]}
          style={styles.menuItem}
          activeTintColor="#FF4444"
          inactiveTintColor="#FF4444"
        />
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
};

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
              iconName = "help-circle-outline";
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
        tabBarStyle: {
          backgroundColor: "white",
          height: BOTTOM_TAB_BAR_HEIGHT,
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name="Updates"
        component={UpdateStack}
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
        component={PalStack}
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
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
              >
                <Ionicons name="search-outline" size={24} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="notifications-outline" size={24} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="person-circle-outline" size={24} />
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
        options={{ headerTitle: "Updates", headerTitleStyle: { padding: 10 } }}
      />
      <Drawer.Screen name="Search" component={SearchPage} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userSection: {
    marginBottom: 20,
  },
  userBackground: {
    padding: 0,
    margin: 0,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
    paddingBottom: 25,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  menuSection: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    marginVertical: 2,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  menuItemLabel: {
    fontSize: 18,
    marginLeft: -5,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 20,
    marginVertical: 20,
  },
  logoutSection: {
    paddingBottom: 10,
  },
  logoutLabel: {
    color: "#FF4444",
  },
  versionContainer: {
    padding: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  versionText: {
    fontSize: 12,
    color: "#999",
  },
});

export default HomeTabs;