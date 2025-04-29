<script setup>
import AppFooter from '@/components/AppFooter.vue';
import Header from '@/components/header/Header.vue';
import CommonSection from '@/components/home/CommonSection.vue';
import DarkFeature from '@/components/home/DarkFeature.vue';
import Explore from '@/components/home/Explore .vue';
import Feature from '@/components/home/Feature.vue';
import Hero from '@/components/home/Hero.vue';
import Package from '@/components/home/Package.vue';
import Traveling from '@/components/home/Traveling.vue';
import { useFlightStore } from '@/stores/useFlight';

</script>


<template>
   <Header/>
   <Hero/>
   <Feature/>
   <Explore/>
   <Traveling/>
   <Package/>
   <DarkFeature/>
   <CommonSection/>
   <AppFooter/>
</template>
