import { View, Image } from "react-native";

const SplashLogo = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Image
        source={require("../assets/uguhi.gif")}
        style={{ width: "100%" }}
        resizeMode="contain"
      ></Image>
    </View>
  );
};

export default SplashLogo;
