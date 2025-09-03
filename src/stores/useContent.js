// stores/useContent.js
import { url } from "@/plugins/baseUrl";
import { defineStore } from "pinia";
import { useAxios } from "@vueuse/integrations/useAxios";
import { computed } from "vue";

export const useContentStore = defineStore("useContent", () => {
  const {
    execute: fetchHomepage,
    isLoading: loadingHomepage,
    data: homepageData,
    error: homepageError,
  } = useAxios(`${url}/homepage`, { method: "GET" }, { immediate: false });

  const heroSection = computed(() =>
    homepageData.value?.data?.find((section) => section.section_key === "hero")
  );

  const featureSection = computed(() =>
    homepageData.value?.data?.find(
      (section) => section.section_key === "feature"
    )
  );

  const exploreSection = computed(() =>
    homepageData.value?.data?.find(
      (section) => section.section_key === "explore"
    )
  );

  const travelingSection = computed(() =>
    homepageData.value?.data?.find(
      (section) => section.section_key === "traveling"
    )
  );

  const packageSection = computed(() =>
    homepageData.value?.data?.find(
      (section) => section.section_key === "package"
    )
  );

    const safetySection = computed(() =>
    homepageData.value?.data?.find(
      (section) => section.section_key === "safety"
    )
  );

  

  return {
    fetchHomepage,
    loadingHomepage,
    homepageData,
    homepageError,
    heroSection,
    featureSection,
    exploreSection,
    travelingSection,
    packageSection,
    safetySection
  };
});
