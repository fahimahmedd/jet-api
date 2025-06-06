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
  const selectedOutboundFlight = ref(JSON.parse(sessionStorage.getItem('outboundFlight')) || null);
  const selectedReturnFlight = ref(JSON.parse(sessionStorage.getItem('returnFlight')) || null);

  // Enhanced search function
  const searchFlightExecute = async (url, originCode, originCity, destinationCode, totalGuests) => {
    searchLoading.value = true;
    try {
      const { data } = await useAxios(url, { immediate: true });
      flightList.value = data.value;
      searchLoading.value = false;
      
      const params = {
        origin_id: new URL(url).searchParams.get('origin_id'),
        origin_code: originCode,
        origin_city: originCity,
        destination_id: new URL(url).searchParams.get('destination_id'),
        destination_code: destinationCode,
        trip: new URL(url).searchParams.get('trip') || 'oneway',
        totalGuests: totalGuests
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
    selectedOutboundFlight.value = null;
    selectedReturnFlight.value = null;
    sessionStorage.removeItem('flightData');
    sessionStorage.removeItem('searchParams');
    sessionStorage.removeItem('outboundFlight');
    sessionStorage.removeItem('returnFlight');
  };

  // Set selected flight
  const setSelectedFlight = (flight, type = 'outbound') => {
    if (type === 'outbound') {
      selectedOutboundFlight.value = flight;
      sessionStorage.setItem('outboundFlight', JSON.stringify(flight));
    } else {
      selectedReturnFlight.value = flight;
      sessionStorage.setItem('returnFlight', JSON.stringify(flight));
    }
  };

  // Check if round trip
  const isRoundTrip = computed(() => {
    return searchParams.value?.trip === 'return';
  });

  const coupon = ref(null);
  const couponError = ref(null);
  const isCouponLoading = ref(false);
  const couponSuccess = ref(null);

  const validateCoupon = async (code) => {
    isCouponLoading.value = true;
    couponError.value = null;
    couponSuccess.value = null;
    
    try {
      const { data } = await useAxios(
        `${url}/coupons/validate`,
        {
          method: 'POST',
          data: { code }
        }
      );
      
      if (data.value.valid) {
        coupon.value = data.value.coupon;
        couponSuccess.value = `Coupon applied successfully! ${data.value.coupon.value}${data.value.coupon.type === 'fixed' ? ' SEK' : '%'} discount`;
        sessionStorage.setItem('coupon', JSON.stringify(data.value.coupon));
      } else {
        couponError.value = 'Invalid coupon code';
      }
      return data.value;
    } catch (error) {
      couponError.value = 'Please! Enter a validate coupon';
      throw error;
    } finally {
      isCouponLoading.value = false;
    }
  };

  const getCouponCodeForBooking = () => {
    return coupon.value?.code || null;
  };


  // Clear all coupon data including session storage
  const clearCoupon = () => {
    coupon.value = null;
    couponError.value = null;
    couponSuccess.value = null;
    sessionStorage.removeItem('coupon');
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
    clearFlightData,
    selectedOutboundFlight,
    selectedReturnFlight,
    setSelectedFlight,
    isRoundTrip,
    coupon,
    couponError,
    isCouponLoading,
    validateCoupon,
    clearCoupon,
    couponSuccess,
    getCouponCodeForBooking
  };
});