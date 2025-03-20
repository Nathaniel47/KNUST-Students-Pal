import PagerView from "react-native-pager-view";
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Animated,
} from "react-native";
import { QuestionPage, SchedulePage, RemainderPage } from "./OnboardingPages";
import { useState } from "react";
import { Pagination } from "./utility/Pagination";
import SplashButton from "./utility/SplashButton";

const OnBoardContainer = () => {
  const [pageSelected, setPageSelected] = useState(0);
  return (
    <View style={styles.container}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        scrollEnabled={true}
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
      <SplashButton>Get Started</SplashButton>
    </View>
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

  container: {
    flex: 1,
  },
});

export default OnBoardContainer;
