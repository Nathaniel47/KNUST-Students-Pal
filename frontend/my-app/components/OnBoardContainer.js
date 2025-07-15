import PagerView from "react-native-pager-view";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { TopWave, BottomWave } from "./utility/BackgroundWaves";

const { width } = Dimensions.get("window");

const slides = [
  {
    text1: "Ask Any",
    text2: "Campus Info",
    description:
      "Get instant answers about campus life, updates, scholarships, and more. Your personal student assistant is here to help!",
    animation: require("../assets/lottie/question.json"),
    id: 0,
  },
  {
    text1: "Schedule Your",
    text2: "Tasks & Assignments",
    description:
      "Plan your day effortlessly. Organize tasks, set priorities, and stay on top of your schedule with ease.",
    animation: require("../assets/lottie/reminder.json"),
    id: 1,
  },
  {
    text1: "Set Personal",
    text2: "Reminders",
    description:
      "Never miss a deadline. Get timely reminders for assignments, events, and important tasks to stay on track.",
    animation: require("../assets/lottie/schedule.json"),
    id: 2,
  },
];

const GreenText = ({ children }) => {
  return <Text style={styles.greenText}>{children}</Text>;
};

const OnBoardContainer = ({ navigation }) => {
  const [position, setPosition] = useState(0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopWave />
        <BottomWave />

        <PagerView
          style={styles.pager}
          initialPage={1}
          onPageSelected={({ nativeEvent: { position } }) =>
            setPosition(position)
          }
        >
          {slides.map((item) => (
            <View key={item.id} style={styles.page}>
              <Text style={styles.title}>{item.text1}</Text>
              <GreenText>{item.text2}</GreenText>
              <LottieView
                source={item.animation}
                autoPlay
                loop
                style={styles.lottie}
              />
              <Text style={styles.description}>{item.description}</Text>
            </View>
          ))}
        </PagerView>

        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, { opacity: position === index ? 1 : 0.3 }]}
            />
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate("Signup")}
            activeOpacity={0.8}
          >
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.8}
          >
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  greenText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#00BF63",
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  lottie: {
    width: 280,
    height: 280,
    marginVertical: 10,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#00BF63",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonsContainer: {
    paddingHorizontal: 30,
    marginBottom: 30,
    gap: 12,
  },
  signupButton: {
    backgroundColor: "#00BF63",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    elevation: 2,
  },
  signupText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#fff",
    borderColor: "#00BF63",
    borderWidth: 1.5,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    elevation: 2,
  },
  loginText: {
    color: "#00BF63",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default OnBoardContainer;