<script setup>
import { useFlightStore } from "@/stores/useFlight";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { url } from "@/plugins/baseUrl";
import { useAxios } from "@vueuse/integrations/useAxios";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUser";
import { useAuthStore } from "@/stores/useAuth";

const dashboardMenu = ref(false);

const flightStore = useFlightStore();
const userStore = useUserStore();
const { originData } = storeToRefs(flightStore);
const originList = computed(() => originData.value);
const destinationList = computed(() => destinationData.value);

const router = useRouter();

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
  let originTmp = originPlaceholder.value;
  let destinationTmp = destinationPlaceholder.value;
  originPlaceholder.value = destinationTmp;
  destinationPlaceholder.value = originTmp;
}
// Total guest count
const totalGuests = computed(() => {
  return addGuest.value[0].value; // Only count adults
});

const isRoundTrip = ref(false);

const isSearchDisabled = computed(() => {
  return !originPlaceholder.value?.id || !destinationPlaceholder.value?.id;
});

async function searchFlight() {
  try {
    await flightStore.searchFlightExecute(
      `${url}/flights?origin_id=${originPlaceholder.value.id}&destination_id=${
        destinationPlaceholder.value.id
      }&departure_date=&trip=${isRoundTrip.value ? "return" : "oneway"}`,
      originPlaceholder.value.code,
      destinationPlaceholder.value.code,
      totalGuests.value
    );
    
    // Clear any previous flight selections
    flightStore.selectedOutboundFlight = null;
    flightStore.selectedReturnFlight = null;
    sessionStorage.removeItem('outboundFlight');
    sessionStorage.removeItem('returnFlight');
    
    router.push({ path: "outbound-departure" });
  } catch (error) {
    console.error("Search failed:", error);
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
</script>

<template>
  <div :class="['header', { scrolled: isScrolled }]">
    <router-link to="/" class="logo">
      <v-img
        src="/public/images/logo/logo.png"
        max-height="40"
        contain
        class="logo-img"
      ></v-img>
    </router-link>

    <!-- Origin -->
    <div class="transport-wrapper d-none d-md-flex">
      <div class="transport-wrap">
        <v-select
          v-model="originPlaceholder"
          item-value="value"
          item-title="city"
          :items="originList"
          variant="plain"
          return-object
          density="compact"
          hide-details
          theme="dark"
        >
          <template #item="data">
            <v-list-item v-bind="data.props" class="custom-select-item">
              <template #title>
                <div class="select-item">
                  <h6>{{ data.item.raw.city }}</h6>
                  <div class="d-flex align-center justify-space-between">
                    <div class="select-item-content d-flex align-center mt-1">
                      <span class="mdi mdi-airplane air-icon"></span>
                      <span
                        class="select-text ml-2 text-truncate"
                        style="max-width: 190px"
                      >
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

      <!-- Reverse Trip -->
      <div class="reverse-trip">
        <v-btn
          class="reverse-btn"
          icon="mdi-autorenew"
          size="x-small"
          rounded="xl"
          @click="reverseTrip"
        ></v-btn>
      </div>

      <!-- Destination -->
      <div class="transport-wrap">
        <v-select
          v-model="destinationPlaceholder"
          item-value="value"
          item-title="city"
          :items="destinationList"
          variant="plain"
          return-object
          density="compact"
          theme="dark"
        >
          <template #item="data">
            <v-list-item v-bind="data.props" class="custom-select-item">
              <template #title>
                <div class="select-item">
                  <h6>{{ data.item.raw.city }}</h6>
                  <div class="d-flex align-center justify-space-between">
                    <div class="select-item-content d-flex align-center mt-1">
                      <span class="mdi mdi-airplane air-icon"></span>
                      <span
                        class="select-text ml-2 text-truncate"
                        style="max-width: 190px"
                      >
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
    <div class="h-100">
      <div class="header-right-content d-flex align-center">
        <!-- Guest -->
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
        >
          <template v-slot:activator="{ props }">
            <div class="add-guest d-none d-md-flex" v-bind="props">
              <div class="guest-container">
                <div class="guest-title text-grey-darken-1">Guests</div>
                <div
                  class="guest-content d-flex justify-space-between align-center"
                >
                  <h2 class="text-h4 text-grey-lighten-2 font-weight-regular">
                    {{ addGuest[0].value }}
                    <!-- Show only adults count -->
                  </h2>
                  <span class="mdi mdi-chevron-down"></span>
                </div>
              </div>
            </div>
          </template>
          <v-card
            color="black"
            class="guest-plate"
            width="380"
            max-height="440"
            rounded="0"
          >
            <div
              v-for="(item, index) in addGuest"
              :key="index"
              class="plate-item"
            >
              <div class="d-flex justify-space-between align-center">
                <h3 class="text-h5 font-weight-regular text-white">
                  {{ item.title }}
                </h3>
                <CounterPlate
                  v-model:count="item.value"
                  :disableIncrement="shouldDisable(item.title, true)"
                  :disableDecrement="false"
                />
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

        <!-- Round trip -->
        <div class="d-none d-md-flex align-center">
          <!-- Vertical Switch -->
          <v-switch
            v-model="isRoundTrip"
            class="custom-switch vertical-switch mr-3"
            hide-details
          >
            <template #thumb>
              <!-- <span class="switch-check mdi mdi-check"></span> -->
            </template>
          </v-switch>

          <!-- Labels -->
          <div>
            <div
              class="text-body-2 font-weight-medium cursor-pointer"
              :class="!isRoundTrip ? 'text-white' : 'text-grey-darken-1'"
              @click="isRoundTrip = false"
            >
              One Way
            </div>
            <div
              class="text-body-2 font-weight-medium cursor-pointer mt-1"
              :class="isRoundTrip ? 'text-white' : 'text-grey-darken-1'"
              @click="isRoundTrip = true"
            >
              Round Trip
            </div>
          </div>
        </div>

        <!-- <router-link to="/departure"> -->
        <v-btn
          class="next-btn d-none d-md-flex"
          icon="mdi-arrow-right"
          size="large"
          rounded="lg"
          @click="searchFlight"
          :disabled="isSearchDisabled"
        ></v-btn>

        <v-menu
          v-model="dashboardMenu"
          :close-on-content-click="false"
          :close-on-click="false"
          location="bottom"
        >
          <template v-slot:activator="{ props }">
            <div class="dashboard-menu-btn" v-bind="props">
              <v-btn
                density="comfortable"
                variant="text"
                color="white"
                icon="mdi-menu"
                size="large"
                rounded="lg"
              ></v-btn>
            </div>
          </template>

          <v-card
            min-width="240"
            color="black"
            class="dashboard-menu-card"
            max-height="440"
          >
            <div class="dashboard-menu">
              <v-list-item
                v-if="userData?.user"
                class="py-3 profile-menu"
                :prepend-avatar="
                  userData.user.avatar ||
                  'https://cdn.vuetifyjs.com/images/john.jpg'
                "
                :subtitle="`${userData.user.email} `"
                :title="userData.user.name"
              >
                <template v-slot:append> </template>
              </v-list-item>

              <ul class="text-end">
                <!-- Show login only when NOT logged in -->
                <li
                  v-if="!userData?.user"
                  class="text-subtitle font-weight-medium text-grey-lighten-2"
                >
                  <router-link to="/signin">Login</router-link>
                </li>
                <li
                  class="text-subtitle font-weight-medium text-grey-lighten-2"
                >
                  <router-link to="/flight">Book Trip</router-link>
                </li>
                <li
                  class="text-subtitle font-weight-medium text-grey-lighten-2"
                >
                  <router-link to="/">My Trips</router-link>
                </li>
                <li
                  v-if="userData?.user"
                  class="text-subtitle font-weight-medium text-grey-lighten-2"
                >
                  <a @click="onLogout">Log Out</a>
                </li>
              </ul>
            </div>
          </v-card>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  height: 90px;
  border: 1px solid #a6acb53f;
  background-color: #000000;
  position: fixed;
  top: 24px;
  left: 32px;
  right: 32px;
  border-radius: 16px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  transition: top 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    left 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    right 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    border-radius 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.header.scrolled {
  width: 100%;
  top: 0px;
  left: 0px;
  right: 0px;
  border-radius: 0px;
  border: 1px solid transparent;
  border-bottom: 1px solid #a6acb53f;
}
.header-right-content {
  height: 100%;
  width: 500px;
  justify-content: space-between;
}
.profile-menu {
  border-bottom: 1px solid #6c7a908e;
}
.h-100 {
  height: 100%;
}
.logo {
  border-right: 1px solid #6c7a908e;
  height: 100%;
  width: 220px;
  display: flex;
  align-items: center;
  padding-right: 20px;
}

.logo-img {
  width: 100px;
}

.transport-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
}

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

.transport-content .key-word span {
  color: #fff;
  font-size: 26px;
}

::v-deep(.v-field) {
  align-items: center !important;
}

::v-deep(.mdi-menu-down) {
  color: #ffffff;
}

::v-deep(.v-field__input) {
  padding-bottom: 10px !important;
  padding-left: 20px;
  padding-right: 20px;
}

::v-deep(.v-input) {
  height: 100%;
}
::v-deep(.v-select__selection) {
  width: 100%;
}
.custom-select-item {
  border-top: 1px solid #c3c3c333;
  /* transition: background-color 0.3s ease; */
}
.dashboard-menu-card {
  margin-top: 1px;
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
.dashboard-menu ul li:first-child {
  border-top: 1px solid transparent;
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

.next-btn {
  background-color: #657ca2;
  color: #ffffff;
  font-size: 44px;
  height: 80%;
  min-width: 100px;
}

.reverse-trip {
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.reverse-btn {
  margin: 0 20px;
}

.add-guest {
  cursor: pointer;
  height: 100%;
  border-left: 1px solid #6c7a908e;
  border-right: 1px solid #6c7a908e;
}

.guest-container {
  height: 100%;
  width: 120px;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.transport-title {
  font-size: 16px;
  font-weight: 500;
  color: #aaa;
}

.guest-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.guest-content h2 {
  margin: 0;
  color: #fff;
}

.guest-content span {
  color: #aaa;
}

.guest-plate {
  padding: 16px 16px 0 16px;
  background-color: #000;
  margin-top: 1px;
  position: relative;
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

@media (max-width: 991px) {
  .header {
    height: 60px;
    width: 95%;
    border-radius: 10px;
    padding: 0 20px;
  }
}
</style>
