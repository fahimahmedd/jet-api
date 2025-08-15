<script setup>
import { ref } from 'vue';
import { useFlightStore } from '@/stores/useFlight';

const flightStore = useFlightStore();
const couponCode = ref('');

const validateCoupon = async () => {
  if (!couponCode.value.trim()) {
    flightStore.couponError = 'Please enter a coupon code';
    return;
  }
  
  await flightStore.validateCoupon(couponCode.value);
  if (flightStore.coupon) {
    couponCode.value = ''; // Clear input after successful application
  }
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    validateCoupon();
  }
};

// onUnmounted(() => {
//   flightStore.clearCoupon();
// });

</script>

<template>
  <div class="text-caption-1 text-grey-darken-2 font-weight-regular mt-5">
    Have a coupon code?
  </div>
  <v-text-field
    v-model="couponCode"
    density="comfortable"
    label="Apply Coupon Code"
    variant="tonal"
    hide-details
    single-line
    bg-color="#f3f3f3"
    class="mt-3"
    :append-inner-icon="flightStore.isCouponLoading ? 'mdi-loading mdi-spin' : 'mdi-arrow-right'"
    max-width="320"
    rounded="lg"
    @click:append-inner="validateCoupon"
    @keyup="handleKeyPress"
    :disabled="flightStore.isCouponLoading"
  ></v-text-field>
  
   <!-- Success message -->
  <div v-if="flightStore.couponSuccess" class="text-caption mt-2 d-flex align-center ga-1 text-success mt-2">
    <v-icon color="success">mdi-check-circle</v-icon>
    {{ flightStore.couponSuccess }}
  </div>
  
  <!-- Error message -->
  <div v-if="flightStore.couponError" class="text-caption text-error mt-2 d-flex align-center ga-1">
    <v-icon color="error">mdi-alert-circle</v-icon>
    {{ flightStore.couponError }}
  </div>
</template>

<style scoped>

</style>