import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";

const SplashButton = ({ children }) => {
  const highlightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(highlightAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(highlightAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.7}
        onPress={() => console.log("Button Pressed")}
      >
        <Animated.View
          style={[
            styles.highlight,
            {
              opacity: highlightAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0], // Controls highlight effect intensity
              }),
            },
          ]}
        />
        <Text style={styles.buttonText}>{children}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#00BF63",
    borderRadius: 20,
    padding: 12,
    width: 300,
    alignItems: "center",
    overflow: "hidden",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  highlight: {
    ...StyleSheet.absoluteFillObject, // Covers the entire button
    backgroundColor: "white", // Highlight color
    borderRadius: 20,
  },
});

export default SplashButton;
