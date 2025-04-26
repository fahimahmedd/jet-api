<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  }
});

// Reusable time formatting function (24-hour format with leading zeros)
const formatTime24 = (timeString) => {
  if (!timeString) return '--:--';
  
  // Extract hours and minutes
  const [hours, minutes] = timeString.split(':');
  
  // Pad single-digit hours with leading zero
  const paddedHours = hours.padStart(2, '0');
  
  return `${paddedHours}:${minutes}`;
};

// Calculate flight duration (unchanged from previous version)
const flightDuration = computed(() => {
  if (!props.item.departure_start_time || !props.item.departure_land_time) return '';
  
  const [startH, startM] = props.item.departure_start_time.split(':').map(Number);
  const [landH, landM] = props.item.departure_land_time.split(':').map(Number);
  
  const startTotal = startH * 60 + startM;
  const landTotal = landH * 60 + landM;
  
  const durationMinutes = landTotal >= startTotal 
    ? landTotal - startTotal 
    : (24 * 60 - startTotal) + landTotal;
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  return hours > 0 
    ? `${hours} hr ${minutes} min` 
    : `${minutes} min`;
});

// Rest of your computed properties remain the same
const formattedDate = computed(() => {
  const date = new Date(props.item.departure_date)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
})

const seatStatus = computed(() => {
  const booked = props.item.total_seats - props.item.available_seats
  const seatArray = Array(7).fill(false)

  for (let i = 0; i < Math.min(booked, 7); i++) {
    seatArray[i] = true
  }

  return seatArray
})
</script>

<template>
  <div class="departure-item">
    <div class="item-content">
      <h2 class="text-white">{{ formattedDate }}</h2>
      <div class="flight-content mt-2">
        <v-row>
          <!-- Origin Info -->
          <v-col cols="6" lg="4" md="4">
            <div>
              <h3 class="text-h5 text-white font-weight-medium">{{ formatTime24(item.departure_start_time) }}</h3>
              <h5 class="text-body-1 text-grey-lighten-4 font-weight-medium">
                {{ item.origin.city }}
              </h5>
              <p class="text-caption text-grey-lighten-2">
                {{ item.origin.name }}
              </p>
            </div>
          </v-col>

          <!-- Plane image & Duration -->
          <v-col cols="6" lg="4" md="4" class="d-none d-lg-block">
            <div>
              <v-img src="/images/subPage/plane.svg" class="mx-auto" width="100%" max-width="260px"></v-img>
              <div class="time-text text-center text-caption text-white font-weight-regular">
                <!-- {{ item.is_round_trip ? 'Round Trip' : 'One Way' }} -->
                {{ flightDuration }}
              </div>
            </div>
          </v-col>

          <!-- Destination Info -->
          <v-col cols="6" lg="4" md="4">
            <div class="text-right">
              <h3 class="text-h5 text-white font-weight-medium">{{ formatTime24(item.departure_land_time) }}</h3>
              <h5 class="text-body-1 text-grey-lighten-4 font-weight-medium">
                {{ item.destination.city }}
              </h5>
              <p class="text-caption text-grey-lighten-2">
                {{ item.destination.name }}
              </p>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Price and Seats -->
    <div class="item-price">
      <h2 class="text-white text-h4 font-weight-bold">{{ parseInt(item.price) }} :-</h2>
      <div class="seat-wrap">
        <span v-for="(seat, index) in seatStatus" :key="index"
          :class="['mdi', 'mdi-car-seat', { booked: seat }]"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Your existing styles remain unchanged */
.departure-item {
  height: 150px;
  width: 100%;
  background-color: #6c7a90;
  margin-top: 20px;
  border-radius: 10px;
  display: flex;
  padding: 16px;
}

.item-content {
  width: 75%;
  padding-right: 12px;
  position: relative;
}

.item-price {
  border-left: 1px solid #e7e4e485;
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.flight-content {
  width: 100%;
}
.text-caption{
  font-weight: 300;
}
.flight-content h5 {
  line-height: 1.1;
  margin-top: 2px;
}

.time-text {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.seat-wrap {
  display: flex;
  gap: 2px;
  margin-top: 6px;
}

.seat-wrap span {
  width: 23px;
  height: 23px;
  border: 1px solid #dedbdb5d;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.seat-wrap .booked {
  color: #d5d4d4;
}

.seat-wrap .booked::after {
  position: absolute;
  content: "";
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 1px;
  height: 100%;
  background-color: #d5d4d4;
}

@media (max-width: 991px) {
  .departure-item {
    height: auto;
    display: grid;
    padding: 16px;
  }

  .item-content {
    width: 100%;
    padding-right: 10px;
  }

  .item-price {
    width: 100%;
    border-left: none;
    margin-top: 20px;
  }
}
</style>