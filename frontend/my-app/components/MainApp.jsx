import React, { useRef, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import PagerView from "react-native-pager-view";
import PageOne from "./PageOne";
import PageTwo from "./PageTwo";
import PageThree from "./PageThree";
import Pagination from "./Pagination";
import NavigationButtons from "./NavigationButtons";

const MainApp = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef(null);

  const goToNext = () => {
    if (pagerRef.current) {
      pagerRef.current.setPage(currentPage + 1);
    }
  };

  const goToPrev = () => {
    if (pagerRef.current && currentPage > 0) {
      pagerRef.current.setPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        <View key="1" style={{ flex: 1 }}>
          <PageOne />
        </View>
        <View key="2" style={{ flex: 1 }}>
          <PageTwo />
        </View>
        <View key="3" style={{ flex: 1 }}>
          <PageThree />
        </View>
      </PagerView>

      <Pagination currentPage={currentPage} />

      <NavigationButtons
        currentPage={currentPage}
        goToNext={goToNext}
        goToPrev={goToPrev}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  pagerView: {
    flex: 1,
  },
});

export default MainApp;
