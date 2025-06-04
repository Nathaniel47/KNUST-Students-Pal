import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const options = [
  { icon: "information-circle-outline", text: "KNUST info" },
  { icon: "compass-outline", text: "Direction" },
  { icon: "bulb-outline", text: "Ideas" },
  { icon: "business-outline", text: "Campus facilities" },
];

const Pal = () => {
  return (
    <LinearGradient
      colors={[
        "rgba(0, 191, 99, 0.08)",
        "rgba(0, 191, 99, 0.1)",
        "rgba(0, 191, 99, 0.2)",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.innerContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.introContainer}>
              <Text style={styles.introText1}>Hello John !</Text>
              <Text style={styles.introText2}>What are we doing today?</Text>
            </View>

            <View style={styles.cardsContainer}>
              {options.map((item, index) => (
                <TouchableOpacity style={styles.card} key={index}>
                  <Ionicons name={item.icon} size={20} />
                  <Text style={styles.cardText}>{item.text}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Add a spacer to ensure enough scroll room */}
            <View style={{ height: 120 }} />
          </ScrollView>

          {/* ✅ This should be positioned absolutely */}
          <View style={styles.inputContainer}>
            <View style={styles.inputContent}>
              <TouchableOpacity>
                <Ionicons name="mic-outline" size={28} />
              </TouchableOpacity>
              <TextInput
                placeholder="Message"
                style={styles.input}
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="chatbubble-outline" size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    paddingTop: 20,
  },
  introContainer: {
    alignItems: "center",
  },
  introText1: {
    fontSize: 25,
  },
  introText2: {
    fontSize: 20,
  },
  cardsContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
    marginTop: 200,
    width: 300,
    alignSelf: "center",
  },
  card: {
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#fff",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
  cardText: {
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    paddingTop: 10,
    backgroundColor: "transparent",
    position: "absolute", // ✅ key fix
    bottom: 0, // ✅ ensures it floats
  },
  inputContent: {
    flexDirection: "row",
    backgroundColor: "#fff",
    width: "80%",
    alignItems: "center",
    borderRadius: 20,
    padding: 5,
  },
  input: {
    width: "90%",
  },
  sendButton: {
    backgroundColor: "#00BF63",
    padding: 12,
    borderRadius: 40,
  },
});

export default Pal;