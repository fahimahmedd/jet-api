import { url } from "@/plugins/baseUrl";
import { useAxios } from "@vueuse/integrations/useAxios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useFlightStore } from "@/stores/useFlight";

export const useBookFlight = defineStore("useBook", () => {
  const token = ref(localStorage.getItem("token"));
  const flightStore = useFlightStore();
  const bookingResponse = ref(null);

  const headers = {
    Authorization: `Bearer ${token.value}`,
    "Content-Type": "application/json"
  };

  const { execute: executeBooking, isLoading: loadingBooking } = useAxios(
    `${url}/book`,
    { method: "POST", headers },
    { immediate: false }
  );

  const confirmBooking = async () => {
    try {
      // Get all booking data
      const outboundBooking = JSON.parse(sessionStorage.getItem('outboundBookingData') || 'null');
      const returnBooking = JSON.parse(sessionStorage.getItem('returnBookingData') || 'null');
      const bookingData = JSON.parse(sessionStorage.getItem('bookingData') || 'null');
      const guestData = JSON.parse(sessionStorage.getItem('guestData'));

      if (!guestData) {
        throw new Error('No guest data found');
      }

      // Get coupon code if available
      const couponCode = flightStore.getCouponCodeForBooking();

      // Prepare payload based on trip type
      let payload;
      const isRoundTrip = outboundBooking && returnBooking;

      if (isRoundTrip) {
        payload = {
          flight_id: outboundBooking.flight_id,
          seat_ids: outboundBooking.seat_ids,
          trip_type: 'return',
          return_flight: {
            flight_id: returnBooking.flight_id,
            seat_ids: returnBooking.seat_ids
          },
          coupon: couponCode 
        };
      } else {
        if (!bookingData) {
          throw new Error('No booking data found');
        }
        payload = {
          flight_id: bookingData.flight_id,
          seat_ids: bookingData.seat_ids,
          trip_type: 'oneway',
          coupon: couponCode // Add coupon to payload
        };
      }

      console.log('Submitting booking with:', payload);

      // Submit to API
      const { data, error } = await executeBooking({ 
        data: payload
      });

      if (error.value) {
        throw error.value;
      }

      // Store the response data
      bookingResponse.value = data.value;
      // console.log('Booking confirmed:', bookingResponse.value);

      // Clear storage after successful booking including coupon
      flightStore.clearFlightData();
      flightStore.clearCoupon(); // Clear the coupon after successful booking
      sessionStorage.removeItem('bookingData');
      sessionStorage.removeItem('outboundBookingData');
      sessionStorage.removeItem('returnBookingData');
      sessionStorage.removeItem('guestData');
      sessionStorage.removeItem('guestInfo');
      sessionStorage.removeItem('coupon');

      return bookingResponse.value;

    } catch (error) {
      console.error('Booking failed:', error);
      throw error;
    }
  };

  return {
    loadingBooking,
    confirmBooking,
    bookingResponse
  };
});