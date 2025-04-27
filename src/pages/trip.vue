<script setup>
import SeatBox from "@/components/subPages/SeatBox.vue";
import SubHeader from "@/components/subPages/SubHeader.vue";
</script>

<template>
  <div class="subpage-container">
    <v-row no-gutters>
      <v-col cols="12" lg="6" md="6">
        <div
          class="subpage-left"
          style="background-image: url('/images/subPage/trip.svg')"
        >
          <router-link to="/">
            <div class="logo">
              <v-img src="/images/logo/logo.png" max-width="220"></v-img>
            </div>
          </router-link>
          <DepartureHistory />
        </div>
      </v-col>
      <v-col cols="12" lg="6" md="6">
        <div class="subpage-content">
          <SubHeader />
          <div class="sub-container">
          <v-container>
            <h2 class="title-text text-black font-weight-regular mt-5">
              Trip Summary
            </h2>
            <Coupon />
            <OrderDetail />
          </v-container>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.subpage-container {
  height: 100vh;
  width: 100%;
}

.subpage-left {
  height: 100vh;
  width: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  z-index: 1;
  padding: 30px;
}

.subpage-left::after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: -1;
}
h3 {
  font-size: 28px;
  margin-top: 120px;
}
.title-text{
  font-size: 40px;
}
.gap {
  gap: 18px;
}
.subpage-content {
  padding-left: 20px;
}
.placeholder-text {
  position: relative;
  top: -30px;
}

@media (max-width: 991px) {
  .subpage-container {
  height: auto;
}

.subpage-left {
  height: auto;
}

}
</style>
