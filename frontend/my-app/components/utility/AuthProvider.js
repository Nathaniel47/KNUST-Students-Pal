import { useState, createContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { BASE_URL } from "./config";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
    }
    return data;
  };

  const signup = async ({ mail, password, id, username }) => {
    const data = { success: false, error: "" };
    const mailFormat = /^\w+@(st|idl)\.knust\.edu\.gh$/;

    const trimmedMail = mail.trim();
    let checkMail = mailFormat.test(trimmedMail);
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
    }
    return data;
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
      setUser(null);
      return { success: true, error: "" };
    } catch (err) {
      return { success: false, error: err };
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
      return false;
    }
  };

  const loadUser = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refresh_token");
      if (!refreshToken) return false;

      return await getNewTokens(refreshToken);
    } catch {
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

  return (
    <AuthContext.Provider
      value={{ login, signup, loadUser, refreshAccessToken, logout, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
