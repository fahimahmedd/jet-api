<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFlightStore } from '@/stores/useFlight'
import { useRoute } from 'vue-router';

const flightStore = useFlightStore()
const outboundFlight = ref(null)
const returnFlight = ref(null)
const bookingData = ref(null)
const guestData = ref(null)
const route = useRoute();
const isCheckoutRoute = computed(() => route.path === '/checkout');

onMounted(() => {
  const storedBooking = sessionStorage.getItem('bookingData') || 
                      sessionStorage.getItem('outboundBookingData')
  const storedGuest = sessionStorage.getItem('guestData')
  const storedCoupon = sessionStorage.getItem('coupon')
  
  if (storedBooking) bookingData.value = JSON.parse(storedBooking)
  if (storedGuest) guestData.value = JSON.parse(storedGuest)
  if (storedCoupon) flightStore.coupon = JSON.parse(storedCoupon)
  
  outboundFlight.value = flightStore.selectedOutboundFlight || 
                        JSON.parse(sessionStorage.getItem('outboundFlight'))
  returnFlight.value = flightStore.selectedReturnFlight || 
                      JSON.parse(sessionStorage.getItem('returnFlight'))
})

const subtotal = computed(() => {
  if (!outboundFlight.value) return 0
  
  let total = guestData.value?.total_guests * parseFloat(outboundFlight.value.price)
  if (returnFlight.value) {
    total += guestData.value?.total_guests * parseFloat(returnFlight.value.price)
  }
  return total
})

const taxAmount = computed(() => {
  return subtotal.value * 0.06 // 6% tax
})

const discountAmount = computed(() => {
  if (!flightStore.coupon) return 0
  
  if (flightStore.coupon.type === 'fixed') {
    return parseFloat(flightStore.coupon.value)
  } else if (flightStore.coupon.type === 'percentage') {
    return subtotal.value * (parseFloat(flightStore.coupon.value) / 100)
  }
  return 0
})

const totalWithTaxAndDiscount = computed(() => {
  let total = subtotal.value + taxAmount.value
  if (flightStore.coupon) {
    total -= discountAmount.value
    // Ensure total doesn't go below 0
    return Math.max(total, 0)
  }
  return total
})

const appliedCoupon = computed(() => {
  return flightStore.coupon ? `Applied: ${flightStore.coupon.code}` : null;
});


</script>

<template>
  <h3 class="text-black font-weight-medium text-h5 mt-8">Order Details</h3>
  <div class="detail-content">
    <div class="detail-item">
      <span> Outbound Flight <span class="font-weight-bold ml-3"> (Adults - {{ guestData?.total_guests || 1 }}) </span></span>
      <span v-if="outboundFlight">
        {{ guestData?.total_guests || 1 }} × {{ outboundFlight.price }} SEK
      </span>
      <span v-else>
        1 × 15 990 SEK
      </span>
    </div>
    
    <div v-if="returnFlight" class="detail-item">
      <span>Return Flight <span class="font-weight-bold ml-3"> (Adults - {{ guestData?.total_guests || 1 }}) </span></span>
      <span>
        {{ guestData?.total_guests || 1 }} × {{ returnFlight.price }} SEK
      </span>
    </div>
    
    <div class="detail-item">
      <span>Taxes and fees</span>
      <span>6%</span>
    </div>
    
    <div v-if="flightStore.coupon" class="detail-item text-success">
      <span>Discount  <span class="text-caption text-grey-darken-3">(Code : {{ flightStore.coupon.code }})</span> </span>
      <span>-{{ discountAmount.toFixed(2) }} SEK</span>
    </div>
    
    <div class="detail-item">
      <span>Sub Total</span>
      <span>{{ subtotal.toFixed(2) }} SEK</span>
    </div>

    <v-divider class="my-5"></v-divider>
    
    <div class="detail-item">
      <span class="text-h5">Total:</span>
      <span class="text-h4">
        <strong>{{ totalWithTaxAndDiscount.toFixed(2) }} SEK</strong>
      </span>
    </div>
    
    <router-link to="/guest" v-if="!isCheckoutRoute">
      <v-btn 
        class="booking-btn mt-10" 
        variant="flat"
        rounded="lg" 
        size="large" 
        block 
        color="#657ca2"
      >
        Continue to Guest Info.
      </v-btn>
    </router-link>
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
</style>