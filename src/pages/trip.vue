<script setup>
import SeatBox from "@/components/subPages/SeatBox.vue";
import SubHeader from "@/components/subPages/SubHeader.vue";
</script>

<template>
  <div class="subpage-container">
    <v-row no-gutters class="subpage-row">
      <v-col cols="12" lg="6" md="6">
        <div
          class="subpage-left"
          style="background-image: url('/images/subPage/trip.svg')"
        >
          <router-link to="/">
            <div class="logo">
              <v-img src="/images/logo/logo.png" max-width="180"></v-img>
            </div>
          </router-link>
          <DepartureHistory />
        </div>
      </v-col>
      <v-col cols="12" lg="6" md="6">
        <div class="subpage-content">
          <SubHeader />
          <div class="sub-container">
            <v-container class="content-container">
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
  min-height: 100vh;
  width: 100%;
}

.subpage-row {
  min-height: 100vh;
}

.subpage-left {
  min-height: 100vh;
  width: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  z-index: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
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

.logo {
  margin-bottom: 40px;
}

h3 {
  font-size: 28px;
  margin-top: 120px;
}

.title-text {
  font-size: 40px;
  line-height: 1.2;
}

.gap {
  gap: 18px;
}

.subpage-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sub-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.placeholder-text {
  position: relative;
  top: -30px;
}

/* Large desktop (1200px and up) */
@media (min-width: 1200px) {
  .subpage-content {
    padding: 40px;
  }
}

/* Medium devices (tablets, 992px - 1199px) */
@media (max-width: 1199px) {
  .title-text {
    font-size: 34px;
  }
}

/* Small devices (landscape phones, 768px - 991px) */
@media (max-width: 991px) {
  .subpage-row {
    min-height: auto;
    flex-direction: column;
  }
  
  .subpage-left {
    min-height: auto;
    padding: 30px 20px;
  }
  
  .subpage-content {
    padding: 30px 20px;
  }
  
  .title-text {
    font-size: 30px;
    margin-top: 20px;
  }
  
  h3 {
    margin-top: 60px;
    font-size: 24px;
  }
  
  .logo {
    margin-bottom: 30px;
  }
}

/* Extra small devices (portrait phones, less than 768px) */
@media (max-width: 767px) {
  .subpage-left {
    padding: 25px 15px;
  }
  
  .subpage-content {
    padding: 25px 15px;
  }
  
  .title-text {
    font-size: 26px;
  }
  
  h3 {
    margin-top: 40px;
    font-size: 22px;
  }
  
  .logo {
    margin-bottom: 20px;
  }
  
  .logo .v-img {
    max-width: 150px !important;
  }
}

/* Very small devices (less than 576px) */
@media (max-width: 575px) {
  .subpage-left {
    padding: 20px 12px;
  }
  
  .subpage-content {
    padding: 20px 12px;
  }
  
  .title-text {
    font-size: 24px;
  }
  
  h3 {
    font-size: 20px;
    margin-top: 30px;
  }
  
  .logo .v-img {
    max-width: 130px !important;
  }
}
</style>