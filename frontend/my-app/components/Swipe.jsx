import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  Animated,
  Text,
  StyleSheet,
} from "react-native";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";

const { width } = Dimensions.get("window");

const pages = [
  { id: "1", text: "Page 1" },
  { id: "2", text: "Page 2" },
  { id: "3", text: "Page 3" },
];

let length = pages.length;

const SwipingPage = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0]?.index !== undefined) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      {/* Swipeable Pages */}
      <FlatList
        data={pages}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={[styles.page, { width }]}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />

      {/* Circle Indicator */}
      {/* <AnimatedDotsCarousel
        length={length || 1} // Ensure it's always a valid number
        currentIndex={currentIndex}
        maxIndicators={5}
        interpolateOpacityAndColor={true}
        activeIndicatorConfig={{
          color: "blue",
          margin: 5,
          opacity: 1,
          size: 10,
        }}
        inactiveIndicatorConfig={{
          color: "gray",
          margin: 5,
          opacity: 0.5,
          size: 8,
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    height: 500,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default SwipingPage;
