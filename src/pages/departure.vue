<script setup>
import { ref, computed, onMounted } from "vue";
import { useFlightStore } from "@/stores/useFlight";
import SubHeader from "@/components/subPages/SubHeader.vue";
import { useRouter } from "vue-router";

const flightStore = useFlightStore();
const router = useRouter();

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
    // If no search params exist, redirect to home
    router.push('/');
  }
});

const filteredFlights = computed(() => {
  if (!flightStore.flightList || !flightStore.flightList.outbound) return [];
  
  return flightStore.flightList.outbound.filter((flight) => {
    const flightDate = new Date(flight.departure_date);
    const flightMonth = flightDate.getMonth() + 1;
    
    // Create date-only versions for comparison (ignoring time)
    const todayDateOnly = new Date(today);
    todayDateOnly.setHours(0, 0, 0, 0);
    
    const flightDateOnly = new Date(flightDate);
    flightDateOnly.setHours(0, 0, 0, 0);
    
    return flightMonth === selectedMonth.value && flightDateOnly >= todayDateOnly;
  });
});


const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const months = computed(() => {
  const current = today.getMonth();
  return monthNames.slice(current).map((name, index) => ({
    label: name,
    value: current + index + 1,
  }));
});

// const seatBook = ()=>{
//   router.push({ path: `seat/${}` });
// }
</script>

<template>
  <div class="subpage-container">
    <v-row no-gutters>
      <v-col cols="12" lg="4" md="12">
        <div
          class="subpage-left"
          style="background-image: url('/images/subPage/departure.svg')"
        >
          <router-link to="/">
            <div class="logo">
              <v-img src="/images/logo/logo.png" max-width="130"></v-img>
            </div>
          </router-link>

          <h3 class="sub-text-content text-white font-weight-medium">
            When would you like to depart from Gothenburg?
          </h3>
        </div>
      </v-col>
      <v-col cols="12" lg="8" md="12">
        <div class="subpage-content">
          <SubHeader />
          <v-container>
            <div class="sub-container">
            <h2 class="text-black font-weight-regular text-h3 mt-10">
              Departure
            </h2>
            <div class="d-flex gap-4 mt-6">
              <span
                v-for="month in months"
                :key="month.value"
                class="cursor-pointer text-subtitle font-weight-regular px-1 mx-3 py-1 border-b-2"
                :class="{
                  'border-b-active font-weight-bold':
                    selectedMonth === month.value,
                  'border-transparent text-gray-600':
                    selectedMonth !== month.value,
                }"
                @click="selectedMonth = month.value"
              >
                {{ month.label }}
              </span>
            </div>

            <div class="departure-content mt-8">
              <router-link
                :to="`/seat/${item.id}`"
                v-for="item in filteredFlights"
                :key="item.id"
              >
                <DepartureItem :item="item" />
              </router-link>
            </div>
            <div
              v-if="filteredFlights.length === 0"
              class="mt-20 text-center font-weight-bold text-grey mt-6 text-h6"
            >
              No Flights available for this month
            </div>
            </div>
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
.border-b-active{
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
.sub-text-content{
  max-width: 340px;
  margin: 120px auto 0;
}
.gap {
  gap: 18px;
}

.subpage-content {
  padding-left: 20px;
}

@media (max-width: 991px) {
  .subpage-container {
    height: auto;
  }

  .subpage-left {
    height: auto;
    padding: 20px;
  }
  .subpage-content[data-v-49e4dc52] {
    padding-left: 0px;
  }

  h2 {
    margin-top: 15px !important;
    font-size: 36px !important;
  }
}
</style>
