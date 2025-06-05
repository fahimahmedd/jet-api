<script setup>
import SeatBox from "@/components/subPages/SeatBox.vue";
import SubHeader from "@/components/subPages/SubHeader.vue";
import { useFlightStore } from "@/stores/useFlight";
import { computed } from "vue";


const flightStore = useFlightStore();

const destinationCity = computed(() => {
  // Check if it's a return trip and return flight is selected
  if (flightStore.isRoundTrip && flightStore.selectedReturnFlight) {
    return flightStore.selectedReturnFlight.destination.city;
  }
  // Default to outbound flight's destination
  return flightStore.selectedOutboundFlight?.destination?.city || 'Stockholm';
});


</script>

<template>
  <div class="subpage-container">
    <v-row no-gutters>
      <v-col cols="12" lg="4" md="4">
        <div class="subpage-left" style="background-image: url('/images/subPage/seat.jpg')">
          <router-link to="/">
            <div class="logo">
              <v-img src="/images/logo/logo.png" max-width="180"></v-img>
            </div>
          </router-link>

          <h3 class="text-grey-lighten-2 font-weight-regular">
            Lets fly to <strong class="text-white">{{ destinationCity }}</strong>
          </h3>
        </div>
      </v-col>
      <v-col cols="12" lg="8" md="8">
        <div class="subpage-content">
          <SubHeader />
          <v-container>
            <h2 class="text-black font-weight-regular text-h3 mt-10">
              Seating
            </h2>
            <div class="placeholder-text text-grey-lighten-1 font-weight-medium text-h3 mt-10">
              Choose Your Seat
            </div>

            <SeatBox />
          </v-container>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.subpage-container {
  height: 100vh;
  width: 100%;
}

.subpage-left {
  height: 100vh;
  width: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  z-index: 1;
  padding: 30px;
}

.subpage-left::after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: -1;
}

h3 {
  font-size: 28px;
  margin-top: 120px;
}

.gap {
  gap: 18px;
}

.subpage-content {
  padding-left: 20px;
}

.placeholder-text {
  position: relative;
  top: -30px;
}

@media (max-width: 960px) {
  .subpage-left {
    padding: 20px;
  }

  h3 {
    margin-top: 40px;
  }

  .subpage-content {
    padding-left: 0px;
  }

  .subpage-content h2 {
    font-size: 32px !important;
  }

  .placeholder-text {
    font-size: 30px !important;
  }
}
</style>
