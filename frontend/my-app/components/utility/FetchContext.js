import { createContext, useContext } from "react";
import axios from "axios";
import { BASE_URL } from "./config";
import { View } from "react-native";
import { v4 as uuidv4 } from "uuid";

const FetchContext = createContext();

const FetchUpdatesProvider = ({ children }) => {
  const generateID = (updates) => {
    updates.forEach((update) => {
      update.id = uuidv4();
    });
  };
  const fetchUpdates = async (type = "all") => {
    try {
      let updates = null;
      let response = null;

      if (type === "all") {
        updates = await axios.get(`${BASE_URL}/updates/${type}`);
        response = updates.data;
        generateID(response);
        console.log(response);
        return { error: false, data: response };
      } else if (type === "news") {
        updates = await axios.get(`${BASE_URL}/updates/${type}`);
        response = updates.data;
        generateID(response);
        return { error: false, data: response };
      } else if (type === "announcements") {
        updates = await axios.get(`${BASE_URL}/updates/${type}`);
        response = updates.data;
        generateID(response);
        return { error: false, data: response };
      } else {
        throw Error(`no such update type exist ${type}`);
      }
    } catch (err) {
      console.log("there was an error", err);
      return { error: true, data: "", message: err.message };
    }
  };

  return (
    <FetchContext.Provider value={{ fetchUpdates }}>
      {children}
    </FetchContext.Provider>
  );
};

export const useFetchContext = () => useContext(FetchContext);

export default FetchUpdatesProvider;
