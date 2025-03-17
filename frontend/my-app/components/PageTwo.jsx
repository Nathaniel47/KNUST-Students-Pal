import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Pagination from "./Pagination";
import NavigationButtons from "./NavigationButtons";
import SvgTwo from "../assets/svg/schedule.svg";

const PageTwo = ({ currentPage, goToNext, goToPrev }) => (
  <View style={styles.page}>
    <Text style={styles.title}>Schedule Task</Text>
    <Text style={styles.content}>And Assignments</Text>
    <SvgTwo width="340px" height="450px"></SvgTwo>
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

    marginBottom: 150,
  },
  title: {
    fontSize: 40,
    color: "white",
  },
  content: {
    fontSize: 40,
    textAlign: "center",
    marginTop: 5,
    color: "green",
    fontWeight: "bold",
  },
});

export default PageTwo;
