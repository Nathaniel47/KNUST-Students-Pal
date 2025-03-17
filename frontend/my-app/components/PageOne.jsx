import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Pagination from "./Pagination";
import NavigationButtons from "./NavigationButtons";
import SvgOne from "../assets/svg/question.svg";
import { StatusBar } from "expo-status-bar";

const PageOne = ({ currentPage, goToNext, goToPrev }) => (
  <View style={styles.page}>
    <StatusBar style="light"></StatusBar>
    <Text style={styles.title}>Ask Any</Text>
    <Text style={styles.content}>Campus Info</Text>

    <SvgOne width="340px" height="450px"></SvgOne>
    {/* <Pagination currentPage={currentPage} /> */}
    <NavigationButtons
      currentPage={currentPage}
      goToNext={goToNext}
      goToPrev={goToPrev}
    />
  </View>
);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000",
    marginBottom: 150,
  },
  title: {
    fontSize: 40,
    color: "white",
  },
  content: {
    fontSize: 40,
    textAlign: "center",
    color: "green",
    fontWeight: "bold",
  },
});

export default PageOne;
