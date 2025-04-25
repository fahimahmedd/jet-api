import { url } from "@/plugins/baseUrl";
import { useAxios } from "@vueuse/integrations/useAxios";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useFlightStore = defineStore("useFlight", () => {
  // Original API calls
  const {
    execute: executeOrigin,
    data: originData,
    isLoading: loadingOrigin,
  } = useAxios(`${url}/airports`, { immediate: true });
  
  const {
    execute: flightSeat,
    data: seats,
    isLoading: seatLoading,
  } = useAxios("", "GET", { immediate: false });

  // Flight search related state
  const flightList = ref(JSON.parse(sessionStorage.getItem('flightData')) || null);
  const searchParams = ref(JSON.parse(sessionStorage.getItem('searchParams')) || null);
  const searchLoading = ref(false);

  // Enhanced search function
  const searchFlightExecute = async (url, originCode, destinationCode, totalGuests) => {
    searchLoading.value = true;
    try {
      const { data } = await useAxios(url, { immediate: true });
      flightList.value = data.value;
      searchLoading.value = false;
      
      const params = {
        origin_id: new URL(url).searchParams.get('origin_id'),
        origin_code: originCode,
        destination_id: new URL(url).searchParams.get('destination_id'),
        destination_code: destinationCode,
        trip: new URL(url).searchParams.get('trip') || 'oneway',
        totalGuests: totalGuests  // Add total guests count
      };
      
      sessionStorage.setItem('flightData', JSON.stringify(data.value));
      sessionStorage.setItem('searchParams', JSON.stringify(params));
      searchParams.value = params;
      
      return data.value;
    } catch (error) {
      searchLoading.value = false;
      throw error;
    }
  };
  // Clear flight data
  const clearFlightData = () => {
    flightList.value = null;
    searchParams.value = null;
    sessionStorage.removeItem('flightData');
    sessionStorage.removeItem('searchParams');
  };

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
    searchParams,
    clearFlightData
  };
});