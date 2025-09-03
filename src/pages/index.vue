<script setup>
import AppFooter from "@/components/AppFooter.vue";
import Header from "@/components/header/Header.vue";
import CommonSection from "@/components/home/CommonSection.vue";
import DarkFeature from "@/components/home/DarkFeature.vue";
import Explore from "@/components/home/Explore .vue";
import Feature from "@/components/home/Feature.vue";
import Hero from "@/components/home/Hero.vue";
import Package from "@/components/home/Package.vue";
import Traveling from "@/components/home/Traveling.vue";
import Loader from "@/components/Loader.vue";
import { useContentStore } from "@/stores/useContent";

const content = useContentStore();
content.fetchHomepage();
</script>

<template>
  <Loader v-if="content.loadingHomepage" />

  <div v-else-if="!content.loadingHomepage">
    <Header />
    <Hero v-if="content.heroSection" :data="content.heroSection" />
    <Feature v-if="content.featureSection" :data="content.featureSection" />
    <Explore v-if="content.exploreSection" :data="content.exploreSection" />
    <Traveling
      v-if="content.travelingSection"
      :data="content.travelingSection"
    />
    <Package v-if="content.packageSection" :data="content.packageSection" />
    <DarkFeature v-if="content.safetySection" :data="content.safetySection" />
    <CommonSection />
    <AppFooter />
  </div>
</template>
