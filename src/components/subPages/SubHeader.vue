<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const items = ref([])

const searchParams = JSON.parse(sessionStorage.getItem('searchParams'))
  
  items.value = [
      {
        title: `${searchParams.origin_code} - ${searchParams.destination_code}`,
        disabled: false,
      },
      {
        title: searchParams.trip === 'oneway' ? 'One Way' : 'Round Trip',
        disabled: false,
      },
      {
        title: `${searchParams.totalGuests} ${searchParams.totalGuests === 1 ? 'Pax' : 'Pax'}`,
        disabled: false,
      },
    ]
    
</script>

<template>
  <v-container>
    <div class="sub-container">
      <div class="sub-header d-flex align-center justify-space-between">
        <v-tooltip text="Go Back" location="bottom">
          <template #activator="{ props }">
            <v-btn
              density="compact"
              size="large"
              variant="plain"
              color="black"
              icon="mdi-arrow-left"
              rounded="sm"
              v-bind="props"
              @click="router.back()"
            ></v-btn>
          </template>
        </v-tooltip>

        <div class="route-display">
          <v-breadcrumbs :items="items" divider="|"></v-breadcrumbs>
        </div>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
::v-deep(.v-breadcrumbs) {
  padding: 0px;
}
::v-deep(.v-breadcrumbs-item) {
  color: #52627b;
  font-size: 14px;
  font-weight: 400;
  border-radius: 4px;
}

::v-deep(.v-breadcrumbs-item:first-child) {
  background-color: #6d93cf25;
  font-weight: 700;
  padding: 4px 10px;
}
</style>