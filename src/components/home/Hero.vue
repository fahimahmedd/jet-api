<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Autoplay, EffectFade } from "swiper/modules";

const modules = [Autoplay, EffectFade];
</script>

<template>
  <div class="hero-main">
  <swiper
    :spaceBetween="0"
    :effect="'fade'"
    :autoplay="{
      delay: 6500, 
      disableOnInteraction: false,
    }"
    :speed="1200"
    :modules="modules"
    class="mySwiper"
  >
    <swiper-slide>
      <div
        class="hero-slide"
        style="background-image: url('/images/hero/hero-1.jpg')"
      ></div>
    </swiper-slide>
    <swiper-slide>
      <div
        class="hero-slide"
        style="background-image: url('/images/hero/hero-2.jpg')"
      ></div>
    </swiper-slide>
    <swiper-slide>
      <div
        class="hero-slide"
        style="background-image: url('/images/hero/hero-3.jpg')"
      ></div>
    </swiper-slide>
  </swiper>
   <div class="hero-text">
      <div class="container">
        <v-container>
            <h1>Nu är det Officiellt: Flyg direkt till Stockholm, Bromma</h1>
            <h1>Från och med Juni 2025</h1>
            <router-link to="/flight">
            <v-btn class="booking-btn mt-5" append-icon="mdi-arrow-right" variant="outlined"
            rounded="xl" size="large" width="300"
            >Book Your Seat</v-btn>
            </router-link>
        </v-container>
      </div>
   </div>
  </div> 
</template>

<style scoped>
.hero-main{
    position: relative;
}
.hero-slide {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
  position: relative;
  z-index: 1;
}
.hero-slide::after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: -1;
}
.hero-text{
    position: absolute;
    bottom: 40px;
    z-index: 2;
    width: 100%;
}
.hero-text h1{
    color: #fff;
    font-weight: 400;
}
.booking-btn{
    background-color: #d7e1f239;
    color: #fff;
    font-weight: 700;
}

@media (max-width: 991px) {
  .hero-text h1{
    font-size: 26px;
    font-weight: 500;
}
}
</style>
