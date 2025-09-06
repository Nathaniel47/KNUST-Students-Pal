import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  ImageBackground,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { useState, useRef, useEffect, useCallback, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { AuthContext } from "../utility/AuthProvider";

const options = [
  { 
    icon: "information-circle-outline", 
    text: "KNUST Campus Info",
    question:'Give me detailed information about KNUST campus.',
    gradient: ["#3b82f6", "#1d4ed8"],
    description: "Get comprehensive information about campus"
  },
  { 
    icon: "compass-outline", 
    text: "Campus Directions",
    question:'Give me directions to the library on campus.',
    gradient: ["#10b981", "#059669"],
    description: "Navigate through the campus easily"
  },
  { 
    icon: "bulb-outline", 
    text: "Plan Daily Tasks",
    question:'Help me plan my tasks for today.',
    gradient: ["#f59e0b", "#d97706"],
    description: "Organize your daily activities efficiently"
  },
  { 
    icon: "business-outline", 
    text: "Campus Facilities",
    question:'What facilities are available on campus?',
    gradient: ["#8b5cf6", "#7c3aed"],
    description: "Discover available campus facilities"
  },
  { 
    icon: "people-outline", 
    text: "Clubs & Communities",
    question:'What student organizations can I join?',
    gradient: ["#ef4444", "#dc2626"],
    description: "Connect with student organizations"
  },
  { 
    icon: "calendar-outline", 
    text: "Upcoming Events",
    question:'What events are happening on campus this week?',
    gradient: ["#06b6d4", "#0891b2"],
    description: "Stay updated with campus events"
  },
];

const introText = [
  "Make your day easy with us",
  "How can I help today?",
  "What's new for the day?",
  "Ready to explore campus?",
];

const PalIntroPage = ({}) => {
  const [textIndex, setTextIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [recording, setRecording] = useState(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);

  // Request permissions on component mount
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    // Request audio recording permissions
    const audioPermission = await Audio.requestPermissionsAsync();
    
    // Request image picker permissions
    const imagePermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!audioPermission.granted) {
      Alert.alert('Permission needed', 'Audio recording permission is required for voice features');
    }
    
    if (!imagePermission.granted || !cameraPermission.granted) {
      Alert.alert('Permission needed', 'Camera and media library permissions are required for image search');
    }
  };

  useFocusEffect(useCallback(() => {
    const parent = navigation?.getParent();
    const grandParent = parent?.getParent();

    if (grandParent) {
      grandParent.setOptions({
        headerTitle: '',
        headerTitleStyle: {},
        headerRight: () => (
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="notifications-outline" size={24} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="person-circle-outline" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        ),
      });
    }

    return () => {
      if (grandParent) {
        grandParent.setOptions({
          headerTitle: 'Updates',
          headerTitleStyle: { padding: 10 },
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                style={styles.headerButton}
              >
                <Ionicons name="search-outline" size={24} color="#374151" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="notifications-outline" size={24} color="#374151" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="person-circle-outline" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
          ),
        });
      }
    };
  }, [navigation]));

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => pulseAnimation());
  };

  useEffect(() => {
    fadeIn();
    pulseAnimation();

    const interval = setInterval(() => {
      setTextIndex((prev) => {
        const nextIndex = (prev + 1) % introText.length;
        fadeIn();
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Show "Coming Soon" alert for disabled features
  const showComingSoonAlert = (featureName) => {
    Alert.alert(
      'Coming Soon!',
      `${featureName} feature is currently under development and will be available in a future update.`,
      [{ text: 'OK' }]
    );
  };

  const handleVoicePress = () => {
    showComingSoonAlert('Voice Chat');
  };

  const handleImageSearch = () => {
    showComingSoonAlert('Image Search');
  };

  const handleOptionPress = (option) => {
    // Navigate to chat with pre-filled query and send immediately
    navigation.navigate("PalChatPage", { 
      initialQuery: option.question,
      category: option.text,
      autoSend: true // Flag to indicate the message should be sent automatically
    });
  };

  return (
    <LinearGradient
      colors={[
        "rgba(0, 191, 99, 0.05)",
        "rgba(0, 191, 99, 0.08)",
        "rgba(0, 191, 99, 0.15)",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Welcome Section */}
          <View style={styles.textContent}>
            <Text style={styles.title}>Hello {user}</Text>
            <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
              {introText[textIndex]}
            </Animated.Text>
          </View>

          {/* Main Feature Cards */}
          <View style={styles.cardsContainer}>
            <View style={styles.card1}>
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card1Gradient}
              >
                <TouchableOpacity 
                  style={[styles.card1Content, styles.disabledCard]}
                  onPress={handleVoicePress}
                  activeOpacity={0.9}
                >
                  {/* Coming Soon Badge */}
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>Coming Soon</Text>
                  </View>
                  
                  <Animated.View style={[styles.lottieContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <LottieView
                      style={[styles.lottie, styles.disabledLottie]}
                      source={require("../../assets/lottie/mic.json")}
                      autoPlay
                      loop
                    />
                  </Animated.View>
                  <View style={styles.card1TextContent}>
                    <Text style={[styles.card1Text1, styles.disabledText]}>Talk with Pal</Text>
                    <Text style={[styles.card1Text2, styles.disabledText]}>Tap to start voice conversation</Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <View style={styles.cards12Container}>
              <View style={styles.card2}>
                <LinearGradient
                  colors={["#a8edea", "#fed6e3"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <TouchableOpacity
                    style={styles.card2Content}
                    onPress={() => navigation.navigate("PalChatPage")}
                    activeOpacity={0.8}
                  >
                    <View style={styles.card2IconsContainer}>
                      <Ionicons
                        name="chatbubble"
                        size={32}
                        style={styles.card2Icon}
                      />
                      <Ionicons
                        name="chatbubble-outline"
                        size={32}
                        style={styles.card2Icon2}
                      />
                    </View>
                    <Text style={styles.card2Text}>New Chat</Text>
                    <Text style={styles.card2Subtitle}>Start typing your questions</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>

              <View style={styles.card3}>
                <LinearGradient
                  colors={["#434343", "#000000"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <TouchableOpacity 
                    style={[styles.card3Content, styles.disabledCard]}
                    onPress={handleImageSearch}
                    activeOpacity={0.8}
                  >
                    {/* Coming Soon Badge */}
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>Coming Soon</Text>
                    </View>
                    
                    <Ionicons
                      name="camera-outline"
                      size={32}
                      color="rgba(255, 255, 255, 0.5)"
                      style={styles.card3Icon}
                    />
                    <Text style={[styles.card3Text, styles.disabledText]}>Search by Image</Text>
                    <Text style={[styles.card3Subtitle, styles.disabledText]}>Upload or capture photo</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.queriesContainer}>
            <Text style={styles.labelText}>Quick Actions</Text>
            <View style={styles.queriesContent}>
              {options.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.query}
                  onPress={() => handleOptionPress(item)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={item.gradient}
                    style={styles.queryIconBackground}
                  >
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color="#fff"
                    />
                  </LinearGradient>
                  <View style={styles.queryTextContainer}>
                    <Text style={styles.queryText}>{item.text}</Text>
                    <Text style={styles.queryDescription}>{item.description}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerRight: {
   marginRight: 20,
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
  },
  textContent: {
    padding: 24,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    marginVertical: 8,
    fontWeight: '800',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '500',
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  cards12Container: {
    flex: 1,
    gap: 12,
  },
  card1: {
    height: 320,
    flex: 1.2,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  card1Gradient: {
    flex: 1,
    borderRadius: 20,
  },
  card1Content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    position: 'relative',
  },
  lottieContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  lottie: {
    width: 120,
    height: 120,
  },
  card1TextContent: {
    alignItems: 'center',
  },
  card1Text1: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: 'center',
  },
  card1Text2: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 18,
  },
  card2: {
    height: 152,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  card2Content: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  card2IconsContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  card2Icon: {
    color: "#7c3aed",
  },
  card2Icon2: {
    color: "#a855f7",
    position: "absolute",
    left: 8,
    top: 6,
  },
  card2Text: {
    fontSize: 18,
    color: "#374151",
    fontWeight: "600",
  },
  card2Subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  card3: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    height: 152,
  },
  card3Content: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    position: 'relative',
  },
  card3Icon: {
    alignSelf: 'flex-start',
  },
  card3Text: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  card3Subtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  queriesContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  labelText: {
    fontSize: 22,
    fontWeight: '700',
    color: "#374151",
    marginBottom: 16,
  },
  queriesContent: {
    gap: 12,
  },
  query: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    gap: 16,
  },
  queryIconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  queryTextContainer: {
    flex: 1,
  },
  queryText: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "600",
  },
  queryDescription: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  // Disabled and Coming Soon Styles
  disabledCard: {
    opacity: 0.7,
  },
  disabledLottie: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  comingSoonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default PalIntroPage;