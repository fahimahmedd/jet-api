<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useFlightStore } from "@/stores/useFlight";
import SubHeader from "@/components/subPages/SubHeader.vue";
import { useRouter } from "vue-router";
import DepartureItem from "@/components/subPages/DepartureItem.vue";

const flightStore = useFlightStore();
const router = useRouter();

// Modal control
const showSeatWarning = ref(false);
const availableSeatsCount = ref(0);

// Get search params
const searchParams = JSON.parse(sessionStorage.getItem('searchParams'));
const totalGuests = computed(() => searchParams?.totalGuests || 1);

// Get today's date
const today = new Date();
const currentMonth = today.getMonth() + 1;
const selectedMonth = ref(currentMonth);

// Load flight data when component mounts
onMounted(async () => {
  if (flightStore.searchParams && !flightStore.flightList) {
    try {
      await flightStore.searchFlightExecute(
        `${url}/flights?origin_id=${flightStore.searchParams.origin_id}&destination_id=${flightStore.searchParams.destination_id}&departure_date=&trip=${flightStore.searchParams.trip}`
      );
    } catch (error) {
      console.error("Error reloading flight data:", error);
      flightStore.clearFlightData();
      router.push('/');
    }
  } else if (!flightStore.searchParams) {
    router.push('/');
  }
});

const filteredFlights = computed(() => {
  if (!flightStore.flightList || !flightStore.flightList.return) return [];
  
  return flightStore.flightList.return.filter((flight) => {
    const flightDate = new Date(flight.departure_date);
    const flightMonth = flightDate.getMonth() + 1;
    const todayDateOnly = new Date(today);
    todayDateOnly.setHours(0, 0, 0, 0);
    const flightDateOnly = new Date(flightDate);
    flightDateOnly.setHours(0, 0, 0, 0);
    
    return flightMonth === selectedMonth.value && flightDateOnly >= todayDateOnly;
  });
});

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec",
];

const months = computed(() => {
  if (!flightStore.flightList?.return) return [];
  
  const current = today.getMonth();
  const monthsWithFlights = new Set();
  
  // Find all months that have flights
  flightStore.flightList.return.forEach((flight) => {
    const flightDate = new Date(flight.departure_date);
    const flightMonth = flightDate.getMonth() + 1;
    const flightDateOnly = new Date(flightDate);
    flightDateOnly.setHours(0, 0, 0, 0);
    const todayDateOnly = new Date(today);
    todayDateOnly.setHours(0, 0, 0, 0);
    
    if (flightDateOnly >= todayDateOnly) {
      monthsWithFlights.add(flightMonth);
    }
  });
  
  // Create array of available months
  const availableMonths = monthNames
    .slice(current)
    .map((name, index) => ({
      label: name,
      value: current + index + 1,
    }))
    .filter(month => monthsWithFlights.has(month.value));

  // Auto-select first available month if current selection has no flights
  if (availableMonths.length > 0 && !monthsWithFlights.has(selectedMonth.value)) {
    selectedMonth.value = availableMonths[0].value;
  }

  return availableMonths;
});

// Watch for flight data changes to auto-select first month
watch(() => flightStore.flightList, (newVal) => {
  if (newVal?.return && months.value.length > 0) {
    selectedMonth.value = months.value[0].value;
  }
});

const selectReturnFlight = (flight) => {
  const availableSeats = flight.seats.filter(seat => !seat.is_booked).length;
  
  if (availableSeats >= totalGuests.value) {
    flightStore.setSelectedFlight(flight, 'return');
    router.push(`/seat`);
  } else {
    availableSeatsCount.value = availableSeats;
    showSeatWarning.value = true;
  }
};

const goBackToFlights = () => {
  showSeatWarning.value = false;
};
</script>

<template>
  <div class="subpage-container">
    <v-row no-gutters>
      <v-col cols="12" lg="4" md="12">
        <div class="subpage-left" style="background-image: url('/images/subPage/departure.svg')">
          <router-link to="/">
            <div class="logo">
              <v-img src="/images/logo/logo.png" max-width="180"></v-img>
            </div>
          </router-link>

          <h3 class="sub-text-content text-white font-weight-medium">
            When would you like to return to {{ flightStore.searchParams?.origin_city }}?
          </h3>
        </div>
      </v-col>
      <v-col cols="12" lg="8" md="12">
        <div class="subpage-content">
          <SubHeader />
          <v-container>
            <div class="sub-container">
              <h2 class="text-black font-weight-regular text-h3">
                Return
              </h2>
              
              <div v-if="months.length > 0" class="month-wrapper d-flex gap-4 mt-6">
                <span 
                  v-for="month in months" 
                  :key="month.value"
                  class="cursor-pointer text-subtitle font-weight-regular px-1 mx-3 py-1 border-b-2" 
                  :class="{
                    'border-b-active font-weight-bold': selectedMonth === month.value,
                    'border-transparent text-gray-600': selectedMonth !== month.value,
                  }" 
                  @click="selectedMonth = month.value"
                >
                  {{ month.label }}
                </span>
              </div>

              <div class="departure-content mt-8">
                <div 
                  v-for="item in filteredFlights" 
                  :key="item.id" 
                  @click="selectReturnFlight(item)" 
                  class="cursor-pointer"
                >
                  <DepartureItem :item="item" />
                </div>
              </div>
              
              <div v-if="months.length === 0" class="mt-20 text-center font-weight-bold text-grey mt-6 text-h6">
                No Flights Available
              </div>
              <div v-else-if="filteredFlights.length === 0" class="mt-20 text-center font-weight-bold text-grey mt-6 text-h6">
                No Flights available for selected month
              </div>
            </div>
          </v-container>
        </div>
      </v-col>
    </v-row>

    <!-- Seat Warning Modal -->
    <v-dialog v-model="showSeatWarning" persistent max-width="500">
      <v-card class="pa-6 text-center">
        <v-icon color="warning" size="64" class="mb-4 mx-auto">mdi-alert-circle-outline</v-icon>
        <h2 class="text-h5 text-black font-weight-bold mb-3">Not Enough Seats Available</h2>
        <p class="text-caption-2 text-grey-darken-2 mb-6">
          Only <strong>{{ availableSeatsCount }}</strong> seats remain, but you're booking for 
          <strong>{{ totalGuests }}</strong> guests. Please select another flight.
        </p>
        <div class="d-flex justify-center gap-4">
          <v-btn color="#6d92cf" @click="goBackToFlights">
            <v-icon start>mdi-arrow-left</v-icon>
            Select Another Flight
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>


<style scoped>
.subpage-container {
  height: 100vh;
  width: 100%;
}

.border-b-active {
  border-bottom: 2px solid #6C7A90;
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
}

.sub-text-content {
  max-width: 340px;
  margin: 120px auto 0;
}

.gap {
  gap: 18px;
}

.subpage-content {
  padding-left: 20px;
}

.month-wrapper {
  width: 100%;
  overflow-x: scroll;
}

@media (max-width: 991px) {
  .subpage-container {
    height: auto;
  }

  .subpage-left {
    height: auto;
    padding: 20px;
  }

  .subpage-content {
    padding-left: 0px;
  }

  h2 {
    margin-top: 15px !important;
    font-size: 36px !important;
  }
  .sub-text-content {
  max-width: 100%;
  margin: 40px auto 0;
}
}
</style>
