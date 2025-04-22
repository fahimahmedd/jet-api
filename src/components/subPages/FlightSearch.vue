<script setup>
import { useFlightStore } from "@/stores/useFlight";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { url } from "@/plugins/baseUrl";
import { useAxios } from "@vueuse/integrations/useAxios";
import { useRoute, useRouter } from "vue-router";

const isRoundTrip = ref(false);
const guestModal = ref(false);

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

// Guest data
const addGuest = ref([
  {
    title: "Adult",
    description: "Ages 2+",
    value: 1,
  },
  {
    title: "Infants",
    description: "Ages 2–12",
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
const filteredGuest = computed(() => addGuest.value.slice(1));
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
  console.log(flightStore.flightList);
  // router.push({ path: "departure" });
}
</script>

<template>
  <div class="flight-container">
    <v-radio-group
      v-model="isRoundTrip"
      class="trip-toggle"
      hide-details
      inline
    >
      <v-radio
        label="One Way"
        :value="false"
        :class="['radio-option pb-3', !isRoundTrip ? 'active-border' : '']"
      />
      <v-radio
        label="Round Trip"
        :value="true"
        :class="['radio-option pb-3', isRoundTrip ? 'active-border' : '']"
      />
    </v-radio-group>

    <div class="transport-relative">
      <v-select
        v-model="originPlaceholder"
        item-value="value"
        item-title="city"
        :items="originList"
        variant="plain"
        return-object
        density="compact"
        hide-details
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
              <div class="transport-title text-subtitle">From</div>
              <div class="transport-content">
                <div class="d-flex align-center justify-space-between">
                  <h2 class="text-black">{{ data.item?.raw?.city }}</h2>
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
      <!-- <div class="reverse-trip">
        <v-btn
          class="reverse-btn"
          icon="mdi-autorenew"
          size="x-small"
          rounded="xl"
        ></v-btn>
      </div> -->
      <v-select
        v-model="destinationPlaceholder"
        item-value="value"
        item-title="city"
        :items="destinationList"
        variant="plain"
        return-object
        density="compact"
        hide-details
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
              <div class="transport-title text-subtitle">To</div>
              <div class="transport-content">
                <div class="d-flex align-center justify-space-between">
                  <h2 class="text-black">{{ data.item?.raw?.city }}</h2>
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

    <div v-if="addGuest.length" class="plate-item">
      <div class="d-flex justify-space-between align-center">
        <h3 class="text-h5 font-weight-regular text-black">
          {{ addGuest[0].title }}
        </h3>
        <CounterPlate v-model:count="addGuest[0].value" />
      </div>
      <p class="text-caption-2 text-grey-darken-2" style="max-width: 320px">
        {{ addGuest[0].description }}
      </p>
    </div>

    <div class="plate-item cursor-pointer" @click="guestModal = true">
      <div class="d-flex justify-space-between align-center">
        <h3 class="text-h6 font-weight-regular text-black">Add More Guest</h3>
        <span class="mdi mdi-menu-down text-h5 text-grey-darken-2"></span>
      </div>
      <p class="text-caption-2 text-grey-darken-2">Choose pet option</p>
    </div>

    <v-btn
        class="booking-btn mt-5"
        variant="outlined"
        rounded="xl"
        color="#fff"
        size="large"
        block
        @click="searchFlight"
        :disabled="isSearchDisabled"
        >Search FLight</v-btn
      >
  </div>

  <!-- Modal List -->
  <transition name="slide-up">
    <div v-if="guestModal" class="modal-container">
      <div class="modal-content">
        <div class="d-flex justify-space-between align-center pb-3">
          <div class="text-h6 font-weight-medium">Add Guest</div>
          <v-btn
            density="comfortable"
            variant="tonal"
            size="small"
            color="#6d92cf"
            icon="mdi-close"
            rounded="md"
            @click="guestModal = false"
          ></v-btn>
        </div>

        <div
          v-for="(item, index) in filteredGuest"
          :key="index"
          class="plate-item"
        >
          <div class="d-flex justify-space-between align-center">
            <h3 class="plate-text font-weight-medium text-black">
              {{ item.title }}
            </h3>
            <CounterPlate v-model:count="item.value" />
          </div>
          <p class="text-caption-2 text-grey-darken-2" style="max-width: 350px">
            {{ item.description }}
          </p>
        </div>

        <v-btn
          class="booking-btn mt-5"
          variant="outlined"
          rounded="xl"
          color="#fff"
          size="large"
          block
          @click="guestModal = false"
          >Complete
        </v-btn>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.booking-btn {
  background-color: #000;
}
.flight-container {
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.radio-option {
  width: 50%;
  font-size: 20px;
  border-bottom: 1px solid #d8d8d8;
}
.active-border {
  border-bottom: 2px solid rgb(240, 32, 17);
}
::v-deep(.v-selection-control__wrapper) {
  display: none;
}
::v-deep(.trip-toggle .v-label) {
  font-size: 20px !important;
  font-weight: 300;
}
.transport-place-container {
  width: 100%;
  cursor: pointer;
}
.transport-place {
  width: 100%;
  height: 100%;
}
.transport-title {
  font-size: 14px;
  color: #1d1d1d;
  line-height: 18px;
  font-weight: 300;
  margin-bottom: 3px;
}

.transport-content h2 {
  font-weight: 400;
  font-size: 28px;
}
.transport-content p {
  font-size: 13px;
  color: #3d3d3d;
  line-height: 16px;
}
.transport-content .key-word {
  font-size: 22px;
  color: #747474;
}
.select-key-word {
  font-size: 18px;
  color: #505050;
}
.transport-content .key-word span {
  color: #525252;
  font-size: 26px;
}

.modal-container {
  height: 100%;
  width: 100%;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
}
.modal-content {
  height: 600px;
  max-width: 500px;
  margin: 80px auto 0;
}
.select-item {
  padding: 10px 0;
}
.select-item h6 {
  font-size: 12px;
  color: #a4a3a3;
  line-height: 16px;
  font-weight: 400;
}
.select-text {
  font-weight: 400;
  font-size: 20px;
}
.custom-select-item {
  border-top: 1px solid #bbbfc463;
  padding: 6px 0;
}

.select-item-content {
  position: relative;
  left: 0;
  transition: left 0.3s ease;
}
.custom-select-item:hover .select-item-content {
  left: 10px;
}
.custom-select-item:hover .hover-content {
  background-color: #f3f3f3;
}
.air-icon {
  color: #7184a2;
  font-size: 22px;
}
.hover-content {
  padding: 5px 8px 5px 0;
  margin-top: 5px;
  border-radius: 8px;
  cursor: pointer;
}
/* Transition Classes */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
::v-deep(.v-field) {
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #d8d8d8;
}
::v-deep(.v-select__selection) {
  width: 100%;
}

.plate-item {
  border-bottom: 1px solid #bbbfc479;
  padding: 20px 0;
}
.plate-text {
  font-size: 18px;
}
.transport-relative {
  position: relative;
}
.reverse-btn {
  background-color: #000;
  color: #fff;
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
}

@media (max-width: 767px) {
  .plate-item-wrapper {
    display: grid !important;
  }
  .plate-50 {
    width: 100%;
  }
  .plate-item-wrapper p {
    display: none;
  }
}
</style>
