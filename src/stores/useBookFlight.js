import { url } from "@/plugins/baseUrl";
import { useAxios } from "@vueuse/integrations/useAxios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useFlightStore } from "@/stores/useFlight";

export const useBookFlight = defineStore("useBook", () => {
  const token = ref(localStorage.getItem("token"));
  const flightStore = useFlightStore();

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

      // Prepare payload based on trip type
      let payload;
      const isRoundTrip = outboundBooking && returnBooking;

      if (isRoundTrip) {
        // Round-trip payload structure
        payload = {
          flight_id: outboundBooking.flight_id,
          seat_ids: outboundBooking.seat_ids,
          trip_type: 'return',
          return_flight: {
            flight_id: returnBooking.flight_id,
            seat_ids: returnBooking.seat_ids
          },
        };
      } else {
        // One-way payload structure
        if (!bookingData) {
          throw new Error('No booking data found');
        }
        payload = {
          flight_id: bookingData.flight_id,
          seat_ids: bookingData.seat_ids,
          trip_type: 'oneway',
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

      // Clear storage after successful booking
      flightStore.clearFlightData();
      sessionStorage.removeItem('bookingData');
      sessionStorage.removeItem('outboundBookingData');
      sessionStorage.removeItem('returnBookingData');
      sessionStorage.removeItem('guestData');

      console.log('Booking confirmed:', data.value);
      return data.value;

    } catch (error) {
      console.error('Booking failed:', {
        error: error.message,
        timestamp: new Date().toISOString(),
        storedData: {
          outbound: sessionStorage.getItem('outboundBookingData'),
          return: sessionStorage.getItem('returnBookingData'),
          guest: sessionStorage.getItem('guestData')
        }
      });
      throw error;
    }
  };

  return {
    loadingBooking,
    confirmBooking
  };
});