<script setup>
import { reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFlightStore } from '@/stores/useFlight'
import { url } from '@/plugins/baseUrl'

const route = useRoute()
const flightStore = useFlightStore()

const flightId = route.params.id
const seats = reactive([])

const fetchSeats = async () => {
  await flightStore.flightSeat(`${url}/flights/${flightId}/seats`)
  seats.splice(0, seats.length)
  const apiSeats = flightStore.seats?.seats || []

  apiSeats.slice(0, 7).forEach((seat, index) => {
    seats.push({
      ...seat,
      class: `seat-${index + 1}`,
      selected: false,
      booked: seat.is_booked === 1
    })
  })
}

fetchSeats()

// Watch route param changes
watch(() => route.params.id, () => {
  fetchSeats()
})

// Toggle Seat Logic
const toggleSeat = (id) => {
  const seat = seats.find((s) => s.id === id)
  if (seat && !seat.booked) {
    seat.selected = !seat.selected
  }
}
</script>

<template>
  <div class="seat-container">
    <v-btn
  v-for="seat in seats"
  :key="seat.id"
  :class="[seat.class, { selected: seat.selected, booked: seat.booked }]"
  class="seat-item"
  :disabled="seat.booked"
  @click="toggleSeat(seat.id)"
  density="compact"
  variant="tonal"
>
  <span
    v-if="seat.booked"
    class="booked-text text-caption text-white font-weight-medium"
  >
    BOKAD
  </span>
  <span
    v-else
    class="text-caption font-weight-medium"
  >
    {{ seat.seat_number }}
  </span>
</v-btn>
  </div>

  <div class="seat-overview mt-16">
    <div class="d-flex align-center ga-2">
      <span class="seat-shape booked-seat"></span>
      <span>Booked Seat</span>
    </div>
    <div class="d-flex align-center ga-2">
      <span class="seat-shape choosen-seat"></span>
      <span>Choosen Seat</span>
    </div>
  </div>
  <div class="seat-footer d-flex justify-space-between mt-16">
    <div class="d-flex ga-4 align-center">
      <div>
        <v-img
          src="/public/images/seat/seat.png"
          height="22"
          width="22"
        ></v-img>
      </div>
      <span>Seating <strong>3L</strong> </span>
    </div>
    <router-link to="/trip">
      <v-btn
        size="x-large"
        density="comfortable"
        variant="tonal"
        max-width="260"
        rounded
        >1/2</v-btn
      >
    </router-link>
  </div>
</template>

<style scoped>
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
}

.seat-mobile-container {
  height: 600px;
  width: 100%;
  background-image: url("/images/seat/m-plan-plate.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  z-index: 1;
}
.seat-item {
  height: 40px !important;
  width: 50px;
  min-width: auto !important;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
}

/* Seat positioning and background */
.seat-1 {
  background-image: url(/public/images/seat/seat-1.png);
  top: 25px;
  left: 185px;
}
.seat-2 {
  background-image: url(/public/images/seat/seat-2.png);
  top: 25px;
  left: 280px;
}
.seat-3 {
  background-image: url(/public/images/seat/seat-3.png);
  top: 25px;
  left: 390px;
}
.seat-4 {
  background-image: url(/public/images/seat/seat-4.png);
  top: 25px;
  right: 260px;
}
.seat-5 {
  background-image: url(/public/images/seat/seat-5.png);
  bottom: 27px;
  left: 280px;
}
.seat-6 {
  background-image: url(/public/images/seat/seat-6.png);
  bottom: 27px;
  left: 390px;
}
.seat-7 {
  background-image: url(/public/images/seat/seat-7.png);
  bottom: 27px;
  right: 260px;
}

.selected {
  background-color: #3db641f6 !important;
  color: white;
}

/* Booked seat style */
.booked {
  background-color: #eeeeeea8;
  pointer-events: none;
  opacity: 0.8;
}
.booked .booked-text {
  position: relative;
  z-index: 111;
}
.seat-overview {
  display: flex;
  align-items: center;
  gap: 60px;
}
.seat-shape {
  height: 20px;
  width: 25px;
  border-top-left-radius: 10px;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 2px;
}
.booked-seat {
  background-color: #b9b9b9;
}
.choosen-seat {
  background-color: #358b38fd;
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
    background-image: url("/images/seat/md-seat-plan.svg");
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
    background-image: url("/images/seat/m-seat-plan.svg");
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
}
</style>
