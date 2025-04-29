<script setup>
import { ref } from 'vue';
import { useBookFlight } from '@/stores/useBookFlight';
import { useRouter } from 'vue-router';

const bookStore = useBookFlight();
const router = useRouter();
const isConfirming = ref(false);

const handleConfirmation = async () => {
  try {
    isConfirming.value = true;
    
    // Get booking data for verification
    const outboundBooking = JSON.parse(sessionStorage.getItem('outboundBookingData') || 'null');
    const returnBooking = JSON.parse(sessionStorage.getItem('returnBookingData') || 'null');
    const bookingData = JSON.parse(sessionStorage.getItem('bookingData') || 'null');
    
    console.log('Current booking data:', {
      outbound: outboundBooking,
      return: returnBooking,
      oneWay: bookingData
    });
    
    const result = await bookStore.confirmBooking();
    
    // Prepare seat information for confirmation page
    let seatInfo = '';
    if (outboundBooking && returnBooking) {
      seatInfo = `Outbound: ${outboundBooking.seat_ids.join(',')}, Return: ${returnBooking.seat_ids.join(',')}`;
    } else {
      seatInfo = bookingData?.seat_ids?.join(',') || '';
    }
    
    router.push({
      path: '/booked',
      query: {
        bookingId: result.booking_id,
        seats: seatInfo,
        tripType: outboundBooking && returnBooking ? 'roundtrip' : 'oneway'
      }
    });
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Booking failed. Please check your selected seats and try again.';
    alert(errorMessage);
    console.error('Confirmation error:', error);
  } finally {
    isConfirming.value = false;
  }
};
</script>


<template>
  <div class="detail-content mt-5">
    <h3 class="text-black font-weight-medium text-h5 mt-10">Guest Info</h3>
    <div class="selected-guest mt-4">
      <span class="text-black font-weight-regular text-caption-1">
        Guest - 1
      </span>
    </div>

    <h3 class="text-black font-weight-medium text-h5 mt-10">Luggage Details</h3>
    <div class="font-weight-regular mt-3 text-body-2 text-grey-darken-1">
      The luggage capacity has been met. If you'd like to bring additional
      luggage beyond what's included, please contact our Concierge team
      by email or web chat.
    </div>

    <Coupon />

    <OrderDetail />
    <v-btn 
    class="booking-btn mt-10" 
    variant="flat"
    rounded="lg" 
    size="large" 
    block 
    color="#657ca2"
    @click="handleConfirmation"
    :loading="isConfirming"
    :disabled="isConfirming"
  >
    Confirm Your Booking
  </v-btn>
    <h3 class="text-black font-weight-medium text-h5 mt-10">Payment</h3>
    <div class="payment-container mt-5">
      <v-btn
        density="comfortable"
        size="large"
        icon="mdi-plus"
        variant="tonal"
      ></v-btn>
      <span class="text-caption-1 mt-3">Add payment method</span>
    </div>
    <v-btn 
      block 
      height="48" 
      variant="tonal" 
      rounded 
      class="mt-4"
      :loading="isLoading"
      @click="handlePayment"
    >
      Pay with Credit Card
    </v-btn>

    <div class="text-medium-emphasis font-weight-regular text-caption mt-15">
      Please click here to view the change and cancellation policy for our
      different offerings.
    </div>
    <!-- Rest of your legal text -->
  </div>
</template>

<style lang="scss" scoped>
.detail-content {
  max-width: 500px;
}
.detail-item span {
  font-size: 16px;
  color: #242323;
}
.detail-item {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.selected-guest {
  padding: 12px 15px;
  background-color: #e4e4e4;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 380px;
}
.selected-guest .mdi-close {
  height: 25px;
  width: 25px;
  background-color: rgba(255, 200, 191, 0.719);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(231, 42, 17);
  cursor: pointer;
}
.payment-container {
  height: 200px;
  width: 100%;
  background-color: #ececec;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
}
.payment-container:hover {
  background-color: #dddddd;
}
</style>
