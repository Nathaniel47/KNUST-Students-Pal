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
import { styles as loginStyles } from "./LogIn"; // Renamed styles from LogIn

const Link = ({ children }) => {
  const navigation = useNavigation();
  return (
    <TouchableHighlight
      onPress={() => {
        navigation.navigate("Login");
      }}
      underlayColor={null}
    >
      <Text style={loginStyles.link}>{children}</Text>
    </TouchableHighlight>
  );
};

const SignUp = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setID] = useState("");
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const { signup } = useContext(AuthContext);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setMail("");
    setIsError({ error: false, message: "" });
    setID("");
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleSignup = async () => {
    console.log("handleSignup method called");
    const result = await signup({ mail, password, id, username });

    if (result.success) {
      setIsError({ error: false, message: "" });
      setSuccessMessage("Welcome Pal!");
      navigation.navigate("HomeTabs")

      setTimeout(() => {
      
        setSuccessMessage("");
      }, 1500);
    } else {
      setIsError({ error: true, message: result.error });
      setSuccessMessage("");
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
              />
            }
          >
            <View style={styles.container}>
              <Image
                source={require("../assets/logo.jpeg")}
                style={styles.img}
                resizeMode="cover"
              />

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

              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Name"
                  style={styles.textInput}
                  value={username}
                  onChangeText={(value) => setUsername(value)}
                />
                <TextInput
                  placeholder="Student mail"
                  style={styles.textInput}
                  value={mail}
                  onChangeText={(value) => setMail(value)}
                />
                <TextInput
                  placeholder="Student ID"
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={id}
                  onChangeText={(value) => setID(value)}
                />

                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Password"
                    style={styles.passwordInput}
                    secureTextEntry={!showPassword}
                    onChangeText={(value) => setPassword(value)}
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

              <TouchableOpacity style={styles.button1} onPress={handleSignup}>
                <Text style={styles.buttonText1}>Sign Up</Text>
              </TouchableOpacity>

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
  successView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00BF63",
    width: 310,
    borderRadius: 5,
    marginBottom: 10,
  },
  successText: {
    color: "#fff",
    padding: 10,
    fontSize: 16,
  },
});

export default SignUp;
