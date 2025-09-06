import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  Modal,
  Pressable,
  TouchableHighlight,
  Animated,
  Alert,
  Share,
} from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useTabBarVisibility } from "../utility/TabBarVisibilityContext";
import BottomSheet from "@gorhom/bottom-sheet";
import axios from "axios";
import { BASE_URL } from "../utility/config";
import * as Clipboard from 'expo-clipboard'; 
import * as Speech from 'expo-speech';
import { useToast } from "../utility/ToastContext";
import { useContext } from "react";
import { AuthContext } from "../utility/AuthProvider";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const PalChatPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enableNewChat, setEnableNewChat] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [goLiveModal, setGoLiveModal] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const scrollViewRef = useRef(null);
  const FABAnim = useRef(new Animated.Value(0)).current;
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(false);
  const responseTimeoutRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0.1)).current;
  const bottomSheetRef = useRef(null);
  const { setTabBarVisible } = useTabBarVisibility();
  const hasAutoSentRef = useRef(false); 
  const {showToast} = useToast();
  const {user} = useContext(AuthContext);
  const {userName,setUserName} = useState('');

  const snapPoints = useMemo(() => ["20%", "25%"]);

  // Check speech availability on component mount
  useEffect(() => {


    const checkSpeechAvailability = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        console.log('Available voices:', voices.length);
        if (voices.length === 0) {
          console.warn('No speech voices available');
        }
      } catch (error) {
        console.log('Speech not available:', error);
      }
    };

    checkSpeechAvailability();
  }, []);

  // Handle auto-send when navigating from quick actions
  useEffect(() => {
    const { initialQuery, category, autoSend } = route.params || {};
    
    if (initialQuery && autoSend && !hasAutoSentRef.current) {
      setMessage(initialQuery);
      
      setTimeout(() => {
        handleAutoSend(initialQuery, category);
        hasAutoSentRef.current = true;
      }, 300);
    }
  }, [route.params]);

  // Reset the auto-sent flag when component unmounts or new chat starts
  useEffect(() => {
    return () => {
      hasAutoSentRef.current = false;
      Speech.stop();
    };
  }, []);

  const handleAutoSend = async (queryText, category) => {
    if (!queryText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      text: queryText.trim(),
      type: "sent",
      category: category || null,
    };

    const loadingMsg = {
      id: "loading",
      text: "wait a sec...",
      type: "loading",
    };

    // Add messages in chronological order (newest at end)
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setMessage("");
    setEnableNewChat(true);
    setLoading(true);

    // Scroll to bottom to show newest messages
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const palResponse = await axios.post(`${BASE_URL}/chatbot/`, {
        message: queryText,
        category: category,
      });
      
      console.log("Pal response: ", palResponse.data);
      
      if (palResponse.data && palResponse.data.response) {
        const responseText = palResponse.data.response;
        
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== "loading"),
          {
            id: (Date.now() + 1).toString(),
            text: responseText,
            type: "received",
            originalPrompt: queryText,
          }
        ]);
        setLoading(false);

        // Scroll to bottom after response
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.log("Error sending message to Pal: ", error);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "loading"),
        {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I'm having trouble connecting right now. Please try again.",
          type: "received",
          isError: true,
        }
      ]);
      setLoading(false);
    }
  };

  // Function to regenerate response
  const handleRegenerateResponse = async (messageId) => {
    const messageToRegenerate = messages.find(msg => msg.id === messageId);
    if (!messageToRegenerate || !messageToRegenerate.originalPrompt) {
      Alert.alert("Error", "Cannot regenerate this response");
      return;
    }

    const loadingMsg = {
      id: "loading-regen",
      text: "Wait a sec...",
      type: "loading",
    };

    setMessages((prev) => 
      prev.map(msg => msg.id === messageId ? loadingMsg : msg)
    );
    setLoading(true);

    try {
      const palResponse = await axios.post(`${BASE_URL}/chatbot/`, {
        message: messageToRegenerate.originalPrompt,
        category: messageToRegenerate.category,
      });
      
      if (palResponse.data && palResponse.data.response) {
        const responseText = palResponse.data.response;
        
        setMessages((prev) => 
          prev.map(msg => 
            msg.id === "loading-regen" ? {
              id: messageId,
              text: responseText,
              type: "received",
              originalPrompt: messageToRegenerate.originalPrompt,
              category: messageToRegenerate.category,
            } : msg
          )
        );
        setLoading(false);
      }
    } catch (error) {
      console.log("Error regenerating response: ", error);
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === "loading-regen" ? {
            id: messageId,
            text: "Sorry, I'm having trouble regenerating the response. Please try again.",
            type: "received",
            isError: true,
            originalPrompt: messageToRegenerate.originalPrompt,
          } : msg
        )
      );
      setLoading(false);
    }
  };

  // Function to copy response to clipboard
  const handleCopyResponse = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
      showToast('Response copied successfully', 3000, '#333');
    } catch (error) {
      console.log("Error copying to clipboard: ", error);
      Alert.alert("Error", "Failed to copy to clipboard");
    }
  };

  // Function to share response
  const handleShareResponse = async (text) => {
    try {
      const result = await Share.share({
        message: text,
        title: "Pal Response",
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type: ", result.activityType);
        } else {
          console.log("Response shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.log("Error sharing response: ", error);
      Alert.alert("Error", "Failed to share response");
    }
  };

  // Enhanced speech function with better error handling
  const handleSpeakResponse = async (text, messageId) => {
    try {
      if (speakingMessageId === messageId) {
        await Speech.stop();
        setSpeakingMessageId(null);
        return;
      }

      await Speech.stop();
      setSpeakingMessageId(messageId);

      const speakOptions = {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
        onDone: () => {
          console.log('Speech finished');
          setSpeakingMessageId(null);
        },
        onStopped: () => {
          console.log('Speech stopped');
          setSpeakingMessageId(null);
        },
        onError: (error) => {
          console.log("Speech error: ", error);
          setSpeakingMessageId(null);
          Alert.alert("Error", "Failed to read response aloud");
        },
      };

      setTimeout(() => {
        Speech.speak(text, speakOptions);
      }, 100);

    } catch (error) {
      console.log("Speech initialization error: ", error);
      setSpeakingMessageId(null);
      Alert.alert("Error", "Speech feature is not available");
    }
  };

  const handleOpenSheet = () => {
    bottomSheetRef.current.expand();
  };

  const handleCloseSheet = () => {
    bottomSheetRef.current.close();
  };

  const moveUp = () => {
    Animated.timing(FABAnim, {
      toValue: -10,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const moveDown = () => {
    Animated.timing(FABAnim, {
      toValue: 50,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fade = (animatedValue) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleGoLive = () => {
    setGoLiveModal(true);
  };

  const handleClear = () => {
    if (loading) {
      handleStopResponse();
    }
    Speech.stop();
    setSpeakingMessageId(null);
    setMessages([]);
    setEnableNewChat(false);
    setEditingMsgId(null);
    setScrollIndicatorVisible(false);
    FABAnim.setValue(50);
    hasAutoSentRef.current = false;
  };

  const handleStopResponse = useCallback(() => {
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }
    setLoading(false);
    setMessages((prev) => prev.filter((msg) => msg.id !== "loading" && msg.id !== "loading-regen"));
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    Keyboard.dismiss();

    const userMsg = {
      id: Date.now().toString(),
      text: message.trim(),
      type: "sent",
    };

    const loadingMsg = {
      id: "loading",
      text: "wait a sec...",
      type: "loading",
    };

    // Add messages in chronological order (newest at end)
    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    const currentMessage = message;
    setMessage("");
    setEnableNewChat(true);
    setLoading(true);

    // Scroll to bottom to show new messages
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const palResponse = await axios.post(`${BASE_URL}/chatbot/`, {
        message: currentMessage
      });
      
      console.log("Pal response: ", palResponse.data);
      
      if (palResponse.data && palResponse.data.response) {
        const responseText = palResponse.data.response;
        
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== "loading"),
          {
            id: (Date.now() + 1).toString(),
            text: responseText,
            type: "received",
            originalPrompt: currentMessage,
          }
        ]);
        setLoading(false);

        // Scroll to bottom after response is added
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.log("Error sending message to Pal: ", error);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "loading"),
        {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I'm having trouble connecting right now. Please try again.",
          type: "received",
          isError: true,
        }
      ]);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      const grandParent = parent?.getParent();

      grandParent?.setOptions({
        headerTitle: "Pal",
        headerTitleStyle: { padding: 10 },
        headerRight: () => (
          <View style={[styles.headerRight, {
            flexDirection: 'row',
            gap: 10,
            marginRight: 10,
            alignItems: 'center'
          }]}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="chatbox-outline" size={24} />
            </TouchableOpacity>
            <TouchableOpacity disabled={!enableNewChat} onPress={handleClear}>
              <Ionicons
                name="create-outline"
                size={26}
                color={enableNewChat ? "#000" : "#999"}
              />
            </TouchableOpacity>
          </View>
        ),
      });

      setTabBarVisible(false);

      return () => {
        grandParent?.setOptions({
          headerTitle: "",
          headerTitleStyle: {},
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
        });
        setTabBarVisible(true);

        if (responseTimeoutRef.current) {
          clearTimeout(responseTimeoutRef.current);
          responseTimeoutRef.current = null;
        }
        
        Speech.stop();
        setSpeakingMessageId(null);
      };
    }, [enableNewChat, navigation, handleClear])
  );

  const renderItem = ({ item: msg }) => (
    <View style={styles.messageContainer}>
      <View
        style={[
          styles.messageBubble,
          msg.type === "sent" ? styles.sentMessage : styles.receivedMessage,
          msg.isError ? styles.errorMessage : null,
        ]}
      >
        {msg.type === "loading" ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#555" />
            <Text style={styles.messageText}> {msg.text}</Text>
          </View>
        ) : msg.type === "sent" ? (
          <TouchableHighlight
            underlayColor="gray"
            onPress={() =>
              setEditingMsgId(editingMsgId === msg.id ? null : msg.id)
            }
          >
            <Text style={styles.messageText}>{msg.text}</Text>
          </TouchableHighlight>
        ) : (
          <Text style={[styles.messageText, msg.isError ? styles.errorText : null]}>
            {msg.text}
          </Text>
        )}
      </View>

      {msg.type === "received" && !msg.isError ? (
        <View style={styles.editIcons}>
          <TouchableOpacity 
            onPress={() => handleRegenerateResponse(msg.id)}
            disabled={loading}
            style={[styles.iconButton, loading && styles.disabledIcon]}
          >
            <Ionicons 
              name="reload-outline" 
              size={18} 
              color={loading ? "#ccc" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleCopyResponse(msg.text)}
            style={styles.iconButton}
          >
            <Ionicons name="copy-outline" size={18} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleShareResponse(msg.text)}
            style={styles.iconButton}
          >
            <Ionicons name="share-outline" size={18} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleSpeakResponse(msg.text, msg.id)}
            style={[
              styles.iconButton, 
              speakingMessageId === msg.id && styles.speakingButton
            ]}
            disabled={loading}
          >
            <Ionicons 
              name={speakingMessageId === msg.id ? "stop" : "volume-high-outline"} 
              size={18} 
              color={speakingMessageId === msg.id ? "#ff6b6b" : (loading ? "#ccc" : "#000")}
            />
          </TouchableOpacity>
        </View>
      ) : editingMsgId === msg.id ? (
        <View style={styles.mEditIcons}>
          <TouchableOpacity>
            <Ionicons name="pencil" size={18} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCopyResponse(msg.text)}>
            <Ionicons name="copy-outline" size={18} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex1}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <LinearGradient
        colors={[
          "rgba(0,191,99,0.08)",
          "rgba(0,191,99,0.1)",
          "rgba(0,191,99,0.2)",
        ]}
        style={styles.flex1}
      >
        <View style={styles.container}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              // Auto scroll to bottom when content size changes (new message added)
              if (messages.length > 0) {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 50);
              }
            }}
            onLayout={() => {
              // Auto scroll to bottom on layout changes
              if (messages.length > 0) {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: false });
                }, 50);
              }
            }}
            onScroll={({ nativeEvent }) => {
              const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
              
              // Check if user is at the bottom of the list
              const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;

              if (isAtBottom) {
                moveDown();
                setScrollIndicatorVisible(false);
              } else {
                moveUp();
                setScrollIndicatorVisible(true);
              }
            }}
            scrollEventThrottle={16}
            ListEmptyComponent={
              <View style={styles.introBox}>
                <Text style={styles.title}>Ask Anything</Text>
                <Text style={styles.subtitle}>Pal is ready {user ? user.split(' ')[1] : 'Gee'}</Text>
              </View>
            }
            renderItem={renderItem}
            removeClippedSubviews={false}
          />

          {scrollIndicatorVisible && (
            <AnimatedTouchableOpacity
              style={[
                styles.floatingIcon,
                { transform: [{ translateY: FABAnim }] },
              ]}
              onPress={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            >
              <Ionicons name="chevron-down" size={24} />
            </AnimatedTouchableOpacity>
          )}
        </View>

        <View style={styles.bottomTab}>
          <TextInput
            placeholder={`What is on your mind ${user ? user.split(' ')[1] : 'Gee'}?`}
            style={styles.input}
            multiline
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={loading ? handleStopResponse : handleSend}
          />
          <View style={styles.iconBox}>
            <TouchableOpacity style={styles.addIcon}>
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={styles.rightIcons}>
              <TouchableOpacity style={styles.micIcon}>
                {!message && <Ionicons name="mic-outline" size={28} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.arrowIcon}
                onPress={
                  loading
                    ? handleStopResponse
                    : message
                    ? handleSend
                    : handleGoLive
                }
              >
                {loading ? (
                  <Ionicons name="stop" size={20} color="#fff" />
                ) : message ? (
                  <Ionicons name="send" size={20} color="#fff" />
                ) : (
                  <Ionicons name="pulse" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          onDismiss={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.modalClose}
            >
              <Ionicons name="close" size={28} />
            </Pressable>
            <Text style={styles.modalTitle}>Recent chats</Text>
            <View style={styles.modalContent}></View>
          </View>
        </Modal>

        <Modal
          visible={goLiveModal}
          animationType="fade"
          onDismiss={() => {
            setGoLiveModal(false);
          }}
          onShow={() => {
            fade(fadeAnim);
          }}
        >
          <View style={{ flex: 1 }}>
            <LinearGradient
              colors={["white", "rgba(0,191,99,0.09)", "rgba(0,191,99,0.5)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ flex: 1, justifyContent: "center" }}
            >
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  alignSelf: "flex-end",
                  padding: 20,
                }}
              >
                <TouchableHighlight onPress={handleOpenSheet}>
                  <Ionicons name="ellipsis-vertical" size={24} />
                </TouchableHighlight>
              </View>
              <View style={{ alignSelf: "center" }}>
                <Animated.Text style={[{ fontSize: 30, opacity: fadeAnim }]}>
                  Listening....
                </Animated.Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  position: "absolute",
                  bottom: 0,
                  justifyContent: "center",
                  width: "100%",
                  gap: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#000",
                    padding: 10,
                    borderRadius: 30,
                  }}
                >
                  <Ionicons name="chatbox-outline" size={35} color={"#fff"} />
                </TouchableOpacity>

                <LottieView
                  autoPlay
                  style={{ width: 200, height: 200 }}
                  source={require("../../assets/lottie/mic.json")}
                />
                <TouchableOpacity
                  onPress={() => {
                    setGoLiveModal(false);
                  }}
                  style={{
                    backgroundColor: "#000",
                    padding: 5,
                    borderRadius: 30,
                  }}
                >
                  <Ionicons name="close" size={40} color={"#fff"} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
            <BottomSheet
              index={-1}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              ref={bottomSheetRef}
            >
              <Text style={{ textAlign: "center", padding: 10, fontSize: 20 }}>
                Voice Settings
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 10,
                  margin: 5,
                }}
              >
                <Pressable
                  style={({ pressed }) => ({
                    padding: 10,
                    paddingVertical: 20,
                    borderRadius: 10,
                    borderWidth: pressed ? 2 : 1,
                    width: "45%",
                    backgroundColor: pressed ? "#f0f0f0" : "#fff",
                  })}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      paddingVertical: 5,
                    }}
                  >
                    Ara
                  </Text>
                  <Text style={{ fontSize: 16 }}>Upbeat female</Text>
                </Pressable>
                <Pressable
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    width: "45%",
                    paddingVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      paddingVertical: 10,
                      fontWeight: "bold",
                    }}
                  >
                    Rex
                  </Text>
                  <Text style={{ fontSize: 16 }}>Calm male</Text>
                </Pressable>
              </View>
            </BottomSheet>
          </View>
        </Modal>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: { flex: 1, position: "relative" },
  scrollContent: { 
    padding: 20,
    flexGrow: 1,
    justifyContent: 'flex-end'
  },
  introBox: { 
    alignSelf: "center",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: { fontSize: 30, fontWeight: "bold" },
  subtitle: { fontSize: 15, textAlign: "center" },
  messageContainer: { marginVertical: 5 },
  messageBubble: { padding: 10, borderRadius: 10, maxWidth: "100%" },
  sentMessage: { backgroundColor: "#dcf8c6", alignSelf: "flex-end" },
  receivedMessage: { paddingBottom: 10 },
  errorMessage: { backgroundColor: "#ffebee" },
  messageText: { fontSize: 16 },
  errorText: { color: "#d32f2f" },
  loadingRow: { flexDirection: "row", alignItems: "center" },
  editIcons: {
    flexDirection: "row",
    paddingHorizontal: 10,
    gap: 20,
    alignItems: "center",
  },
  mEditIcons: {
    flexDirection: "row",
    gap: 20,
    alignSelf: "flex-end",
    padding: 5,
  },
  iconButton: {
    padding: 5,
    borderRadius: 5,
  },
  disabledIcon: {
    opacity: 0.5,
  },
  speakingButton: {
    backgroundColor: '#ffebee',
    borderRadius: 5,
  },
  bottomTab: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "gray",
    marginHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  input: { maxHeight: 100 },
  iconBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addIcon: { backgroundColor: "#999", padding: 5, borderRadius: 10 },
  rightIcons: { flexDirection: "row", gap: 20, alignItems: "center" },
  arrowIcon: { backgroundColor: "#000", padding: 10, borderRadius: 20 },
  micIcon: { padding: 10 },
  floatingIcon: {
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-end",
    right: 20,
    padding: 10,
    position: "absolute",
    bottom: 0,
    borderRadius: 20,
  },
  modalContainer: { backgroundColor: "#f0f0f0", flex: 1 },
  modalClose: { padding: 20 },
  modalTitle: { padding: 20, fontSize: 16 },
  modalContent: { flex: 1 },
});

export default PalChatPage;