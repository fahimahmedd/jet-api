<script setup>
import AppFooter from "@/components/AppFooter.vue";
import Header from "@/components/header/Header.vue";
import { usePagesStore } from "@/stores/usePages";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const pagesStore = usePagesStore();

const page = ref(null);
const loading = ref(false);
const error = ref(null);

const fetchPageData = async (slug) => {
  try {
    loading.value = true;
    error.value = null;
    const { data, error: fetchError } = await pagesStore.fetchPage(
      `${pagesStore.baseUrl}/pages/${slug}`
    );

    if (fetchError.value) {
      throw fetchError.value;
    }

    page.value = data.value;
  } catch (err) {
    error.value = err;
    console.error("Error fetching page:", err);
  } finally {
    loading.value = false;
  }
};

fetchPageData(route.params.slug);

watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
      fetchPageData(newSlug);
    }
  }
);
</script>

<template>
  <div v-if="loading" class="text-center">
    <v-progress-circular indeterminate color="black"></v-progress-circular>
  </div>
  <div v-else-if="error" class="text-center text-error">
    Error loading page: {{ error.message }}
  </div>
  <div v-else-if="page">
    <div class="page-top">
      <Header />
    </div>
    <v-container>
      <div class="page-content">
        <h1>{{ page.title }}</h1>
        <div v-html="page.content"></div>
      </div>
    </v-container>
    <div class="page-bottom">
      <AppFooter />
    </div>
  </div>
  <div v-else class="text-center">Page not found</div>
</template>

<style lang="scss" scoped>
.page-top {
  padding: 80px 0;
  // background-color: #000000;
}

.page-top {
  padding: 50px 0;
  
  .header {
    top: 0;
    margin: 0;
    border-radius: 0;
    border: 1px solid transparent;
    border-bottom: 1px solid #a6acb53f;
  }
}
</style>
