<script setup>
import { reactive, onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFlightStore } from '@/stores/useFlight'
import { url } from '@/plugins/baseUrl'
import { useUserStore } from '@/stores/useUser'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { user, loadingUser } = storeToRefs(userStore)
const route = useRoute()
const router = useRouter()
const flightStore = useFlightStore()
const isLoading = ref(false)

// Get guest count from session storage
const getSearchParams = () => {
  try {
    return JSON.parse(sessionStorage.getItem('searchParams')) || {}
  } catch {
    return {}
  }
}
const searchParams = getSearchParams()
const totalGuests = searchParams?.totalGuests || 1

// Get flight ID from session storage based on trip type
const getFlightId = () => {
  if (flightStore.isRoundTrip) {
    if (!flightStore.selectedReturnFlight) {
      // Outbound flight case
      const outboundFlight = JSON.parse(sessionStorage.getItem('outboundFlight'))
      return outboundFlight?.id || null
    } else {
      // Return flight case
      const returnFlight = JSON.parse(sessionStorage.getItem('returnFlight'))
      return returnFlight?.id || null
    }
  } else {
    // One-way trip case
    const outboundFlight = JSON.parse(sessionStorage.getItem('outboundFlight'))
    return outboundFlight?.id || null
  }
}

const flightId = ref(null)
const seats = reactive([])
const selectedSeats = reactive([])

const availableSeatsCount = computed(() => {
  return seats.filter(seat => !seat.booked).length
})

const fetchSeats = async () => {
  try {
    // Get flight ID first
    flightId.value = getFlightId()
    if (!flightId.value) {
      console.error('No flight ID found in session storage')
      router.push('/')
      return
    }

    isLoading.value = true
    await flightStore.flightSeat(`${url}/flights/${flightId.value}/seats`)
    seats.splice(0, seats.length)
    const apiSeats = flightStore.seats?.seats || []

    apiSeats.forEach((seat, index) => {
      seats.push({
        ...seat,
        class: `seat-${index + 1}`,
        selected: false,
        booked: seat.is_booked === 1,
        seat_number: seat.seat_number || `Seat ${index + 1}`
      })
    })

    // Check if enough seats are available after loading
    if (availableSeatsCount.value < totalGuests) {
      showSeatWarning.value = true
    }
  } catch (error) {
    console.error('Error fetching seats:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSeats()
  
  // Restore previous selection if exists
  const savedBooking = sessionStorage.getItem(
    flightStore.isRoundTrip && !flightStore.selectedReturnFlight 
      ? 'outboundBookingData' 
      : 'bookingData'
  )
  if (savedBooking) {
    const bookingData = JSON.parse(savedBooking)
    if (bookingData.flight_id === flightId.value) {
      bookingData.selected_seats?.forEach(savedSeat => {
        const seat = seats.find(s => s.id === savedSeat.id)
        if (seat && !seat.booked) {
          seat.selected = true
          selectedSeats.push(savedSeat)
        }
      })
    }
  }
})

// watch(() => route.params.id, fetchSeats)

const toggleSeat = (id) => {
  const seat = seats.find((s) => s.id === id)
  if (!seat || seat.booked) return

  if (seat.selected) {
    seat.selected = false
    const index = selectedSeats.findIndex(s => s.id === id)
    if (index !== -1) selectedSeats.splice(index, 1)
  } else if (selectedSeats.length < totalGuests) {
    seat.selected = true
    selectedSeats.push({
      id: seat.id,
      seat_number: seat.seat_number
    })
  } else {
    const seatElement = document.querySelector(`.${seat.class}`)
    seatElement.classList.add('limit-reached')
    setTimeout(() => seatElement.classList.remove('limit-reached'), 500)
  }
}

const buttonState = computed(() => ({
  text: `${selectedSeats.length}/${totalGuests}`,
  disabled: selectedSeats.length !== totalGuests,
  color: selectedSeats.length === totalGuests ? 'primary' : 'grey'
}))

const selectedSeatsDisplay = computed(() => {
  if (selectedSeats.length === 0) return 'Not selected'
  return selectedSeats.map(s => s.seat_number).join(', ')
})


const proceedToTrip = async () => {
  if (buttonState.value.disabled) return
  
  try {
    const bookingData = {
      flight_id: flightId.value,
      seat_ids: selectedSeats.map(seat => seat.id),
      trip_type: searchParams.trip,
      selected_seats: selectedSeats
    };

    const guestData = {
      flight_id: flightId.value,
      total_guests: totalGuests,
      selected_seats: selectedSeats
    };

    sessionStorage.setItem('guestData', JSON.stringify(guestData));

    if (flightStore.isRoundTrip) {
      if (!flightStore.selectedReturnFlight) {
        sessionStorage.setItem('outboundBookingData', JSON.stringify(bookingData));
        router.push('/return-departure');
      } else {
        sessionStorage.setItem('returnBookingData', JSON.stringify(bookingData));
        combineRoundTripData();
        router.push('/trip');
      }
    } else {
      sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
      router.push('/trip');
    }
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

const combineRoundTripData = () => {
  try {
    const outboundData = JSON.parse(sessionStorage.getItem('outboundBookingData'));
    const returnData = JSON.parse(sessionStorage.getItem('returnBookingData'));
    const guestData = JSON.parse(sessionStorage.getItem('guestData'));

    if (!outboundData || !returnData || !guestData) {
      throw new Error('Missing booking data for round trip');
    }

    const combinedData = {
      trip_type: 'return',
      outbound: {
        flight_id: outboundData.flight_id,
        seat_ids: outboundData.seat_ids,
        selected_seats: outboundData.selected_seats
      },
      return: {
        flight_id: returnData.flight_id,
        seat_ids: returnData.seat_ids,
        selected_seats: returnData.selected_seats
      },
      total_guests: guestData.total_guests
    };

    sessionStorage.setItem('bookingData', JSON.stringify(combinedData));
  } catch (error) {
    console.error('Error combining round trip data:', error);
    throw error;
  }
};
</script>

<template>
  <div class="seat-wrapper">
    <div v-if="isLoading" class="loading-overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    
    <div class="seat-container">
      <v-btn 
        v-for="seat in seats" 
        :key="seat.id" 
        :class="[seat.class, { 
          'selected': seat.selected, 
          'booked': seat.booked,
          'limit-reached': selectedSeats.length >= totalGuests && !seat.selected && !seat.booked
        }]"
        class="seat-item" 
        :disabled="seat.booked" 
        @click="toggleSeat(seat.id)" 
        density="compact" 
        variant="tonal"
      >
        <span v-if="seat.booked" class="booked-text text-caption text-white font-weight-bold">
          BOKAD
        </span>
      </v-btn>
    </div>

    <div class="seat-overview mt-8">
      <div class="d-flex align-center ga-2">
        <span class="seat-shape booked-seat"></span>
        <span class="text-caption">Booked Seat</span>
      </div>
      <div class="d-flex align-center ga-2">
        <span class="seat-shape choosen-seat"></span>
        <span class="text-caption">Selected Seat</span>
      </div>
      <div class="d-flex align-center ga-2">
        <span class="seat-shape available-seat"></span>
        <span class="text-caption">Available Seat</span>
      </div>
    </div>

    <div class="seat-footer d-flex justify-space-between mt-10">
      <div class="d-flex ga-4 align-center">
        <div>
          <v-img src="/images/seat/seat.png" height="22" width="22"></v-img>
        </div>
        <span class="text-body-2">Seating: <strong>{{ selectedSeatsDisplay }}</strong></span>
      </div>
      
      <v-btn 
        size="large" 
        density="comfortable" 
        :variant="buttonState.disabled ? 'outlined' : 'tonal'"
        min-width="150" 
        rounded
        :disabled="buttonState.disabled"
        :color="buttonState.color"
        @click="proceedToTrip"
      >
        {{ buttonState.text }}
      </v-btn>
    </div>

 
  </div>
</template>


<style scoped>
.seat-wrapper {
  position: relative;
  min-height: 300px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 10;
}

.seat-container {
  height: 165px;
  width: 100%;
  max-width: 800px;
  background-image: url("/images/seat/plane-plate.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  z-index: 1;
  margin: 0 auto;
}

.seat-item {
  height: 40px !important;
  width: 50px;
  min-width: auto !important;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  transition: all 0.2s ease;
}

/* Seat positioning and background */
.seat-1 {
  background-image: url(/images/seat/seat-1.png);
  top: 25px;
  left: 185px;
}

.seat-2 {
  background-image: url(/images/seat/seat-2.png);
  top: 25px;
  left: 280px;
}

.seat-3 {
  background-image: url(/images/seat/seat-3.png);
  top: 25px;
  left: 390px;
}

.seat-4 {
  background-image: url(/images/seat/seat-4.png);
  top: 25px;
  right: 260px;
}

.seat-5 {
  background-image: url(/images/seat/seat-5.png);
  bottom: 27px;
  left: 280px;
}

.seat-6 {
  background-image: url(/images/seat/seat-6.png);
  bottom: 27px;
  left: 390px;
}

.seat-7 {
  background-image: url(/images/seat/seat-7.png);
  bottom: 27px;
  right: 260px;
}

.selected {
  background-color: #1E4721 !important;
  color: white !important;
  transform: scale(1.05);
}

.booked {
  background-color: #eeeeeea8;
  pointer-events: none;
  opacity: 0.8;
}

.limit-reached {
  animation: pulse 0.5s;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.seat-overview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 0 auto;
}

.seat-shape {
  height: 16px;
  width: 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 2px;
}

.booked-seat {
  background-color: #b9b9b9;
}

.choosen-seat {
  background-color: #346838;
}

.available-seat {
  background-color: #353434d9;
  border: 1px solid #9E9E9E;
}

.seat-footer {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (max-width: 1260px) {
  .seat-container {
    height: 145px;
    max-width: 700px;
  }

  .seat-1 {
    top: 20px;
    left: 162px;
  }

  .seat-2 {
    top: 20px;
    left: 245px;
  }

  .seat-3 {
    top: 20px;
    left: 350px;
  }

  .seat-4 {
    top: 20px;
    right: 230px;
  }

  .seat-5 {
    bottom: 22px;
    left: 250px;
  }

  .seat-6 {
    bottom: 22px;
    left: 345px;
  }

  .seat-7 {
    bottom: 22px;
    right: 230px;
  }

  .seat-item {
    height: 35px !important;
    width: 40px;
  }
}

@media (max-width: 1160px) {
  .seat-container {
    max-width: 600px;
    background-image: url("/images/seat/md-seat-plan.jpg");
  }

  .seat-1 {
    top: 20px;
    left: 120px;
  }

  .seat-2 {
    top: 20px;
    left: 205px;
  }

  .seat-3 {
    top: 20px;
    left: 305px;
  }

  .seat-4 {
    top: 20px;
    right: 165px;
  }

  .seat-5 {
    bottom: 22px;
    left: 207px;
  }

  .seat-6 {
    bottom: 22px;
    left: 306px;
  }

  .seat-7 {
    bottom: 22px;
    right: 168px;
  }
}

@media (max-width: 767px) {
  .seat-container {
    height: 600px;
    width: 180px;
    background-image: url("/images/seat/m-seat-plan.jpg");
    margin: 0 auto;
  }

  .seat-item {
    transform: rotate(90deg);
  }

  .seat-1 {
    top: 95px;
    right: 30px;
    left: auto;
  }

  .seat-2 {
    top: 190px;
    right: 30px;
    left: auto;
  }

  .seat-3 {
    top: 310px;
    right: 30px;
    left: auto;
  }

  .seat-4 {
    bottom: 155px;
    top: auto;
    right: 30px;
  }

  .seat-5 {
    top: 200px;
    left: 30px;
  }

  .seat-6 {
    top: 310px;
    left: 30px;
  }

  .seat-7 {
    bottom: 160px;
    top: auto;
    left: 30px;
    right: auto;
  }
  
  .seat-overview {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 0 16px;
  }
  
  .seat-footer {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
}
</style>