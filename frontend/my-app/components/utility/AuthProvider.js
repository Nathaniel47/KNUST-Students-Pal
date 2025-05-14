import { useState, createContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const saveTokens = async ({ access_token, refresh_token }) => {
    await AsyncStorage.setItem("access_token", access_token);
    await AsyncStorage.setItem("refresh_token", refresh_token);
  };

  const getUserName = (accessToken) => {
    const decode = jwtDecode(accessToken);
    setUser(decode.username);
  };

  const login = async ({ email, password }) => {
    const data = { success: false, error: "" };
    const mail = email.trim();
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/login", {
        student_mail: mail,
        password: password,
      });

      const tokens = response.data;
      await saveTokens(tokens);
      getUserName(tokens.access_token);
      data.success = true;
    } catch (error) {
      data.error = "Invalid password or email"; // Logs the entire error
    }
    return data;
  };

  const signup = async ({ email, password, id }) => {
    const data = { success: false, error: "" };
    const emailFormat = /(\b^\w*@st.knust.edu.gh\b$)/;

    const mail = email.trim();
    let checkEmail = emailFormat.test(mail);
    try {
      if (checkEmail) {
        const username = mail.split("@")[0];
        try {
          const response = await axios.post(
            "http://172.20.10.5:8000/auth/register",
            {
              student_mail: mail,
              student_id: id,
              password: password,
              username: username,
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
          "Invalid Email. Kindly add the appropraite suffic @st.knust.edu.gh or @idl.knust.edu.gh"
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
        "http://127.0.0.1:8000/auth/refresh/token",
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
          "http://127.0.0.1:8000/auth/refresh",
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
