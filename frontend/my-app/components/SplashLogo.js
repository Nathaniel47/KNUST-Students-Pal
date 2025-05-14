import { View, Image, StyleSheet } from "react-native";

const SplashLogo = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/uguhi.gif")} // Your GIF file
        style={styles.gif}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Background color for splash screen
  },
  gif: {
    width: "80%", // Adjust as needed
    height: "50%", // Adjust as needed
  },
});

export default SplashLogo;
