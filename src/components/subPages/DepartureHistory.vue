<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFlightStore } from '@/stores/useFlight'
import { useRoute } from 'vue-router'

const route = useRoute()
const flightStore = useFlightStore()
const selectedFlight = ref(null)

// Format date as "Thursday, April 3"
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

// Format time as "08:45" (24-hour format)
const formatTime = (timeString) => {
  if (!timeString) return '--:--'
  const [hours, minutes] = timeString.split(':')
  return `${hours.padStart(2, '0')}:${minutes}`
}

// Calculate flight duration
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '0H 00MIN'
  
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  
  const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  return `${hours}H ${minutes.toString().padStart(2, '0')}MIN`
}

onMounted(() => {
  // Get flight ID from route params or sessionStorage
  const flightId = route.params.id || JSON.parse(sessionStorage.getItem('guestData'))?.flight_id
  
  if (flightId && flightStore.flightList) {
    // Check both outbound and return flights
    selectedFlight.value = flightStore.flightList.outbound?.find(
      f => f.id.toString() === flightId.toString()
    ) || flightStore.flightList.return?.find(
      f => f.id.toString() === flightId.toString()
    )
  }
})
</script>

<template>
  <div class="departure-history">
    <h3 class="history-title font-weight-regular text-grey-lighten-2">
      Departure
    </h3>
    <h3 class="history-title font-weight-regular text-white">
      {{ selectedFlight ? formatDate(selectedFlight.departure_date) : 'Thursday, April 3' }}
    </h3>
    
    <div class="departure-item" v-if="selectedFlight">
      <div class="flight-content">
        <v-row no-gutters align="center">
          <!-- Origin Info -->
          <v-col cols="4">
            <div>
              <h3 class="text-h5 text-white font-weight-regular letter-space-2">
                {{ formatTime(selectedFlight.departure_start_time) }}
              </h3>
              <h5 class="text-body-2 text-grey-lighten-4 font-weight-regular mt-2">
                {{ selectedFlight.origin.city }}
              </h5>
              <p class="text-caption text-grey-lighten-2 font-weight-light mt-2px">
                {{ selectedFlight.origin.name }}
              </p>
            </div>
          </v-col>

          <!-- Plane Image & Duration -->
          <v-col cols="4">
            <div>
              <v-img
                src="/images/subPage/plane.svg"
                class="mx-auto"
                width="100%"
                max-width="260px"
              ></v-img>
              <div class="time-text text-center text-caption text-grey-lighten-4 font-weight-regular">
                {{ calculateDuration(selectedFlight.departure_start_time, selectedFlight.departure_land_time) }}
              </div>
            </div>
          </v-col>

          <!-- Destination Info -->
          <v-col cols="4">
            <div class="text-right">
              <h3 class="text-h5 text-white font-weight-regular letter-space-2">
                {{ formatTime(selectedFlight.departure_land_time) }}
              </h3>
              <h5 class="text-body-2 text-grey-lighten-4 font-weight-regular mt-2">
                {{ selectedFlight.destination.city }}
              </h5>
              <p class="text-caption text-grey-lighten-2 font-weight-light mt-2px">
                {{ selectedFlight.destination.name }}
              </p>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Fallback if no flight selected -->
    <div class="departure-item" v-else>
      <!-- Your original static content here -->
    </div>

    <p class="text-body-2 font-weight-light text-grey-lighten-5 mt-5">
      Flight Operated by JIVAIR AB AOC. Jivair AB is the oldest commercial
      operator of private jets in Sweden since 1981.
    </p>
  </div>
</template>

<style lang="scss" scoped>
/* Your existing styles remain unchanged */
.departure-history {
  background-color: #6c7a90;
  padding: 20px;
  border-radius: 26px;
  max-width: 600px;
  margin: 60px auto 0;
}
.departure-item {
  height: auto;
  width: 100%;
  max-width: 600px;
  padding: 10px 0 30px 0;
  border-bottom: 1px solid #c8c8c89a;
  margin-top: 15px;
}
.history-title {
  font-size: 40px;
}
.mt-2px{
  margin-top: 2px;
}
.flight-content {
  width: 100%;
  position: relative;
}
.flight-content h5 {
  line-height: 1.1;
  margin-top: 2px;
}
.time-text {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>