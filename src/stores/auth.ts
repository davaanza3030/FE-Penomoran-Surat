import { defineStore } from "pinia";
import { ref, computed } from "vue";
import router from "../router";
import { apiService } from "../utility/apiService";
import handleError from "../utility/errorHandler";
import Cookies from "js-cookie"; // Import js-cookie

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(
    Cookies.get("user") ? JSON.parse(Cookies.get("user") as string) : null
  );
  const token = ref<string>(Cookies.get("token") || "");
  const isLoggingIn = ref(false);

  const setToken = (newToken: string) => {
    token.value = newToken;
    Cookies.set("token", newToken, { expires: 1 }); // Set token in cookies with 1-day expiry
  };

  const setUser = (newUser: User) => {
    user.value = newUser;
    Cookies.set("user", JSON.stringify(newUser), { expires: 1 }); // Set user in cookies with 1-day expiry
  };

  const clearToken = () => {
    token.value = "";
    Cookies.remove("token"); // Remove token from cookies
    Cookies.remove("user"); // Remove user from cookies
  };

  const login = async (credentials: { email: string; password: string }) => {
    isLoggingIn.value = true;
    try {
      const response = await apiService.apiPost("/auth/login", credentials);
      if (response.data.access_token && response.data.user) {
        setToken(response.data.access_token);
        setUser(response.data.user);
        router.push({ name: "home" });
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      handleError(error);
      throw new Error("Login failed");
    } finally {
      isLoggingIn.value = false;
    }
  };

  const logout = async () => {
    try {
      await apiService.apiPost("/auth/logout", {});
      clearToken();
      user.value = null;
      router.push({ name: "Login" });
    } catch (error) {
      handleError(error);
      throw new Error("Logout failed");
    }
  };

  const isAuthenticated = computed(() => !!token.value);

  return { user, token, login, logout, isAuthenticated, clearToken,isLoggingIn };
});
