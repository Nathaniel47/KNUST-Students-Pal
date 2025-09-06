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


const GuestSignUp = ({ navigation }) => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const { guestSignup } = useContext(AuthContext);
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

  const handleSignup = async () => {
    setLoading(true);

    let result = await guestSignup({ mail, password });

    setLoading(false);

    if (result.success) {
      // Use navigation.reset to prevent going back to signup screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeTabs' }],
      });
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

          <StatusBar
            backgroundColor={"#00BF63"}
            barStyle={"light-content"}
          ></StatusBar>

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
      
          >
            <View style={styles.container}>
       

              <Text style={styles.title}>Create A Guest Account</Text>
             

              {isError.error && (
                <View style={styles.errorView}>
                  <Text style={styles.errorText}>
                    {typeof isError.message === 'string' 
                      ? isError.message 
                      : 'Something went wrong. Please try again.'
                    }
                  </Text>
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
                    placeholder="Email"
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
                    onSubmitEditing={handleSignup}
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
                onPress={handleSignup}
                disabled={!(mail && password)}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="large" />
                ) : (
                  <Text style={styles.buttonText1}>Continue</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.googleLoginButton}>
                <Image
                  source={require("../assets/google-logo.png")}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <Text style={styles.googleLoginText}>Continue with Google</Text>
              </TouchableOpacity>
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
  googleLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    width: 300,
    height: 45,
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#fff",

  },
  googleLoginText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  subTitle: {       
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
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

export default GuestSignUp;