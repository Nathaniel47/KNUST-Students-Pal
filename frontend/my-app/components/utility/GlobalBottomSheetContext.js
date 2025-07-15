import React, { createContext, useContext, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { View } from "react-native";

const GlobalBottomSheetContext = createContext();

export const useGlobalBottomSheet = () => useContext(GlobalBottomSheetContext);

export const GlobalBottomSheetProvider = ({ children }) => {
  const bottomSheetRef = useRef(null);
  const [content, setContent] = useState("");
  const [snapPoints, setSnapPoints] = useState(["25%", "50%", "97%"]);

  const open = ({ content = null, snapPoints }) => {
    setSnapPoints(snapPoints ? snapPoints : ["25%", "50%", "97%"]); //sets the snap points
    console.log(snapPoints);
    setContent(content); // this sets the JSX component
    bottomSheetRef.current?.expand();
  };

  const close = () => {
    setSnapPoints(["25%", "50%", "97%"]); // sets the snap points back to default
    setContent(null); //sets the content back to null
    bottomSheetRef.current?.close(); // closes the bottomsheet
  };

  return (
    <GlobalBottomSheetContext.Provider value={{ open, close }}>
      <View style={{ flex: 1 }}>{children}</View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
      >
        {content}
      </BottomSheet>
    </GlobalBottomSheetContext.Provider>
  );
};
