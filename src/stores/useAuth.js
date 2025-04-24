// stores/useAuth.js
import { url } from "@/plugins/baseUrl";
import { useAxios } from "@vueuse/integrations/useAxios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("useAuth", () => {
  const { execute: executeRegister, isLoading: loadingRegister } = useAxios(
    `${url}/registers`,
    { method: "POST" },
    { immediate: false }
  );

  const { execute: executeLogin, isLoading: loadingLogin } = useAxios(
    `${url}/logins`,
    { method: "POST" },
    { immediate: false }
  );

  return {
    executeRegister,
    loadingRegister,
    executeLogin,
    loadingLogin,
  };
});
