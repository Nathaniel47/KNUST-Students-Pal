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
import { useContext, useRef, useState, useCallback, useEffect } from "react";
import { AuthContext } from "./utility/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { TopWave, BottomWave } from "./utility/BackgroundWaves";
import Toast from "react-native-toast-message";
import { useToast } from "./utility/ToastContext";

const Link = ({ children }) => {
  const navigation = useNavigation();
  return (
    <TouchableHighlight
      onPress={() => {
        navigation.navigate("Signup");
      }}
      underlayColor={null}
    >
      <Text style={styles.link}>{children}</Text>
    </TouchableHighlight>
  );
};

const LogIn = ({ navigation }) => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setMail("");
    setPassword("");
    setIsError({ error: false, message: "" });
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLogin = async () => {
    setLoading(true);

    let result = await login({ mail, password });

    setLoading(false);

    if (result.success) {
      navigation.navigate("HomeTabs");
    } else {
      setIsError({ error: true, message: result.error });
      showToast(result.error, 6000);
    }
  };

  useEffect(() => {
    //clears the error message when password and email are empty
    if (!(password && mail)) {
      setIsError(false);
    }
  }, [password, mail]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.mainContainer}>
          <TopWave />
          {/* <BottomWave /> */}

          <StatusBar
            backgroundColor={"#00BF63"}
            barStyle={"light-content"}
          ></StatusBar>

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            // refreshControl={
            //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            // }
          >
            <View style={styles.container}>
              {/* <Image
                source={require("../assets/login.jpeg")}
                style={styles.img}
                resizeMode="cover"
              /> */}

              <Text style={styles.title}>Login to your account</Text>

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
                <View style={styles.inputContent}>
                  <TextInput
                    placeholder="Student mail"
                    style={styles.textInput}
                    value={mail}
                    onChangeText={(value) => {
                      setMail(value);
                    }}
                  />
                  <Ionicons name="mail-outline" size={22} />
                </View>

                <View style={styles.inputContent}>
                  <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                    }}
                    style={styles.textInput}
                    secureTextEntry={!showPassword}
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={22}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.forgotPasswordTab}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.button1,
                  {
                    backgroundColor: mail && password ? "#00BF63" : "#CDE8DB",
                  },
                ]}
                onPress={handleLogin}
                disabled={!(mail && password)}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="large" />
                ) : (
                  <Text style={styles.buttonText1}>Sign In</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button2}
                onPress={() => {
                  navigation.navigate("GuestSignIn");
                }}
              >
                <Text style={styles.buttonText2}>Guest Sign in</Text>
              </TouchableOpacity>

              <View style={styles.bottomContainer}>
                <Text style={styles.bottomText}>
                  Don't have an account? <Link> Sign up</Link>
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
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    // shadowColor: "#000",
    // shadowOpacity: 0.02,
    // shadowRadius: 4,
    // shadowOffset: { width: 0, height: 2 },
    // elevation: 1,
    marginTop: 50,
    marginBottom: 10,
  },
  img: {
    width: 250,
    height: 200,
    marginBottom: 20,
    marginTop: -90,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  inputContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: 300,
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  forgotPasswordTab: {
    alignSelf: "flex-end",
    paddingRight: 10,
    justifyContent: "center",
  },
  forgotPasswordText: {
    fontWeight: "bold",
    color: "#555",
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
  button2: {
    borderRadius: 20,
    height: 45,
    width: 300,
    borderColor: "#00BF63",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText1: {
    fontSize: 18,
    color: "#fff",
  },
  buttonText2: {
    fontSize: 18,
    color: "#00BF63",
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
    top: 5,
  },
  errorView: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
    width: 300,
    borderRadius: 5,
  },
  errorText: {
    color: "#fff",
    padding: 10,
    fontSize: 14,
    color: "#ed4e42",
    fontWeight: "bold",
  },
  successView: {
    backgroundColor: "#4BB543",
    width: 310,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  successText: {
    color: "#fff",
    padding: 10,
    fontSize: 16,
  },
});

export default LogIn;
