<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()


const items = [
  {
    title: "GOT - BMA",
    disabled: false,
  },
  {
    title: "One Way",
    disabled: false,
  },
  {
    title: "1 Pax",
    disabled: false,
  },
];
</script>

<template>
  <v-container>
    <div class="sub-header d-flex align-center justify-space-between">
      <v-tooltip text="Go Back" location="bottom">
        <template #activator="{ props }">
          <v-btn
            density="comfortable"
            size="large"
            variant="tonal"
            color="#6d92cf"
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
  </v-container>
</template>

<style scoped>
::v-deep(.v-breadcrumbs) {
  padding: 0px;
}
::v-deep(.v-breadcrumbs-item) {
  color: #52627b;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
}

::v-deep(.v-breadcrumbs-item:first-child) {
  background-color: #6d93cf25;
  font-weight: 700;
  padding: 4px 10px;
}
</style>
