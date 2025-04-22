<script setup>
import { useFlightStore } from "@/stores/useFlight";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { url } from "@/plugins/baseUrl";
import { useAxios } from "@vueuse/integrations/useAxios";
import { useRoute, useRouter } from "vue-router";

const flightStore = useFlightStore();
const { originData } = storeToRefs(flightStore);
const originList = computed(() => originData.value);
const destinationList = computed(() => destinationData.value);

const route = useRoute();
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
      destinationPlaceholder.value = newVal[0]; // Auto-select if only one
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
  return addGuest.value.reduce((sum, item) => sum + item.value, 0);
});

const isRoundTrip = ref(false);
const isSearchDisabled = computed(() => {
  return !originPlaceholder.value?.id || !destinationPlaceholder.value?.id;
});

async function searchFlight() {
  await flightStore.searchFlightExecute(
    `https://appsdevelopmentfirm.agency/admin/site/api/flights?origin_id=${
      originPlaceholder.value.id
    }&destination_id=${destinationPlaceholder.value.id}&departure_date=&trip=${
      isRoundTrip ? "twoway" : "oneway"
    }`
  );
  // console.log(flightStore.flightList);
  // router.push({ path: "departure" });
}
</script>

<template>
  <div class="header">
    <router-link to="/" class="logo">
      <v-img
        src="/public/images/logo/logo.png"
        max-height="20"
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
                <div class="transport-title text-caption">From</div>
                <div class="transport-content">
                  <div class="d-flex align-center justify-space-between">
                    <h2>{{ data.item?.raw?.city }}</h2>
                    <div class="key-word" v-if="data.item.raw.code">
                      {{ data.item.raw.code }}
                    </div>
                  </div>
                  <p>{{ data.item.raw.name || "Select Your Origin" }}</p>
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
                <div class="transport-title text-caption">To</div>
                <div class="transport-content">
                  <div class="d-flex align-center justify-space-between">
                    <h2>{{ data.item?.raw?.city }}</h2>
                    <div class="key-word" v-if="data.item.raw.code">
                      {{ data.item.raw.code }}
                    </div>
                  </div>
                  <p>{{ data.item.raw.name || "Select Your Destination" }}</p>
                </div>
              </div>
            </div>
          </template>
        </v-select>
      </div>
    </div>

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
                {{ totalGuests }}
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
        <div v-for="(item, index) in addGuest" :key="index" class="plate-item">
          <div class="d-flex justify-space-between align-center">
            <h3 class="text-h5 font-weight-regular text-white">
              {{ item.title }}
            </h3>
            <CounterPlate v-model:count="item.value" />
          </div>
          <p class="guest-text text-grey-darken-1">{{ item.description }}</p>
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
          <span class="switch-check mdi mdi-check"></span>
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
          class="text-body-2 font-weight-medium cursor-pointer"
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

    <v-btn density="comfortable" icon="mdi-menu" rounded="lg"></v-btn>
  </div>
</template>

<style scoped>
.header {
  height: 90px;
  width: 95%;
  max-width: 1440px;
  border: 1px solid #a6acb53f;
  background-color: #000000;
  position: fixed;
  top: 20px;
  left: 50%;
  border-radius: 16px;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.logo {
  border-right: 1px solid #a6acb541;
  height: 100%;
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
}
.transport-place-container {
  height: 100%;
  width: 220px;
}
.transport-place {
  width: 100%;
  height: 100%;
}
.transport-title {
  font-size: 12px;
  color: #c0bfbf;
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
}
::v-deep(.v-input) {
  height: 100%;
}
.custom-select-item {
  border-top: 1px solid #c3c3c333;
  /* transition: background-color 0.3s ease; */
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
.select-item h6 {
  font-size: 12px;
  color: #a4a3a3;
  line-height: 16px;
  font-weight: 400;
}
.transport-wrap {
  height: 100%;
}
.select-text {
  font-weight: 400;
  font-size: 20px;
}
.next-btn {
  background-color: #657ca2;
  color: #fff;
  font-size: 24px;
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
  border-left: 1px solid #a6acb541;
  border-right: 1px solid #a6acb541;
}
.guest-container {
  height: 100%;
  width: 100px;
  padding: 10px 10px;
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
  background-color: #6d92cf;
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
