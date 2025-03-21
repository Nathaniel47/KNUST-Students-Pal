import PagerView from "react-native-pager-view";
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Animated,
} from "react-native";
import { QuestionPage, SchedulePage, RemainderPage } from "./OnboardingPages";
import { useState, useRef, useEffect } from "react";
import { Pagination } from "./utility/Pagination";
import SplashButton from "./utility/SplashButton";
import { SafeAreaView } from "react-native-safe-area-context";

const OnBoardContainer = ({ navigation }) => {
  const [pageSelected, setPageSelected] = useState(0);
  const pagerRef = useRef(null);
  const totalPages = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setPageSelected((prev) => {
        const nextPage = (prev + 1) % totalPages; // Loops back to 0 after the last page
        pagerRef.current?.setPage(nextPage); // Moves to the next page
        return nextPage;
      });
    }, 6000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <PagerView
          style={styles.pagerView}
          initialPage={0}
          scrollEnabled={true}
          ref={pagerRef}
          onPageSelected={({ nativeEvent: { position } }) => {
            setPageSelected(position);
          }}
        >
          <View style={styles.container}>
            <QuestionPage></QuestionPage>
          </View>
          <View style={styles.container}>
            <SchedulePage></SchedulePage>
          </View>
          <View style={styles.container}>
            <RemainderPage></RemainderPage>
          </View>
        </PagerView>

        <Pagination selected={pageSelected} />
        <SplashButton navigation={navigation}>Get Started</SplashButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },

  mainContainer: {
    flex: 1,
    padding: 20,
  },

  container: {
    flex: 1,
  },
});

export default OnBoardContainer;
