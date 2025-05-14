import React, { useContext, useState, useRef, useCallback } from "react";
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
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Importing Icon for Eye
import { AuthContext } from "./utility/AuthProvider";

const Link = ({ children }) => {
  const navigation = useNavigation();
  return (
    <TouchableHighlight
      onPress={() => {
        navigation.navigate("Login");
      }}
      underlayColor={null}
    >
      <Text style={styles.link}>{children}</Text>
    </TouchableHighlight>
  );
};

const SignUp = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setID] = useState("");
  const [isError, setIsError] = useState({ error: false, message: "" });
  const { signup } = useContext(AuthContext);

  const [refreshing, setRefreshing] = useState(false);

  // Function to refresh the component
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Reset states or fetch fresh data
    setEmail("");
    setIsError({ error: false, message: "" });
    setID("");

    setTimeout(() => {
      setRefreshing(false); // Stop refreshing after a delay
    }, 1000);
  }, []);

  const handleSignup = async () => {
    let result = await signup({ email, password, id });
    console.log("handlesignup method called");
    if (result.success) {
      // show a successful login message
      console.log("login successful");
      navigation.navigate("Home");
    } else {
      setIsError((prev) => {
        return { ...prev, error: true, message: result.error };
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.mainContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            refreshControl={
              <RefreshControl
                onRefresh={onRefresh}
                refreshing={refreshing}
              ></RefreshControl>
            }
          >
            <View style={styles.container}>
              {/* Logo at the Top */}
              <Image
                source={require("../assets/logo.jpeg")}
                style={styles.img}
                resizeMode="cover"
              />

              {/* Title */}
              <Text style={styles.title}>Create your account</Text>

              {isError.error ? (
                <View style={styles.errorView}>
                  <Text style={styles.errorText}>{isError.message}</Text>
                </View>
              ) : null}

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Student mail"
                  style={styles.textInput}
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                  }}
                />
                <TextInput
                  placeholder="Student ID"
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={id}
                  onChangeText={(value) => {
                    setID(value);
                  }}
                />

                {/* Password Input Field */}
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Password"
                    style={styles.passwordInput}
                    secureTextEntry={!showPassword}
                    onChangeText={(value) => {
                      setPassword(value);
                    }}
                    onSubmitEditing={handleSignup}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Buttons */}
              <TouchableOpacity style={styles.button1} onPress={handleSignup}>
                <Text style={styles.buttonText1}>Sign Up</Text>
              </TouchableOpacity>

              {/* Bottom Text */}
              <View style={styles.bottomContainer}>
                <Text style={styles.bottomText}>
                  Already have an account? <Link> Sign in</Link>
                </Text>
              </View>
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
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginBottom: 100,
  },
  img: {
    width: 250,
    height: 200,
    marginBottom: 20,
    marginTop: -90,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    margin: 20,
    width: "100%",
    alignItems: "center",
  },
  textInput: {
    borderRadius: 10,
    height: 45,
    width: 300,
    fontSize: 18,
    backgroundColor: "#D9D9D9",
    padding: 10,
    marginBottom: 15,
    color: "#333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    height: 45,
    width: 300,
    backgroundColor: "#D9D9D9",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    fontSize: 18,
    color: "#333",
  },
  button1: {
    borderRadius: 20,
    height: 45,
    width: 300,
    backgroundColor: "#00BF63",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText1: {
    fontSize: 18,
    color: "#fff",
  },
  bottomContainer: {
    marginTop: 20,
  },
  bottomText: {
    fontSize: 18,
    textAlign: "center",
  },
  link: {
    fontSize: 18,
    color: "#00BF63",
    position: "relative",
    top: 4,
  },
  errorView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ed4e42",
    width: 310,
    borderRadius: 5,
  },
  errorText: {
    color: "#fff",
    padding: 10,
    fontSize: 16,
  },
});

export default SignUp;
