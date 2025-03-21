import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = ({ navigation }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.mainContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
              <Image
                source={require("../assets/login.jpeg")}
                style={[
                  styles.img,
                  { marginTop: Platform.OS === "android" ? 50 : null },
                ]}
                resizeMode="contain"
              />

              <View style={styles.view1}>
                <Text style={styles.title}>Create your account</Text>
              </View>

              <View style={styles.view2}>
                <TextInput
                  placeholder="Student mail"
                  style={styles.textInput}
                />
                <TextInput
                  placeholder="Student ID"
                  style={styles.textInput}
                  keyboardType="numeric"
                />

                <TextInput
                  placeholder="Confirm student ID"
                  style={styles.textInput}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.view3}>
                <TouchableOpacity style={styles.button1}>
                  <Text style={styles.buttonText1}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              {/* <View style={styles.view3}>
                <Text style={styles.bottomText}>
                  Don't have an account? <Link> Sign up</Link>
                </Text>
              </View> */}
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    padding: 20,
  },
  textInput: {
    borderRadius: 10,
    height: 50,
    width: 310,
    fontSize: 22,
    textAlign: "left",
    backgroundColor: "#D9D9D9",
    padding: 10,
    margin: 10,
    color: "#333",
  },
  button1: {
    borderRadius: 10,
    height: 50,
    width: 310,
    fontSize: 22,
    textAlign: "left",
    backgroundColor: "#00BF63",
    padding: 10,
    marginBottom: 60,
  },

  buttonText1: {
    fontSize: 22,
    textAlign: "center",
    color: "#fff",
  },
  buttonText2: {
    fontSize: 22,
    textAlign: "center",
    color: "#00BF63",
  },
  img: {
    width: 300,
    height: 250,
  },
  view1: {
    justifyContent: "center",
    alignItems: "center",
  },
  view2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  view3: {
    flex: 1,
  },
});

export default SignUp;
