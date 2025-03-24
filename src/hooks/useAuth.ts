import { ENV } from "@/lib/env";
import { useState, useEffect } from "react";

// Helper function to get the auth_token cookie
const getAuthToken = (): string | null => {
  const name = "auth_token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    setLoading(true);
    document.cookie = `auth_token=; path=/; domain=${ENV.auth_domain}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    localStorage.removeItem("uid");
    setLoading(false);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loading, logout };
};
