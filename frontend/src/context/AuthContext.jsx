import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const getCurrentUser = async () => {

      try {

        const res = await axios.get(
          `${API_URL}/auth/me`,
          {
            withCredentials: true,
          }
        );
        setUser(res.data.user);

      } catch{
        setUser(null);

      } finally {

        setLoading(false);

      }

    };

    getCurrentUser();

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};