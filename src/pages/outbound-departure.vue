<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useFlightStore } from "@/stores/useFlight";
import SubHeader from "@/components/subPages/SubHeader.vue";
import { useRouter } from "vue-router";

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
  if (!flightStore.flightList || !flightStore.flightList.outbound) return [];

  return flightStore.flightList.outbound.filter((flight) => {
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
  if (!flightStore.flightList?.outbound) return [];
  
  const current = today.getMonth();
  const monthsWithFlights = new Set();
  
  // Find all months that have flights
  flightStore.flightList.outbound.forEach((flight) => {
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
  if (newVal?.outbound && months.value.length > 0) {
    selectedMonth.value = months.value[0].value;
  }
});

const selectOutboundFlight = (flight) => {
  const availableSeats = flight.seats.filter(seat => !seat.is_booked).length;
  
  if (availableSeats >= totalGuests.value) {
    flightStore.setSelectedFlight(flight, 'outbound');
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
    <v-row no-gutters class="flex-column flex-md-row">
      <v-col cols="12" md="5" lg="4">
        <div class="subpage-left">
          <router-link to="/" class="logo-link">
            <div class="logo">
              <v-img src="/images/logo/logo.png" :max-width="$vuetify.display.smAndDown ? '140' : '180'"></v-img>
            </div>
          </router-link>

          <div class="sub-text-container">
            <h3 class="sub-text-content text-white font-weight-medium">
              When would you like to depart from {{ flightStore.searchParams?.origin_city }}?
            </h3>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="7" lg="8">
        <div class="subpage-content">
          <SubHeader />
          <v-container class="px-4 px-sm-6">
            <div class="sub-container">
              <h2 class="text-black font-weight-regular text-h4 text-md-h3">
                Departure
              </h2>
              
              <div v-if="months.length > 0" class="month-wrapper mt-4 mt-sm-6">
                <div class="month-scroller">
                  <span 
                    v-for="month in months" 
                    :key="month.value"
                    class="month-tab" 
                    :class="{
                      'month-tab-active': selectedMonth === month.value,
                    }" 
                    @click="selectedMonth = month.value"
                  >
                    {{ month.label }}
                  </span>
                </div>
              </div>

              <div class="departure-content">
                <div 
                  v-for="item in filteredFlights" 
                  :key="item.id" 
                  @click="selectOutboundFlight(item)" 
                  class="cursor-pointer"
                >
                  <DepartureItem :item="item" />
                </div>
              </div>
              
              <div v-if="months.length === 0" class="no-flights-message">
                No Flights Available
              </div>
              <div v-else-if="filteredFlights.length === 0" class="no-flights-message">
                No Flights available for selected month
              </div>
            </div>
          </v-container>
        </div>
      </v-col>
    </v-row>

    <!-- Seat Warning Modal -->
    <v-dialog v-model="showSeatWarning" persistent :max-width="$vuetify.display.smAndDown ? '90%' : '500'">
      <v-card class="pa-4 pa-sm-6 text-center">
        <v-icon color="warning" :size="$vuetify.display.smAndDown ? 48 : 64" class="mb-3 mb-sm-4 mx-auto">mdi-alert-circle-outline</v-icon>
        <h2 class="text-h6 text-sm-h5 text-black font-weight-bold mb-2 mb-sm-3">Not Enough Seats Available</h2>
        <p class="text-caption text-sm-caption-2 text-grey-darken-2 mb-4 mb-sm-6">
          Only <strong>{{ availableSeatsCount }}</strong> seats remain, but you're booking for 
          <strong>{{ totalGuests }}</strong> guests. Please select another flight.
        </p>
        <div class="d-flex justify-center gap-3 gap-sm-4">
          <v-btn color="#6d92cf" @click="goBackToFlights" class="px-4">
            <v-icon start size="small">mdi-arrow-left</v-icon>
            Select Another Flight
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.subpage-container {
  min-height: 100vh;
  width: 100%;
}

.subpage-left {
  height: 280px;
  width: 100%;
  background-image: url('/images/subPage/departure.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  z-index: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Distributes space between logo and text */
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

.logo-link {
  display: block;
  z-index: 2; /* Ensures logo stays above overlay */
}

.logo {
  margin-bottom: 0; /* Remove bottom margin since we're using flex spacing */
}

.sub-text-container {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centers text vertically */
  flex-grow: 1; /* Takes up remaining space */
  position: relative;
  z-index: 2;
  padding: 20px 0;
}

h3 {
  font-size: 1.5rem;
  line-height: 1.3;
  text-align: center;
}

.sub-text-content {
  max-width: 340px;
  margin: 0 auto;
}

.subpage-content {
  padding: 0;
}

.month-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8px;
}

.month-scroller {
  display: flex;
  gap: 12px;
  min-width: max-content;
  padding: 0 4px;
}

.month-tab {
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 400;
  padding: 4px 8px;
  border-bottom: 2px solid transparent;
  color: #6b7280;
  white-space: nowrap;
}

.month-tab-active {
  border-bottom: 2px solid #6C7A90;
  font-weight: 600;
  color: #1f2937;
}

.departure-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.no-flights-message {
  margin: 60px 0;
  text-align: center;
  font-weight: 600;
  color: #9ca3af;
  font-size: 1.125rem;
}

@media (min-width: 600px) {
  .subpage-left {
    height: 320px;
    padding: 25px;
  }
  
  h3 {
    font-size: 1.75rem;
  }
}

@media (min-width: 960px) {
  .subpage-container {
    display: flex;
    flex-direction: row;
    height: 100vh;
  }
  
  .subpage-left {
    height: 100%;
    padding: 30px;
  }
  
  .sub-text-container {
    padding: 40px 0;
  }
}

@media (min-width: 1280px) {
  .subpage-left {
    padding: 40px;
  }
  
  h3 {
    font-size: 1.75rem;
  }
}
</style>