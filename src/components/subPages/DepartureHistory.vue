<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFlightStore } from '@/stores/useFlight'

const route = useRoute()
const flightStore = useFlightStore()
const outboundFlight = ref(null)
const returnFlight = ref(null)

// Check if this is a round trip
const isRoundTrip = computed(() => {
  return flightStore.searchParams?.trip === 'return'
})

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
  // Get flight data from store or sessionStorage
  const bookingData = JSON.parse(sessionStorage.getItem('bookingData'))
  
  // Extract flight ID properly from the ref object
  const getFlightId = (flightIdObj) => {
    if (!flightIdObj) return null
    // Handle both ref object and plain value cases
    return flightIdObj._rawValue !== undefined ? flightIdObj._rawValue : flightIdObj
  }

  // For round trips, bookingData contains both flights
  if (isRoundTrip.value && bookingData?.outbound) {
    const outboundId = getFlightId(bookingData.outbound.flight_id)
    const returnId = getFlightId(bookingData.return.flight_id)
    
    outboundFlight.value = flightStore.flightList?.outbound?.find(
      f => f.id.toString() === outboundId.toString()
    )
    returnFlight.value = flightStore.flightList?.return?.find(
      f => f.id.toString() === returnId.toString()
    )
  } 
  // For one-way trips or direct access
  else {
    const flightId = getFlightId(bookingData?.flight_id) || route.params.id
    if (flightId && flightStore.flightList) {
      outboundFlight.value = flightStore.flightList.outbound?.find(
        f => f.id.toString() === flightId.toString()
      ) || flightStore.flightList.return?.find(
        f => f.id.toString() === flightId.toString()
      )
    }
  }
})
</script>

<template>
  <!-- Your template remains exactly the same -->
  <div class="departure-history">
    <!-- Outbound Flight -->
    <div class="flight-section">
      <h3 class="history-title font-weight-regular text-grey-lighten-2">
        Outbound
      </h3>
      <h3 class="history-title font-weight-regular text-white text-up">
        {{ outboundFlight ? formatDate(outboundFlight.departure_date) : 'No flight selected' }}
      </h3>
      
      <div class="departure-item" v-if="outboundFlight">
        <div class="flight-content">
          <v-row no-gutters align="center">
            <!-- Origin Info -->
            <v-col lg="4" md="4" cols="12">
              <div>
                <h3 class="text-h5 text-white font-weight-regular letter-space-2">
                  {{ formatTime(outboundFlight.departure_start_time) }}
                </h3>
                <h5 class="text-body-2 text-grey-lighten-4 font-weight-regular mt-2">
                  {{ outboundFlight.origin.city }}
                </h5>
                <p class="text-caption text-grey-lighten-2 font-weight-light mt-2px">
                  {{ outboundFlight.origin.name }}
                </p>
              </div>
            </v-col>

            <!-- Plane Image & Duration -->
            <v-col lg="4" md="4" cols="12">
              <div>
                <v-img
                  src="/images/subPage/plane.svg"
                  class="mx-auto"
                  width="100%"
                  max-width="260px"
                ></v-img>
                <div class="time-text text-center text-caption text-grey-lighten-4 font-weight-regular">
                  {{ calculateDuration(outboundFlight.departure_start_time, outboundFlight.departure_land_time) }}
                </div>
              </div>
            </v-col>

            <!-- Destination Info -->
            <v-col lg="4" md="4" cols="12">
              <div class="text-right">
                <h3 class="text-h5 text-white font-weight-regular letter-space-2">
                  {{ formatTime(outboundFlight.departure_land_time) }}
                </h3>
                <h5 class="text-body-2 text-grey-lighten-4 font-weight-regular mt-2">
                  {{ outboundFlight.destination.city }}
                </h5>
                <p class="text-caption text-grey-lighten-2 font-weight-light mt-2px">
                  {{ outboundFlight.destination.name }}
                </p>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
      <div v-else class="text-caption text-grey-lighten-3 mt-2">
        No outbound flight selected
      </div>
    </div>

    <!-- Return Flight (only for round trips) -->
    <div class="flight-section mt-8" v-if="isRoundTrip">
      <h3 class="history-title font-weight-regular text-grey-lighten-2">
        Return
      </h3>
      <h3 class="history-title font-weight-regular text-white text-up">
        {{ returnFlight ? formatDate(returnFlight.departure_date) : 'No return flight' }}
      </h3>
      
      <div class="departure-item" v-if="returnFlight">
        <div class="flight-content">
          <v-row no-gutters align="center">
            <!-- Origin Info -->
            <v-col lg="4" md="4" cols="12">
              <div>
                <h3 class="text-h5 text-white font-weight-regular letter-space-2">
                  {{ formatTime(returnFlight.departure_start_time) }}
                </h3>
                <h5 class="text-body-2 text-grey-lighten-4 font-weight-regular mt-2">
                  {{ returnFlight.origin.city }}
                </h5>
                <p class="text-caption text-grey-lighten-2 font-weight-light mt-2px">
                  {{ returnFlight.origin.name }}
                </p>
              </div>
            </v-col>

            <!-- Plane Image & Duration -->
            <v-col lg="4" md="4" cols="12">
              <div>
                <v-img
                  src="/images/subPage/plane.svg"
                  class="mx-auto"
                  width="100%"
                  max-width="260px"
                ></v-img>
                <div class="time-text text-center text-caption text-grey-lighten-4 font-weight-regular">
                  {{ calculateDuration(returnFlight.departure_start_time, returnFlight.departure_land_time) }}
                </div>
              </div>
            </v-col>

            <!-- Destination Info -->
            <v-col lg="4" md="4" cols="12">
              <div class="text-right">
                <h3 class="text-h5 text-white font-weight-regular letter-space-2">
                  {{ formatTime(returnFlight.departure_land_time) }}
                </h3>
                <h5 class="text-body-2 text-grey-lighten-4 font-weight-regular mt-2">
                  {{ returnFlight.destination.city }}
                </h5>
                <p class="text-caption text-grey-lighten-2 font-weight-light mt-2px">
                  {{ returnFlight.destination.name }}
                </p>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
      <div v-else class="text-caption text-grey-lighten-3 mt-2">
        No return flight selected
      </div>
    </div>

    <p class="text-body-2 font-weight-light text-grey-lighten-5 mt-5 inf-text">
      Flight Operated by JIVAIR AB AOC. Jivair AB is the oldest commercial
      operator of private jets in Sweden since 1981.
    </p>
  </div>
</template>

<style lang="scss" scoped>
.departure-history {
  background-color: #6c7a90;
  padding: 20px;
  border-radius: 26px;
  max-width: 600px;
  margin: 60px auto 0;
}

.flight-section {
  &:not(:first-child) {
    margin-top: 30px;
    padding-top: 30px;
    border-top: 1px dashed rgba(255, 255, 255, 0.2);
  }
}
.text-up{
  line-height: 45px !important;
}
.inf-text{
  border-top: 1px solid #c3c3c39c;
  padding-top: 10px;
}
.departure-item {
  height: auto;
  width: 100%;
  max-width: 600px;
  padding: 10px 0 30px 0;
  // border-bottom: 1px solid #c8c8c89a;
  margin-top: 15px;
}

.history-title {
  font-size: 40px;
}

.mt-2px {
  margin-top: 2px;
}

.flight-content {
  width: 100%;
  position: relative;
  
  h5 {
    line-height: 1.1;
    margin-top: 2px;
  }
}

.time-text {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.letter-space-2 {
  letter-spacing: 2px;
}

@media (max-width: 991px) {
  .history-title{
    font-size: 20px;
  }

  .departure-history{
    margin: 20px auto 0;
}
.text-up{
  font-size: 18px;
  line-height: 28px !important;
}

.departure-item {
    padding: 10px 0 10px 0;
    margin-top: 0px;
}

.time-text{
    bottom: 30%;
}

}
</style>