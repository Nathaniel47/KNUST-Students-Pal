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
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useTabBarVisibility } from "../utility/TabBarVisibilityContext";
import BottomSheet from "@gorhom/bottom-sheet";
import axios from "axios";
import { BASE_URL } from "../utility/config";


const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const PalChatPage = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enableNewChat, setEnableNewChat] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [goLiveModal, setGoLiveModal] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const scrollViewRef = useRef(null);
  const FABAnim = useRef(new Animated.Value(0)).current;
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(false);
  const responseTimeoutRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0.1)).current;
  const bottomSheetRef = useRef(null);
  const { setTabBarVisible } = useTabBarVisibility();

  const snapPoints = useMemo(() => ["20%", "25%"]);

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
    setMessages([]);
    setEnableNewChat(false);
    setEditingMsgId(null);
    setScrollIndicatorVisible(false);
    FABAnim.setValue(50);
  };

  const handleStopResponse = useCallback(() => {
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current); // Clear the pending timeout
      responseTimeoutRef.current = null; // Reset the ref
    }
    setLoading(false); // Stop loading animation
    // Remove the "loading" message if it's still present
    setMessages((prev) => prev.filter((msg) => msg.id !== "loading"));
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

    // Add user message and loading message
    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setMessage("");
    setEnableNewChat(true);
    setLoading(true);

    //pal's response

    try{
     const  palResponse = await axios.post(`${BASE_URL}/chatbot/`,{message:message});
     console.log("Pal response: ", palResponse.data);
     if(palResponse.data && palResponse.data.response){
      const responseText = palResponse.data.response;
          // --- MODIFIED PART ---
    responseTimeoutRef.current = 

      setMessages((prev) => {
        // Filter out ONLY the loading message, then add the new message
        return [
          ...prev.filter((m) => m.id !== "loading"),
          {
            id: (Date.now() + 1).toString(),
            text: responseText,
            type: "received",
          },
        ];
      });
      setLoading(false);
      responseTimeoutRef.current = null; // Clear the ref after timeout completes
  
  }
    // --- END MODIFIED PART ---

    }catch(error){
       console.log("Error sending message to Pal: ", error);
    }



  };

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      const grandParent = parent?.getParent();

      grandParent?.setOptions({
        headerTitle: "Pal",
        headerTitleStyle: {padding:10},
        headerRight: () => (
          <View style={[styles.headerRight, {
            flexDirection:'row',
            gap:10,
            marginRight:10,
            alignItems:'center'
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
          headerTitleStyle:{},
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
      };
    }, [enableNewChat, navigation, handleClear])
  );

  const renderItem = ({ item: msg }) => (
    <View style={styles.messageContainer}>
      <View
        style={[
          styles.messageBubble,
          msg.type === "sent" ? styles.sentMessage : styles.receivedMessage,
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
          <Text style={styles.messageText}>{msg.text}</Text>
        )}
      </View>

      {msg.type === "received" ? (
        <View style={styles.editIcons}>
          <TouchableOpacity>
            <Ionicons name="reload-outline" size={18} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="copy-outline" size={18} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={18} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="volume-high-outline" size={18} />
          </TouchableOpacity>
        </View>
      ) : editingMsgId === msg.id ? (
        <View style={styles.mEditIcons}>
          <TouchableOpacity>
            <Ionicons name="pencil" size={18} />
          </TouchableOpacity>
          <TouchableOpacity>
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
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({
                animated: true,
              })
            }
            onScroll={({ nativeEvent }) => {
              const { layoutMeasurement, contentOffset, contentSize } =
                nativeEvent;
              const isAtBottom =
                layoutMeasurement.height + contentOffset.y >=
                contentSize.height - 20;

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
                <Text style={styles.subtitle}>Pal is ready...</Text>
              </View>
            }
            renderItem={renderItem}
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
            placeholder="Message Pal...."
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
  scrollContent: { padding: 20 },
  introBox: { alignSelf: "center" },
  title: { fontSize: 30, fontWeight: "bold" },
  subtitle: { fontSize: 15, textAlign: "center" },
  messageContainer: { marginVertical: 5 },
  messageBubble: { padding: 10, borderRadius: 10, maxWidth: "100%" },
  sentMessage: { backgroundColor: "#dcf8c6", alignSelf: "flex-end" },
  receivedMessage: { paddingBottom: 10 },
  messageText: { fontSize: 16 },
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
  // headerRight: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   gap: 20,
  //   padding: 10,
  //   alignItems: "center",
  //   margin: 10,
  // },
  modalContainer: { backgroundColor: "#f0f0f0", flex: 1 },
  modalClose: { padding: 20 },
  modalTitle: { padding: 20, fontSize: 16 },
  modalContent: { flex: 1 },
});

export default PalChatPage;
