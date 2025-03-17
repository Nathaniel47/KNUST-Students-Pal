import { Image } from "expo-image";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFinish();
    }, 5000); // Show splash for 5 seconds

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/uguhi.gif")}
        style={styles.video}
        contentFit="contain"
        autoPlay
      />
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
  video: {
    width: "120%",
    height: "100%",
  },
});

export default SplashScreen;
