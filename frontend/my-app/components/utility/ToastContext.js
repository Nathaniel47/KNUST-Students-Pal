import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { Animated, Text, View, StyleSheet } from "react-native";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [backgroundColor, setBackgroundColor] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showToast = (msg = "", duration = 3000, backgroundColor) => {
    setMessage(msg);
    setBackgroundColor(backgroundColor);

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setMessage(""));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message ? (
        <Animated.View style={[styles.toast, { opacity: fadeAnim, backgroundColor: backgroundColor || '#FF3B30',  }]}>
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "#FF3B30",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
    zIndex: 1000,
    width: 250,
  },
  toastText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff",
  },
});
