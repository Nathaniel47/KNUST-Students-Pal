// src/navigation/CustomBottomTabBar.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useScrollContext } from "./utility/ScrollContext";
import { useTabBarVisibility } from "./utility/TabBarVisibilityContext";

const BOTTOM_TAB_BAR_HEIGHT = 80;

const CustomBottomTabBar = ({ state, descriptors, navigation }) => {
  const { scrollY, previousScrollY, scrollDirection } = useScrollContext();
  const { tabBarVisible } = useTabBarVisibility();

  const tabBarAnimatedStyle = useAnimatedStyle(() => {
    "worklet";

    let translateY = 0; // Default: tab bar is visible

    // If the tab bar is globally set to be not visible (from context)
    if (!tabBarVisible) {
      // Instantly hide it, overriding scroll-based animation
      translateY = BOTTOM_TAB_BAR_HEIGHT + 100; // Move far off-screen
    } else {
      // Apply scroll-based hide/show only if it's supposed to be visible
      if (scrollDirection.value === "down" && scrollY.value > 0) {
        translateY = BOTTOM_TAB_BAR_HEIGHT + 10;
      } else if (scrollDirection.value === "up" || scrollY.value <= 0) {
        translateY = 0;
      }
    }

    return {
      transform: [
        {
          translateY: withTiming(translateY, {
            duration: 500, // Shorter duration for instant hide on navigation
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],

      display: tabBarVisible ? "flex" : "none",
    };
  });

  return (
    <Animated.View style={[styles.tabBarContainer, tabBarAnimatedStyle]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        let iconName;
        let isPal = route.name === "Pal";
        switch (route.name) {
          case "Updates":
            iconName = isFocused ? "newspaper" : "newspaper-outline";
            break;
          case "CareerHub":
            iconName = isFocused ? "briefcase" : "briefcase-outline";
            break;
          case "Pal":
            iconName = isFocused
              ? "chatbubble-ellipses"
              : "chatbubble-ellipses-outline";
            break;
          case "Resources":
            iconName = isFocused ? "book" : "book-outline";
            break;
          case "Scheduler":
            iconName = isFocused ? "calendar" : "calendar-outline";
            break;
          default:
            iconName = "help-circle-outline";
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={styles.tabItem}
          >
            {isPal ? (
              <View
                style={{
                  position: "absolute",
                  top: -3,
                  backgroundColor: "#00BF63",
                  borderRadius: 35,
                  width: 65,
                  height: 65,
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
            ) : (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomWidth: 3,
                  borderBottomColor: isFocused ? "#00BF63" : "transparent",
                }}
              >
                <Ionicons
                  name={iconName}
                  color={isFocused ? "#00BF63" : "gray"}
                  size={24}
                />
              </View>
            )}
            {!isPal && ( // Only show label for non-Pal tabs
              <Text
                style={{
                  color: isFocused ? "#00BF63" : "gray",
                  fontSize: 11,
                }}
              >
                {label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row", // <--- THIS IS THE CRITICAL FIX
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_TAB_BAR_HEIGHT,
    backgroundColor: "white",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 20,
  },
});

export default CustomBottomTabBar;
