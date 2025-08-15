<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useSettingStore } from "@/stores/useSetting";
import { Autoplay, EffectFade } from "swiper/modules";
import { storeToRefs } from "pinia";

const settingStore = useSettingStore();
const { settingsData } = storeToRefs(settingStore);
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
          <h1>{{ settingsData?.tagline }}</h1>
          <div class="btn-max">
            <router-link to="/flight">
              <v-btn 
                class="booking-btn mt-5 mt-sm-8" 
                variant="outlined"
                rounded="xl" 
                size="large" 
                :width="$vuetify.display.smAndDown ? '100%' : '400'"
              >
                Book Your Seat
              </v-btn>
            </router-link>
          </div>
        </v-container>
      </div>
    </div>
  </div> 
</template>

<style lang="scss" scoped>
.hero-main {
  position: relative;
}

.hero-slide {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
  min-height: 500px;
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
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
  z-index: -1;
}

.hero-text {
  position: absolute;
  bottom: 40px;
  z-index: 2;
  width: 100%;
}

.hero-text h1 {
  color: #fff;
  font-weight: 400;
  font-size: 25px;
  line-height: 1.4;
  max-width: 700px;
}

.booking-btn {
  background-color: rgba(108, 122, 144, 0.34);
  color: #fff;
  border: 2px solid #6C7A90;
  font-size: 18px;
  text-transform: capitalize;
  min-height: 46px;
  font-weight: 400;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(108, 122, 144, 0.7) !important;
  }
}

.btn-max {
  max-width: 400px;
}

@media (max-width: 1279px) {
  .hero-text h1 {
    font-size: 24px;
  }
  
  .booking-btn {
    font-size: 17px;
  }
}

@media (max-width: 959px) {
  .hero-text {
    bottom: 30px;
    text-align: center;
    
    h1 {
      font-size: 22px;
      margin-left: auto;
      margin-right: auto;
    }
  }
  
  .btn-max {
    margin-left: auto;
    margin-right: auto;
  }
  
  .hero-slide {
    min-height: 450px;
    height: 90vh;
  }
}

@media (max-width: 599px) {
  .hero-text {
    bottom: 20px;
    padding: 0 15px;
    
    h1 {
      font-size: 20px;
      max-width: 100%;
    }
  }
  
  .booking-btn {
    font-size: 16px;
    min-height: 44px;
  }
  
  .hero-slide {
    min-height: 400px;
     height: 90vh;
  }
}
</style>