import { View, Image, StyleSheet, Text } from "react-native";

const SplashLogo = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.jpeg")} // Your GIF file
        style={styles.gif}
        resizeMode="contain"
      />
      <Text style={{position:'absolute', bottom:30, fontSize:18}}>chat with AI pal</Text>
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
