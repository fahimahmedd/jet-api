// stores/useGuest.js
import { url } from "@/plugins/baseUrl";
import { useAxios } from "@vueuse/integrations/useAxios";
import { defineStore } from "pinia";

export const useGuestStore = defineStore("useGuest", () => {
  const { execute: executeGuest, isLoading: loadingGuest, data: response } = useAxios(
    `${url}/guests`,
    { method: "POST" },
    { immediate: false }
  );

  return {
    executeGuest,
    loadingGuest,
    response
  };
});