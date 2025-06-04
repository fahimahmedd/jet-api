<script setup>
const props = defineProps({
  disableIncrement: Boolean,
  disableDecrement: Boolean,
  maxCount: {
    type: Number,
    default: 7 
  }
});

const countNum = defineModel('count');

const increment = () => {
  if (!props.disableIncrement && countNum.value < props.maxCount) countNum.value++;
};

const decrement = () => {
  if (!props.disableDecrement && countNum.value > 0) countNum.value--;
};

// Computed property to check if increment should be disabled
const isMaxCountReached = computed(() => {
  return countNum.value >= props.maxCount;
});
</script>

<template>
  <div class="counter d-flex align-center">
    <v-btn 
      icon="mdi-minus" 
      :disabled="disableDecrement || countNum <= 0" 
      @click="decrement"
      variant="tonal" 
      rounded="sm" 
      density="comfortable" 
      size="small"
    />
    <span class="count-number">{{ countNum }}</span>
    <v-btn 
      icon="mdi-plus" 
      :disabled="disableIncrement || isMaxCountReached"
      @click="increment"
      variant="tonal" 
      rounded="sm" 
      density="comfortable" 
      size="small"
    />
  </div>
</template>

<style scoped>
.count-number{
  width: 40px;
  text-align: center;
  font-size: 26px;
}
</style>