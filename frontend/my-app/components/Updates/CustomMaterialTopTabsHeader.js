import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useScrollContext } from "../utility/ScrollContext";
import { LinearGradient } from "expo-linear-gradient";

const MATERIAL_TOP_TAB_BAR_HEIGHT = 60;

const CustomMaterialTopTabsHeader = ({
  state,
  descriptors,
  navigation,
  position,
}) => {
  const { scrollY, previousScrollY, scrollDirection } = useScrollContext();

  const animatedHeaderStyle = useAnimatedStyle(() => {
    "worklet";

    let translateY = 0;

    if (scrollDirection.value === "down" && scrollY.value > 0) {
      translateY = -MATERIAL_TOP_TAB_BAR_HEIGHT;
    } else if (scrollDirection.value === "up") {
      translateY = 0;
    }

    if (scrollY.value <= 0) {
      translateY = 0;
    }

    return {
      transform: [
        {
          translateY: withTiming(translateY, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    };
  });

  const handleTabPress = (index, routeName) => {
    navigation.navigate(routeName);
  };

  return (
    <Animated.View style={[animatedHeaderStyle, styles.tabBarContainer]}>
      <LinearGradient
        colors={[
          "rgba(0, 191, 99, 0.2)",
          "rgba(0, 191, 99, 0.07)",
          "rgba(0, 191, 99, 0.03)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* <View style={styles.searchBox}>
          <View style={styles.searchContent}>
            <Ionicons name="search" size={24} color="gray" />
            <TextInput
              placeholder="Search updates..."
              style={styles.searchInput}
            />
          </View>
        </View> */}

        <View style={styles.tabBarWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabBar}
          >
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label = options.title || route.name;
              const isFocused = state.index === index;

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={() => handleTabPress(index, route.name)}
                  activeOpacity={0.7}
                >
                  <Animated.View
                    style={[
                      styles.tabButton,
                      isFocused && styles.focusedTabButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        isFocused && styles.focusedTabText,
                      ]}
                    >
                      {label}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // searchBox: {
  //   height: SEARCH_INPUT_AREA_HEIGHT,
  //   justifyContent: "center",
  //   paddingHorizontal: 20,
  // },
  tabBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    height: MATERIAL_TOP_TAB_BAR_HEIGHT,
    backgroundColor: "white",
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    paddingLeft: 10,
    gap: 5,
    overflow: "hidden",
    backgroundColor: "#fff",
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },

  tabBarWrapper: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    height: MATERIAL_TOP_TAB_BAR_HEIGHT,
    justifyContent: "center", // Center tabs vertically
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6, // Match your original padding
  },
  tabButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 30,
    backgroundColor: "#fff",
    borderColor: "gray",
    borderWidth: 0.4,
  },
  focusedTabButton: {
    backgroundColor: "#6200ee", // Your focused color
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
  tabBarIndicator: { backgroundColor: "transparent" },
  tabBarItemStyle: {
    width: "auto",
    borderRadius: 30,
    borderColor: "gray",
    borderWidth: 0.5,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  tabBarLabelStyle: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "none",
  },
});

export default CustomMaterialTopTabsHeader;
