<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFlightStore } from '@/stores/useFlight'

const flightStore = useFlightStore()
const bookingData = ref(null)
const selectedFlight = ref(null)
const taxRate = 0.06 

onMounted(() => {
  const storedData = sessionStorage.getItem('guestData')
  if (storedData) {
    bookingData.value = JSON.parse(storedData)
    
    if (flightStore.flightList?.outbound) {
      selectedFlight.value = flightStore.flightList.outbound.find(
        flight => flight.id.toString() === bookingData.value.flight_id.toString()
      )
    }
   
  }
})

// Calculate total price
const subtotal = computed(() => {
  if (!selectedFlight.value || !bookingData.value) return 15990 // Fallback
  return bookingData.value.total_guests * parseFloat(selectedFlight.value.price)
})

const taxAmount = computed(() => {
  return subtotal.value * taxRate
})

// Calculate total with tax
const totalWithTax = computed(() => {
  return subtotal.value + taxAmount.value
})

</script>

<template>
  <h3 class="text-black font-weight-medium text-h5 mt-10">Order Details</h3>
  <div class="detail-content mt-5">
    <div class="detail-item">
      <span>Adults ({{ bookingData?.total_guests || 1 }})</span>
      <span v-if="selectedFlight">
        {{ bookingData?.total_guests || 1 }} × {{ selectedFlight.price }} SEK
      </span>
      <span v-else>
        1 × 15 990 SEK
      </span>
    </div>
    
    <!-- <div class="detail-item" v-if="bookingData?.selected_seats">
      <span>Selected Seats</span>
      <span>
        {{ bookingData.selected_seats.map(s => s.seat_number).join(', ') }}
      </span>
    </div> -->
    
    <div class="detail-item">
      <span>Taxes and fees</span>
      <span>{{ (taxRate * 100) }}%</span>
    </div>
    
    <div class="detail-item">
      <span>Sub Total</span>
      <span>{{ subtotal }} </span>
    </div>

    <v-divider class="my-5"></v-divider>
    
    <div class="detail-item">
      <span class="text-h5">Total:</span>
      <span class="text-h4">
        <strong>{{ totalWithTax }} SEK</strong>
      </span>
    </div>
    
    <router-link to="/guest">
      <v-btn 
        class="booking-btn mt-10" 
        variant="flat"
        rounded="lg" 
        size="large" 
        block 
        color="#657ca2"
      >
        Continue
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