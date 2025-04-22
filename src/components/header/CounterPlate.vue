<script setup>
  import { ref } from 'vue'
  const countNum = defineModel('count')


  const count = ref(countNum)
  
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    if (count.value > 0) {
      count.value--
    }
  }
  </script>


<template>
      <div class="counter d-flex align-center">
        <v-btn icon="mdi-minus" :disabled="count === 0" @click="decrement" variant="tonal" rounded="sm" density="comfortable" size="small"></v-btn>
        <span class="count-number">
            {{ count }}
        </span>
        <v-btn icon="mdi-plus" @click="increment"  variant="tonal" rounded="sm" density="comfortable" size="small"></v-btn>
      </div>
  </template>
  
  <style scoped>

  .count-number{
   width: 40px;
   text-align: center;
   font-size: 26px;
  }
</style>
  
  