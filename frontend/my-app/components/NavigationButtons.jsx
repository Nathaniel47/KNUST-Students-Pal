import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Using AntDesign icons

const NavigationButtons = ({ currentPage, goToNext, goToPrev }) => (
  <View style={styles.navButtons}>
    {currentPage > 0 && (
      <TouchableOpacity onPress={goToPrev} style={[styles.button, styles.left]}>
        <AntDesign name="arrowleft" size={25} color="white" />
      </TouchableOpacity>
    )}
    {currentPage < 2 && (
      <TouchableOpacity
        onPress={goToNext}
        style={[styles.button, styles.right]}
      >
        <AntDesign name="arrowright" size={25} color="white" />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  navButtons: {
    position: "absolute",
    bottom: 80, // Moved higher from the bottom
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  button: {
    padding: 12,
    backgroundColor: "lightgreen",
    borderRadius: 50,
  },
  left: {
    position: "absolute",
    left: 30,
  },
  right: {
    position: "absolute",
    right: 30,
  },
});

export default NavigationButtons;
