import { useState, createContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { BASE_URL } from "./config";
import { v4 as uuidv4 } from "uuid";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const saveTokens = async ({ access_token, refresh_token }) => {
    await AsyncStorage.setItem("access_token", access_token);
    await AsyncStorage.setItem("refresh_token", refresh_token);
  };

  const getUserName = (accessToken) => {
    try {
      const decoded = jwtDecode(accessToken);
      console.log("Decoded JWT:", decoded);
      setUser(decoded.username);
    } catch (err) {
      console.error("JWT Decode Error:", err);
    }
  };

  const login = async ({ mail, password }) => {
    const data = { success: false, error: "" };
    const trimmedMail = mail.trim();
    setIsLoading(true);

    try {
      console.log(`POST → ${BASE_URL}/auth/login`);

      const response = await axios.post(`${BASE_URL}/auth/login`, {
        mail: trimmedMail,
        password: password,
      });

      const tokens = response.data;
      await saveTokens(tokens);
      getUserName(tokens.access_token);
      data.success = true;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      data.error = error.response?.data?.detail || "Something went wrong";
    } finally {
      setIsLoading(false);
    }
    return data;
  };

  const signup = async ({ mail, password, id, username }) => {
    const data = { success: false, error: "" };
    const mailFormat = /^\w+@(st|idl)\.knust\.edu\.gh$/;
    const trimmedMail = mail.trim();
    let checkMail = mailFormat.test(trimmedMail);
    setIsLoading(true);

    try {
      if (checkMail) {
        try {
          const response = await axios.post(
            `${BASE_URL}/auth/register`,
            {
              username: username,
              mail: trimmedMail,
              id: id,
              password: password,
            }
          );

          const tokens = response.data;
          await saveTokens(tokens);
          getUserName(tokens.access_token);
          data.success = true;
        } catch (error) {
          console.error("Signup error:", error.response?.data || error.message);
          data.error =
            error.response?.data?.error || "Something went wrong. Try again";
        }
      } else {
        throw new Error(
          "Invalid Email. Kindly add the appropriate suffix @st.knust.edu.gh or @idl.knust.edu.gh"
        );
      }
    } catch (err) {
      data.error = err.message;
    } finally {
      setIsLoading(false);
    }
    return data;
  };

  const guestSignup = async ({ mail, password }) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    setIsLoading(true);

    if (!emailRegex.test(mail)) {
      setIsLoading(false);
      return { success: false, error: "Invalid email format" };
    }
    if (password.length < 6) {
      setIsLoading(false);
      return { success: false, error: "Password must be at least 6 characters long" };
    }

    const userName = mail.split("@")[0];
    const id = uuidv4();

    try {
      console.log(`POST → ${BASE_URL}/auth/register`);  
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        username: userName,
        mail: mail,
        id: id,
        password: password,
      });
      const tokens = response.data; 
      await saveTokens(tokens);
      getUserName(tokens.access_token);
      return { success: true };
    } catch (err) {
      console.error("Guest Signup error:", err.response?.data || err.message);
      return { success: false, error: err.response?.data?.detail || "Something went wrong" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
      setUser(null);
      return { success: true, error: "" };
    } catch (err) {
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const getNewTokens = async (refreshToken) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/refresh/token`,
        {
          refresh_token: refreshToken,
        }
      );

      const tokens = response.data;
      await saveTokens(tokens);
      getUserName(tokens.access_token);
      return true;
    } catch (err) {
      console.error("Token refresh failed:", err);
      return false;
    }
  };

  const loadUser = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");
      
      if (!accessToken || !refreshToken) {
        return false;
      }

      // Check if access token is valid
      try {
        const decoded = jwtDecode(accessToken);
        const isTokenExpired = decoded.exp * 1000 < Date.now();
        
        if (!isTokenExpired) {
          // Token is still valid, set user
          setUser(decoded.username);
          return true;
        } else {
          // Token expired, try to refresh
          return await getNewTokens(refreshToken);
        }
      } catch (err) {
        // Invalid access token, try to refresh
        return await getNewTokens(refreshToken);
      }
    } catch (err) {
      console.error("Load user failed:", err);
      return false;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      if (!accessToken || !refreshToken) return;

      const decoded = jwtDecode(accessToken);
      const isTokenExpired = decoded.exp * 1000 < Date.now();

      if (isTokenExpired) {
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {
            refresh_token: refreshToken,
          }
        );

        const tokens = response.data;
        await saveTokens(tokens);
        getUserName(tokens.access_token);
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
    }
  };

  const guestLogin = async ({mail, password}) => { 
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    setIsLoading(true);

    if (!emailRegex.test(mail)) {
      setIsLoading(false);
      return { success: false, error: "Invalid email format" };
    }

    try {
      console.log(`POST → ${BASE_URL}/auth/login`);

      const response = await axios.post(`${BASE_URL}/auth/login`, {
        mail: mail,
        password: password,
      });
      const tokens = response.data;
      await saveTokens(tokens);
      getUserName(tokens.access_token);
      return { success: true };
    } catch(err) {
      console.error("Guest Login error:", err.response?.data || err.message);
      return { success: false, error: err.response?.data?.detail || "Something went wrong" };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        login, 
        signup, 
        loadUser, 
        refreshAccessToken, 
        logout, 
        user, 
        guestLogin, 
        guestSignup,
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };