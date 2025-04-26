import { url } from "@/plugins/baseUrl";
import { useAxios } from "@vueuse/integrations/useAxios";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useBookFlight = defineStore("useBook", () => {
    const token = ref(localStorage.getItem("token"));

    const headers = {
        Authorization: `Bearer ${token.value}`,
      };

    const { execute: executeBooking, isLoading: loadingBooking } = useAxios(
        `${url}/book`,
        { method: "POST" ,  headers},
        { immediate: false }
      );

  return {
    executeBooking,
    loadingBooking,
  };
});