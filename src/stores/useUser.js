import { url } from "@/plugins/baseUrl";
import { useAxios } from "@vueuse/integrations/useAxios";
import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

export const useUserStore = defineStore("useUser", () => {
  const token = ref(localStorage.getItem("token"));

  // Load user from localStorage if exists
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"));
  const loadingUser = ref(false);
  const loadingLogout = ref(false);

  // Set up headers
  const headers = {
    Authorization: `Bearer ${token.value}`,
  };

  // useAxios for user profile
  const {
    execute: executeUser,
    isLoading,
    response,
  } = useAxios(`${url}/profile`, {
    method: "GET",
    headers,
  }, {
    immediate: false,
  });

  loadingUser.value = isLoading;

  // Watch for user API response
  watchEffect(() => {
    if (response.value && token.value) {
      user.value = response.value.data;
      localStorage.setItem("user", JSON.stringify(response.value.data));
    }
  });

  // Initial fetch if token exists
  if (token.value) {
    executeUser();
  }

  // Logout function
  const logoutUser = async () => {
    if (!token) return;

    loadingLogout.value = true;

    try {
      await useAxios(
        `${url}/logouts`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
        { immediate: false }
      ).execute();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      user.value = null;
      loadingLogout.value = false;

      window.location.reload();
    }
  };

  const setTokenAndFetchUser = (newToken) => {
    localStorage.setItem("token", newToken);

    headers.Authorization = `Bearer ${newToken}`;

    executeUser().then(() => {
      if (response.value) {
        user.value = response.value.data;
        localStorage.setItem("user", JSON.stringify(response.value.data));
      }
    });
  };
  

  return {
    user,
    executeUser,
    loadingUser,
    logoutUser,
    loadingLogout,
    setTokenAndFetchUser, // 👈 expose this
  };
});
