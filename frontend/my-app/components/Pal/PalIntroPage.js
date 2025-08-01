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
  StatusBar,
  Animated,
  Dimensions,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

const options = [
  { icon: "information-circle-outline", text: "KNUST Campus Info" },
  { icon: "compass-outline", text: "Campus Directions" },
  { icon: "bulb-outline", text: "Plan Daily Tasks" },
  { icon: "business-outline", text: "Campus Facilities" },
  { icon: "people-outline", text: "Clubs & Communities" },
  { icon: "calendar-outline", text: "Upcoming Events" },
];

const introText = [
  "Make your day easy with us",
  "How can I help today",
  "What is new for the day",
];

const PalIntroPage = ({}) => {
  const [textIndex, setTextIndex] = useState(0);
  const [text, setText] = useState(introText[0]);
  const [resent, setResent] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useFocusEffect(useCallback(()=>{
    const parent = navigation?.getParent();
    const grandParent = parent?.getParent();

    if(grandParent){
      grandParent.setOptions({
         headerRight: () => (
                    <View
                      style={{
                        marginRight: 20,
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 10,
                      }}>
                      <TouchableOpacity>
                        <Ionicons name="notifications-outline" size={24}></Ionicons>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Ionicons name="person-circle-outline" size={24}></Ionicons>
                      </TouchableOpacity>
            </View>
        ),
      })
    }

    return ()=>{
      if(grandParent){
        grandParent.setOptions({
          headerRight: () => ( // Set back to your default headerRight for other tabs
                        <View
                          style={{
                            marginRight: 20,
                            flexDirection: 'row',
                            gap: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 10,
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('Search');
                            }}
                            style={{
                              flexDirection: 'row',
                              gap: 10,
                              alignItems: 'center',
                              borderWidth: 1,
                              borderRadius: 20,
                              paddingHorizontal: 20,
                              alignSelf: 'center',
                              width: 230,
                              marginTop: 2,
                              backgroundColor: '#fff',
                              paddingVertical: 10,
                              height: 40,
                            }}>
                            <Ionicons name="search-outline" size={20} />
                            <Text>Search updates....</Text>
                          </TouchableOpacity>
                          <TouchableOpacity>
                            <Ionicons name="notifications-outline" size={24}></Ionicons>
                          </TouchableOpacity>
                          <TouchableOpacity>
                            <Ionicons name="person-circle-outline" size={24}></Ionicons>
                          </TouchableOpacity>
                        </View>
                      ),
        })
      }
    }
  }, [navigation]))

  const fadeIn = () => {
    fadeAnim.setValue(0); // Reset
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fadeIn(); // Fade in the first time

    const interval = setInterval(() => {
      setTextIndex((prev) => {
        const nextIndex = (prev + 1) % introText.length;
        fadeIn(); // Fade in every new text
        return nextIndex;
      });
    }, 6000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

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
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.textContent}>
            <Text style={styles.title}>Hello James</Text>
            <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
              {introText[textIndex]}
            </Animated.Text>
          </View>

          <View style={styles.cardsContainer}>
            <View style={styles.card1}>
              <ImageBackground
                style={styles.backgroundImage}
                source={require("../../assets/background1.jpg")}
              >
                <TouchableOpacity style={styles.card1Content}>
                  <LottieView
                    style={styles.lottie}
                    source={require("../../assets/lottie/mic.json")}
                    autoPlay
                    loop
                  />
                  <View style={styles.card1TextContent}>
                    <Text style={styles.card1Text1}>Talk with Pal</Text>
                    <Text style={styles.card1Text2}>Lets try it now</Text>
                  </View>
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <View style={styles.cards12Container}>
              <View style={styles.card2}>
                <TouchableOpacity
                  style={styles.card2Content}
                  onPress={() => {
                    navigation.navigate("PalChatPage");
                  }}
                >
                  <View style={styles.card2IconsContainer}>
                    <Ionicons
                      name="chatbubble"
                      size={30}
                      style={styles.card2Icon}
                    />
                    <Ionicons
                      name="chatbubble-outline"
                      size={30}
                      style={styles.card2Icon2}
                    />
                  </View>
                  <Text style={styles.card2Text}>New chat</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.card3}>
                <TouchableOpacity style={styles.card3Content}>
                  <Ionicons
                    name="images-outline"
                    size={30}
                    style={styles.card3Icon}
                    color="#fff"
                  />
                  <Text style={styles.card3Text}>Search by image</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.queriesContainer}>
            <Text style={styles.labelText}>
              {resent ? "History" : "Explore"}
            </Text>
            <View style={styles.queriesContent}>
              {options.map((item, index) => (
                <TouchableOpacity key={index} style={styles.query}>
                  <Ionicons
                    name={item.icon}
                    size={30}
                    style={styles.queryIcon1}
                  />
                  <Text style={styles.queryText}>{item.text}</Text>
                  {/* <Ionicons
                      name="arrow-forward"
                      size={30}
                      style={styles.queryIcon2}
                    /> */}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Start new chat</Text>
              <Ionicons
                name="arrow-forward"
                size={24}
                style={styles.startButtonIcon}
              />
            </TouchableOpacity> */}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContent: {
    padding: 20,
  },
  title: {
    fontSize: 30,
    marginVertical: 5,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
  },
  lottie: {
    width: 100,
    height: 100,
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 10,
    padding: 20,
    width: "100%",
  },
  cards12Container: {
    width: "45%",
    gap: 10,
  },
  card1: {
    height: 300,
    width: "48%",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    backgroundColor: "#fff",
    elevation: 4,
  },
  card1Content: {
    justifyContent: "space-between",
    height: "100%",
  },
  card1TextContent: {
    padding: 10,
  },
  card1Text1: {
    fontSize: 20,
    fontWeight: "bold",
  },
  card1Text2: {
    color: "#555",
  },
  backgroundImage: {
    borderRadius: 20,
    resizeMode: "contain",
  },
  card2: {
    borderColor: "#EBD9F7",
    borderWidth: 1,
    height: 142,
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#EBD9F7",
    elevation: 5,
    padding: 20,
  },
  card2Content: {
    height: "100%",
    justifyContent: "space-between",
  },
  card2Lottie: {
    width: 150,
    height: 150,
    backgroundColor: "red",
  },
  card2Icon: {
    color: "#9333ea",
  },
  card2Icon2: {
    color: "#c084fc",
    position: "absolute",
    left: 8,
    top: 6,
  },
  card2Text: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },

  card3: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "#1f2937",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    height: 142,
  },
  card3Content: {
    flex: 1,
    justifyContent: "space-between",
  },
  card3Text: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  queriesContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  queriesContent: {
    gap: 15,
  },
  labelText: {
    fontSize: 20,
    padding: 20,
    color: "#555",
  },
  query: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    gap: 16,
  },
  queryText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    fontWeight: "500",
  },
  queryIcon1: {
    backgroundColor: "#dbeafe",
    padding: 5,
    borderRadius: 20,
    color: "#1e3a8a",
  },
  startButton: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignSelf: "center",
    backgroundColor: "black",
    paddingVertical: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 30,
    bottom: "20%",
  },
  startButtonIcon: {
    color: "#fff",
    backgroundColor: "#444",
    padding: 5,
    borderRadius: 20,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    paddingLeft: 10,
  },
});

export default PalIntroPage;
