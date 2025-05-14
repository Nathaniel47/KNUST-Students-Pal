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
import { useContext, useRef, useState, useCallback } from "react";
import { AuthContext } from "./utility/AuthProvider";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState({ error: false, message: "" });
  const { login } = useContext(AuthContext);

  // Refresh state
  const [refreshing, setRefreshing] = useState(false);

  // Function to refresh the component
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Reset states or fetch fresh data
    setEmail("");
    setIsError({ error: false, message: "" });

    setTimeout(() => {
      setRefreshing(false); // Stop refreshing after a delay
    }, 1000);
  }, []);

  const handleLogin = async () => {
    let result = await login({ email, password });
    if (result.success) {
      // show a successful login message
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
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
              <Text style={styles.title}>Login to your account</Text>

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
                  placeholder="Password"
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                  }}
                  style={styles.textInput}
                  secureTextEntry={true}
                  onSubmitEditing={handleLogin}
                />
              </View>

              {/* Buttons */}
              <TouchableOpacity style={styles.button1} onPress={handleLogin}>
                <Text style={styles.buttonText1}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2}>
                <Text style={styles.buttonText2}>Guest Sign In</Text>
              </TouchableOpacity>

              {/* Bottom Text */}
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
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginBottom: 100, // Reduced to move everything up
  },
  img: {
    width: 250,
    height: 200,
    marginBottom: 20,
    marginTop: -90, // Moves the logo to the far top
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
    top: 3,
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

export default LogIn;
