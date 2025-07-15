import { useContext, createContext, useCallback } from "react";
import { Pressable, TextInput, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DrawerHeaderContext = createContext(null);

const DrawerHeaderContextProvider = ({ children }) => {
  const updateRightHeader = useCallback((navigation) => {
    return (
      <View
        style={{
          marginRight: 20,
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Search");
          }}
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 20,
            alignSelf: "center",
            width: 230,
            marginTop: 2,
            backgroundColor: "#fff",
            paddingVertical: 10,
            height: 40,
          }}
        >
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
    );
  }, []);

  return (
    <DrawerHeaderContext.Provider value={{ updateRightHeader }}>
      {children}
    </DrawerHeaderContext.Provider>
  );
};

const useDrawerHeaderContext = () => {
  const context = useContext(DrawerHeaderContext);
  if (!context) {
    throw Error(
      "useDrawerHeaderContext must be used within a DrawerHeaderContextProvider"
    );
  }

  return context;
};

export { useDrawerHeaderContext, DrawerHeaderContextProvider };
