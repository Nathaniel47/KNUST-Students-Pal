import React, {
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
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
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Importing Icon for Eye
import { AuthContext } from "./utility/AuthProvider";
import { TopWave, BottomWave } from "./utility/BackgroundWaves";
import { useToast } from "./utility/ToastContext";

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
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setID] = useState("");
  const [isError, setIsError] = useState({
    error: false,
    message: "",
    type: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const { signup } = useContext(AuthContext);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  // Function to refresh the component
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Reset states or fetch fresh data
    setMail("");
    setIsError({ error: false, message: "" });
    setID("");

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleSignup = async () => {
    setLoading(true);
    let result = await signup({ mail, password, id, username });
    setLoading(false);
    if (result.success) {
      // show a successful login message
      navigation.navigate("HomeTabs");
    } else {
      setIsError((prev) => {
        return {
          ...prev,
          error: true,
          message: result.error,
          type: result.type,
        };
      });
      showToast(result.error, 6000);
    }
  };

  useEffect(() => {
    if (!(mail && id && password && username)) {
      setIsError(false);
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.mainContainer}>
          <StatusBar
            backgroundColor={"#00BF63"}
            barStyle={"light-content"}
          ></StatusBar>
          <TopWave />
          {/* <BottomWave /> */}
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            // refreshControl={
            //   <RefreshControl
            //     onRefresh={onRefresh}
            //     refreshing={refreshing}
            //   ></RefreshControl>
            // }
          >
            <View style={styles.container}>
              {/* Logo at the Top */}

              {/* <Image
                source={require("../assets/login.jpeg")}
                style={styles.img}
                resizeMode="cover"
              /> */}

              {/* Title */}
              <Text style={styles.title}>Create your account</Text>

              {isError.error && (
                <View style={styles.errorView}>
                  <Text style={styles.errorText}>{isError.message}</Text>
                </View>
              )}

              {successMessage ? (
                <View style={styles.successView}>
                  <Text style={styles.successText}>{successMessage}</Text>
                </View>
              ) : null}

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputContent,
                    {
                      borderColor:
                        username && isError && isError.type == "name"
                          ? "red"
                          : "#ddd",
                    },
                  ]}
                >
                  <TextInput
                    placeholder="Name"
                    style={[styles.textInput]}
                    value={username}
                    onChangeText={(value) => {
                      setUsername(value);
                    }}
                  />
                  {username && isError && isError.type == "name" ? (
                    <Ionicons name="alert-circle" color="red" size={22} />
                  ) : (
                    <Ionicons name="person-circle-outline" size={22} />
                  )}
                </View>
                <View
                  style={[
                    styles.inputContent,
                    {
                      borderColor:
                        mail && isError && isError.type == "mail"
                          ? "red"
                          : "#ddd",
                    },
                  ]}
                >
                  <TextInput
                    placeholder="Student mail"
                    style={[styles.textInput]}
                    value={mail}
                    onChangeText={(value) => {
                      setMail(value);
                    }}
                  />
                  {mail && isError && isError.type == "mail" ? (
                    <Ionicons name="alert-circle" color="red" size={22} />
                  ) : (
                    <Ionicons name="mail-outline" size={22} />
                  )}
                </View>

                <View
                  style={[
                    styles.inputContent,
                    {
                      borderColor:
                        id && isError && isError.type === "id" ? "red" : "#ddd",
                    },
                  ]}
                >
                  <TextInput
                    placeholder="Student ID"
                    style={[styles.textInput]}
                    keyboardType="numeric"
                    value={id}
                    onChangeText={(value) => {
                      setID(value);
                    }}
                  />
                  {id && isError && isError.type === "id" ? (
                    <Ionicons name="alert-circle" color={"red"} size={22} />
                  ) : (
                    <Ionicons name="lock-closed-outline" size={22} />
                  )}
                </View>

                {/* Password Input Field */}
                <View style={styles.inputContent}>
                  <TextInput
                    placeholder="Password"
                    style={styles.textInput}
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
                      size={22}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Buttons */}
              <TouchableOpacity
                style={[
                  styles.button1,
                  {
                    backgroundColor:
                      mail && password && id && username
                        ? "#00BF63"
                        : "#CDE8DB",
                  },
                ]}
                onPress={handleSignup}
                disabled={!(username && mail && id && password)}
              >
                {loading ? (
                  <ActivityIndicator color="white" size={"large"} />
                ) : (
                  <Text style={styles.buttonText1}>Sign up</Text>
                )}
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.guestButtonContainer}>
                <TouchableHighlight style={styles.guestButton} onPress={() => navigation.navigate("GuestSignUp")} underlayColor={null}>
                  <Text style={styles.guestButtonText}>Sign up as a guest</Text>
                </TouchableHighlight>
              </View>

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

// Same imports as your original code
// ...
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9", // Soft neutral background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  img: {
    width: 200,
    height: 150,
  },
  container: {
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    // shadowColor: "#000",
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    // shadowOffset: { width: 0, height: 4 },
    // elevation: 1,
    marginTop: 30,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#111",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    gap: 12,
  },
  inputContent: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 14,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingRight: 10,
  },
  button1: {
    borderRadius: 20,
    height: 45,
    width: "100%",
    backgroundColor: "#00BF63",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    shadowColor: "#00BF63",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText1: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  bottomContainer: {
    marginTop: 20,
  },
  bottomText: {
    fontSize: 18,
    textAlign: "center",
    color: "#444",
  },
  link: {
    fontSize: 18,
    position: "relative",
    top: 5,
    color: "#00BF63",
    fontWeight: "600",
  },
  errorView: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "100%",
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "700",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  divider: {
    flex: 1,
    height: 1,
    width: "40%",
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#888",
  },
  guestButtonContainer: {
    width: "100%",
    marginTop: 20,
  },
  guestButton: {
    borderColor: "#00BF63",
    borderWidth: 1.5,
    height: 45,
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    width: "100%",
  },
  guestButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00BF63",
  },
});

export default SignUp;
