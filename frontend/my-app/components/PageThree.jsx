import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Pagination from "./Pagination";
import NavigationButtons from "./NavigationButtons";
import SvgThree from "../assets/svg/remainders.svg";

const PageThree = ({ currentPage, goToNext, goToPrev }) => (
  <View style={styles.page}>
    <Text style={styles.title}>Set Personal</Text>
    <Text style={styles.content}>Remainders</Text>
    <SvgThree width="340px" height="320px"></SvgThree>
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
    marginBottom: 260,
  },
  title: {
    fontSize: 40,
    color: "white",
  },
  content: {
    fontSize: 40,
    textAlign: "center",
    marginTop: 2,
    color: "green",
    fontWeight: "bold",
    marginBottom: 30,
  },
});

export default PageThree;
