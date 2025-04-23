import { url } from "@/plugins/baseUrl";
import { useAxios } from "@vueuse/integrations/useAxios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useFlightStore = defineStore("useFlight", () => {
  const {
    execute: executeOrigin,
    data: originData,
    isLoading: loadingOrigin,
  } = useAxios(`${url}/airports`, { immediate: true });
  
  const {
    execute: searchFlightExecute,
    data: flightList,
    isLoading: searchLoading,
  } = useAxios("", "GET" , { immediate: false });


  const {
    execute: flightSeat,
    data: seats,
    isLoading: seatLoading,
  } = useAxios("", "GET", { immediate: false });

  return {
    executeOrigin,
    originData,
    loadingOrigin,
    searchFlightExecute,
    flightList,
    searchLoading,
    flightSeat,
    seats,
    seatLoading,
  };
});
