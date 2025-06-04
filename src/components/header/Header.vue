<script setup>
import { useFlightStore } from "@/stores/useFlight";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { url } from "@/plugins/baseUrl";
import { useAxios } from "@vueuse/integrations/useAxios";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUser";
import { useSettingStore } from "@/stores/useSetting";

// Add this in your script setup
const settingStore = useSettingStore();
const { settingsData } = storeToRefs(settingStore);
const dashboardMenu = ref(false);

const flightStore = useFlightStore();
const userStore = useUserStore();
const { originData } = storeToRefs(flightStore);
const originList = computed(() => originData.value);
const destinationList = computed(() => destinationData.value);

const router = useRouter();

const mobileMenuOpen = ref(false);


onMounted(async () => {
  await settingStore.fetchSettings();
});

const originPlaceholder = ref({
  city: "Origin",
  airport: "",
  code: "",
  value: "",
});

const {
  execute: executeDestination,
  data: destinationData,
  isLoading: loadingDestination,
} = useAxios("", { immediate: true });

watch(originPlaceholder, (newVal) => {
  if (newVal) {
    executeDestination(`${url}/airport-routes/${newVal.id}`);
  }
});

watch(destinationData, (newVal) => {
  if (Array.isArray(newVal)) {
    if (newVal.length === 1) {
      destinationPlaceholder.value = newVal[0];
    } else {
      destinationPlaceholder.value = {
        city: "Destination",
        airport: "",
        code: "",
        value: "",
      }; // Clear if more than one
    }
  }
});

const destinationPlaceholder = ref({
  city: "Destination",
  airport: "",
  code: "",
  value: "",
});

const menu = ref(false);

// Guest data
const addGuest = ref([
  {
    title: "Adult",
    description: "Ages 2+",
    value: 1,
  },
  {
    title: "Infants",
    description: "",
    value: 0,
  },
  {
    title: "Pet (In Seat)",
    description: "An extra seat for your pet",
    value: 0,
  },
  {
    title: "Pet (In Carrier)",
    description:
      "Pet & carrier (max size/weight: 20 in x 12 in x 9 in, <20 lbs) must go and fit under the seat.",
    value: 0,
  },
  {
    title: "Service Animal*",
    description: "Service animal must fit within passenger foot space",
    value: 0,
  },
]);

function reverseTrip() {
  if (originPlaceholder.value.id && destinationPlaceholder.value.id) {
    let originTmp = originPlaceholder.value;
    let destinationTmp = destinationPlaceholder.value;
    originPlaceholder.value = destinationTmp;
    destinationPlaceholder.value = originTmp;
  }
}
// Total guest count
const totalGuests = computed(() => {
  return addGuest.value[0].value; // Only count adults
});

const isRoundTrip = ref(false);

const isSearchDisabled = computed(() => {
  return !originPlaceholder.value?.id || !destinationPlaceholder.value?.id;
});

const snackbar = ref({
  show: false,
  message: "",
  color: "error"
});


async function searchFlight() {
  try {
    const response = await flightStore.searchFlightExecute(
      `${url}/flights?origin_id=${originPlaceholder.value.id}&destination_id=${destinationPlaceholder.value.id
      }&departure_date=&trip=${isRoundTrip.value ? "return" : "oneway"}`,
      originPlaceholder.value.code,
      originPlaceholder.value.city, 
      destinationPlaceholder.value.code,
      totalGuests.value
    );

    // Clear previous selections
    flightStore.selectedOutboundFlight = null;
    flightStore.selectedReturnFlight = null;
    sessionStorage.removeItem('outboundFlight');
    sessionStorage.removeItem('returnFlight');

    // Check if we got any flights
    if (!response || 
        (response.outbound && response.outbound.length === 0 && !isRoundTrip.value)) {
      // One-way trip with no outbound flights
      snackbar.value = {
        show: true,
        message: "No outbound flights available for this route",
        color: "error"
      };
      return;
    }

    if (isRoundTrip.value) {
      // Round trip checks
      const hasOutbound = response.outbound && response.outbound.length > 0;
      const hasReturn = response.return && response.return.length > 0;
      
      if (!hasOutbound && !hasReturn) {
        snackbar.value = {
          show: true,
          message: "No flights available for this route (both outbound and return)",
          color: "error"
        };
        return;
      }
      
      if (!hasOutbound) {
        snackbar.value = {
          show: true,
          message: "No outbound flights available for this route",
          color: "error"
        };
        return;
      }
      
      if (!hasReturn) {
        snackbar.value = {
          show: true,
          message: "No return flights available for this route",
          color: "error"
        };
        return;
      }
    }

    // If we have flights, proceed
    router.push({ path: "outbound-departure" });

  } catch (error) {
    console.error("Search failed:", error);
    snackbar.value = {
      show: true,
      message: "Error searching for flights. Please try again.",
      color: "error"
    };
  }
}

onMounted(() => {
  isRoundTrip.value = false;
  // Set initial placeholder structure
  originPlaceholder.value = {
    city: "Origin",
    airport: "",
    code: "",
    value: "",
  };

  if (flightStore.searchParams) {
    // Find the matching origin in originList
    const matchingOrigin = originList.value?.find(
      (origin) => origin.id === flightStore.searchParams.origin_id
    );

    // If found, update the originPlaceholder
    if (matchingOrigin) {
      originPlaceholder.value = {
        ...matchingOrigin,
        city: matchingOrigin.city || "Origin",
        airport: matchingOrigin.name || "",
        code: matchingOrigin.code || "",
        value: matchingOrigin.id || "",
      };
    }

    // Find the matching destination in destinationList
    const matchingDestination = destinationList.value?.find(
      (dest) => dest.id === flightStore.searchParams.destination_id
    );

    // If found, update the destinationPlaceholder
    if (matchingDestination) {
      destinationPlaceholder.value = {
        ...matchingDestination,
        city: matchingDestination.city || "Destination",
        airport: matchingDestination.name || "",
        code: matchingDestination.code || "",
        value: matchingDestination.id || "",
      };
    }
    // Restore trip type
    // isRoundTrip.value = flightStore.searchParams.trip === 'twoway';
  }
});

const shouldDisable = (title, isIncrement) => {
  if (title === "Adult") return false;

  const adultsCount = addGuest.value[0].value;
  const specialItems = addGuest.value.slice(1);
  const totalSelected = specialItems.reduce((sum, item) => sum + item.value, 0);

  // Disable "+" if totalSelected >= Adults OR if incrementing would exceed Adults
  if (isIncrement && totalSelected >= adultsCount) {
    return true;
  }

  return false;
};

watch(() => addGuest.value[0].value, (newAdults, oldAdults) => {
  if (newAdults < oldAdults) {
    const specialItems = addGuest.value.slice(1);
    const totalSelected = specialItems.reduce((sum, item) => sum + item.value, 0);

    // Reset if selections exceed new Adults count
    if (totalSelected > newAdults) {
      specialItems.forEach(item => item.value = 0);
    }
  }
});

const userData = computed(() => {
  return userStore.user;
});

const onLogout = () => {
  userStore.logoutUser();
};

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const toProfile = () => {
  router.push({ path: "profile" });
}
</script>

<template>
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
    {{ snackbar.message }}
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
    </template>
  </v-snackbar>

  <div :class="['header', { scrolled: isScrolled }]">
    <div class="header-container">
      <router-link to="/" class="logo">
        <v-img :src="settingsData?.logo ? `${settingsData.logo}` : 'No Image'" 
               max-height="40" contain class="logo-img"></v-img>
      </router-link>

      <!-- Desktop View -->
      <div class="transport-wrapper d-none d-md-flex">
        <div class="transport-wrap">
          <v-select v-model="originPlaceholder" item-value="value" item-title="city" :items="originList" variant="plain"
            return-object density="compact" hide-details theme="dark">
            <template #item="data">
              <v-list-item v-bind="data.props" class="custom-select-item">
                <template #title>
                  <div class="select-item">
                    <h6>{{ data.item.raw.city }}</h6>
                    <div class="d-flex align-center justify-space-between">
                      <div class="select-item-content d-flex align-center mt-1">
                        <span class="mdi mdi-airplane air-icon"></span>
                        <span class="select-text ml-2 text-truncate" style="max-width: 190px">
                          {{ data.item.raw.name }}
                        </span>
                      </div>
                      <span class="select-key-word">
                        {{ data.item.raw.code }}
                      </span>
                    </div>
                  </div>
                </template>
              </v-list-item>
            </template>
            <template #selection="data">
              <div class="transport-place-container">
                <div class="transport-place">
                  <div class="transport-title text-caption font-weight-light">
                    From
                  </div>
                  <div class="transport-content">
                    <div class="d-flex align-center justify-space-between">
                      <h2>{{ data.item?.raw?.city }}</h2>
                      <div class="key-word" v-if="data.item.raw.code">
                        {{ data.item.raw.code }}
                      </div>
                    </div>
                    <p class="font-weight-light">
                      {{ data.item.raw.name || "Select Your Origin" }}
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </v-select>
        </div>

        <div class="reverse-trip">
          <v-btn class="reverse-btn" icon="mdi-autorenew" size="x-small" rounded="xl" @click="reverseTrip"></v-btn>
        </div>

        <div class="transport-wrap">
          <v-select v-model="destinationPlaceholder" item-value="value" item-title="city" :items="destinationList"
            variant="plain" return-object density="compact" theme="dark">
            <template #item="data">
              <v-list-item v-bind="data.props" class="custom-select-item">
                <template #title>
                  <div class="select-item">
                    <h6>{{ data.item.raw.city }}</h6>
                    <div class="d-flex align-center justify-space-between">
                      <div class="select-item-content d-flex align-center mt-1">
                        <span class="mdi mdi-airplane air-icon"></span>
                        <span class="select-text ml-2 text-truncate" style="max-width: 190px">
                          {{ data.item.raw.name }}
                        </span>
                      </div>
                      <span class="select-key-word">
                        {{ data.item.raw.code }}
                      </span>
                    </div>
                  </div>
                </template>
              </v-list-item>
            </template>
            <template #selection="data">
              <div class="transport-place-container">
                <div class="transport-place">
                  <div class="transport-title text-caption font-weight-light">
                    To
                  </div>
                  <div class="transport-content">
                    <div class="d-flex align-center justify-space-between">
                      <h2>{{ data.item?.raw?.city }}</h2>
                      <div class="key-word" v-if="data.item.raw.code">
                        {{ data.item.raw.code }}
                      </div>
                    </div>
                    <p class="font-weight-light">
                      {{ data.item.raw.name || "Select Your Destination" }}
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </v-select>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <v-btn class="mobile-menu-btn d-md-none" icon="mdi-menu" variant="text" color="white" 
             @click="mobileMenuOpen = !mobileMenuOpen"></v-btn>

      <!-- Desktop Right Content -->
      <div class="header-right-content d-none d-md-flex align-center">
        <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition">
          <template v-slot:activator="{ props }">
            <div class="add-guest" v-bind="props">
              <div class="guest-container">
                <div class="guest-title text-grey-darken-1">Guests</div>
                <div class="guest-content d-flex justify-space-between align-center">
                  <h2 class="text-h4 text-grey-lighten-2 font-weight-regular">
                    {{ addGuest[0].value }}
                  </h2>
                  <span class="mdi mdi-chevron-down"></span>
                </div>
              </div>
            </div>
          </template>
          <v-card color="black" class="guest-plate" width="380" max-height="440" rounded="0">
            <div v-for="(item, index) in addGuest" :key="index" class="plate-item">
              <div class="d-flex justify-space-between align-center">
                <h3 class="text-h5 font-weight-regular text-white">
                  {{ item.title }}
                </h3>
                <CounterPlate v-model:count="item.value" :disableIncrement="shouldDisable(item.title, true)"
                  :disableDecrement="false" />
              </div>
              <p class="guest-text text-grey-darken-1">
                {{ item.description }}
              </p>
            </div>
            <v-card-actions class="guest-action d-flex justify-end">
              <v-btn variant="text" size="small" @click="menu = false">
                Done
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <div class="d-none d-md-flex align-center">
          <v-switch v-model="isRoundTrip" class="custom-switch vertical-switch mr-3" hide-details>
            <template #thumb></template>
          </v-switch>
          <div>
            <div class="text-body-2 font-weight-medium cursor-pointer"
              :class="!isRoundTrip ? 'text-white' : 'text-grey-darken-1'" @click="isRoundTrip = false">
              One Way
            </div>
            <div class="text-body-2 font-weight-medium cursor-pointer mt-1"
              :class="isRoundTrip ? 'text-white' : 'text-grey-darken-1'" @click="isRoundTrip = true">
              Round Trip
            </div>
          </div>
        </div>

        <v-btn class="next-btn" icon="mdi-arrow-right" size="large" rounded="lg" @click="searchFlight"
          :disabled="isSearchDisabled"></v-btn>

        <v-menu v-model="dashboardMenu" :close-on-content-click="false" :close-on-click="false" location="bottom">
          <template v-slot:activator="{ props }">
            <div class="dashboard-menu-btn" v-bind="props">
              <v-btn density="comfortable" variant="text" color="white" icon="mdi-menu" size="large"
                rounded="lg"></v-btn>
            </div>
          </template>
          <v-card min-width="240" color="black" class="dashboard-menu-card" max-height="440">
            <div class="dashboard-menu">
              <v-list-item v-if="userData?.user" class="py-3 profile-menu" :prepend-avatar="userData.user.avatar ||
                `https://ui-avatars.com/api/?name=${userData.user.name}&background=random&color=fff`
                " :subtitle="`${userData.user.email}`" :title="userData.user.name" @click="toProfile">
                <template v-slot:append></template>
              </v-list-item>
              <ul class="text-end">
                <li v-if="!userData?.user" class="text-subtitle font-weight-medium text-grey-lighten-2">
                  <router-link to="/signin">Login</router-link>
                </li>
                <li class="text-subtitle font-weight-medium text-grey-lighten-2">
                  <router-link to="/flight">Book Trip</router-link>
                </li>
                <li class="text-subtitle font-weight-medium text-grey-lighten-2">
                  <router-link to="/my-trip">My Trips</router-link>
                </li>
                <li v-if="userData?.user" class="text-subtitle font-weight-medium text-grey-lighten-2">
                  <a @click="onLogout">Log Out</a>
                </li>
              </ul>
            </div>
          </v-card>
        </v-menu>
      </div>
    </div>

    <!-- Mobile Menu Content -->
    <div v-if="mobileMenuOpen" class="mobile-menu-content d-md-none">
      <div class="mobile-user-menu">
        <v-list>
          <v-list-item v-if="userData?.user" @click="toProfile">
            <template #prepend>
              <v-avatar :image="userData.user.avatar ||
                `https://ui-avatars.com/api/?name=${userData.user.name}&background=random&color=fff`" size="40"></v-avatar>
            </template>
            <v-list-item-title>{{ userData.user.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ userData.user.email }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item v-if="!userData?.user" to="/signin">
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>
          <v-list-item to="/flight">
            <v-list-item-title>Book Trip</v-list-item-title>
          </v-list-item>
          <v-list-item to="/my-trip">
            <v-list-item-title>My Trips</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="userData?.user" @click="onLogout">
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Base Header Styles */
.header {
  background-color: #000000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.header.scrolled {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 60px;
  max-width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  height: 100%;
  min-width: 100px;
}

.logo-img {
  width: 100px;
  max-height: 40px;
  object-fit: contain;
}

/* Desktop Styles */
@media (min-width: 960px) {
  .header {
    height: 90px;
    border-radius: 16px;
    margin: 0 32px;
    top: 24px;
    border: 1px solid #a6acb53f;
  }

  .header.scrolled {
    top: 0;
    margin: 0;
    border-radius: 0;
    border: 1px solid transparent;
    border-bottom: 1px solid #a6acb53f;
  }

  .header-container {
    padding: 0 20px;
  }

  .transport-wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    margin: 0 20px;
  }

  /* Keep all your existing desktop styles */
  .transport-place-container {
    height: 100%;
    width: 100%;
  }

  .transport-place {
    width: 100%;
    height: 100%;
  }

  .transport-title {
    font-size: 12px;
    color: #fafafa;
    line-height: 18px;
  }

  .transport-content {
    color: #fff;
  }

  .transport-content h2 {
    font-weight: 400;
    font-size: 24px;
  }

  .transport-content p {
    font-size: 12px;
    color: #a4a3a3;
    line-height: 16px;
  }

  .transport-content .key-word {
    font-size: 22px;
    color: #a4a3a3;
  }

  .select-key-word {
    font-size: 16px;
    color: #a4a3a3;
  }

  .reverse-trip {
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }

  .reverse-trip::after {
    content: "";
    position: absolute;
    width: 1px;
    height: 100%;
    background-color: #6c7a908e;
    z-index: -1;
  }

  .header-right-content {
    height: 100%;
    min-width: 400px;
    justify-content: flex-end;
    gap: 16px;
  }

  .add-guest {
    cursor: pointer;
    height: 100%;
    border-left: 1px solid #6c7a908e;
    border-right: 1px solid #6c7a908e;
    padding: 0 16px;
  }

  .next-btn {
    background-color: #657ca2;
    color: #ffffff;
    font-size: 44px;
    height: 80%;
    min-width: 80px;
  }
}

/* Mobile Styles */
.mobile-menu-btn {
  color: white;
  margin-left: auto;
}

.mobile-menu-content {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  background-color: #000;
  padding: 0 16px 16px 16px;
  border-top: 1px solid #333;
  z-index: 999;
  max-height: calc(100vh - 60px);
  overflow-y: auto;
}

.mobile-transport-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.mobile-reverse-trip {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}

.mobile-reverse-trip .reverse-btn {
  transform: rotate(90deg);
}

.mobile-trip-toggle {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.mobile-trip-toggle .v-btn {
  flex: 1;
}

.mobile-guest-selector {
  margin: 16px 0;
}

.mobile-search-btn {
  margin: 16px 0;
}

.mobile-user-menu {
  border-top: 1px solid #333;
  padding-top: 16px;
}

/* Responsive Adjustments */
@media (max-width: 600px) {
  .logo-img {
    width: 140px;
  }

  .header-container {
    padding: 0 12px;
  }
}

@media (max-width: 400px) {
  .logo-img {
    width: 140px;
  }
}

.custom-select-item {
  border-top: 1px solid #c3c3c333;
}

.custom-select-item:hover {
  background-color: #cee8f414;
}

.select-item-content {
  position: relative;
  left: 0;
  transition: left 0.3s ease;
}

.custom-select-item:hover .select-item-content {
  left: 10px;
}

.air-icon {
  color: #7184a2;
  font-size: 22px;
}

.guest-text {
  font-size: 12px;
  max-width: 220px;
}

.select-item {
  padding: 10px 0;
}

.guest-title {
  font-size: 14px;
}

.dashboard-menu-btn {
  height: 100%;
  display: flex;
  align-items: center;
}

.dashboard-menu ul li {
  border-top: 1px solid #c3c3c334;
  width: 100%;
  cursor: pointer;
}

.dashboard-menu ul li a {
  display: block;
  width: 100%;
  height: 100%;
  padding: 18px 20px;
}

.dashboard-menu ul li:hover {
  background-color: #adcede2c;
}

.select-item h6 {
  font-size: 12px;
  color: #a4a3a3;
  line-height: 16px;
  font-weight: 400;
}

.transport-wrap {
  height: 100%;
  width: 100%;
}

.select-text {
  font-weight: 400;
  font-size: 20px;
}

.plate-item {
  border-bottom: 1px solid #bbbfc429;
  padding: 20px 0;
}

.vertical-switch {
  transform: rotate(90deg);
  transform-origin: center center;
}

.switch-check {
  transform: rotate(-90deg);
  transform-origin: center center;
  color: white;
}

::v-deep(.v-switch__track) {
  padding: 0 5px;
  height: 25px;
  opacity: 0.8;
  min-width: 50px;
}

::v-deep(.v-switch__thumb) {
  background-color: #8599b9;
}

::v-deep(.v-overlay-container) {
  display: none !important;
}
</style>