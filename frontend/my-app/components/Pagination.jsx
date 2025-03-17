import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Pagination = ({ currentPage }) => {
  const pageTitles = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  ]; // Text for each page

  return (
    <View style={styles.container}>
      <View style={styles.pagination}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[styles.dot, currentPage === index && styles.activeDot]}
          />
        ))}
      </View>
      <Text style={styles.pageText}>{pageTitles[currentPage]}</Text>
      {currentPage === 2 ? (
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "absolute",
    bottom: 160, // Adjusted higher from the bottom
    alignSelf: "center",
    backgroundColor: "#000",
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 5, // Space between dots and text
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 10,
    backgroundColor: "#ccc",
    margin: 10,
  },
  activeDot: {
    backgroundColor: "lightgreen",
    width: 12,
    height: 12,
    borderRadius: 10,
  },
  pageText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fefe",
    textAlign: "center",
    padding: 10,
  },
  button: {
    color: "#fff",
    backgroundColor: "green",
    borderRadius: 15,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 30,
    padding: 10,
  },
});

export default Pagination;
