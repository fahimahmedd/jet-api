<script setup>
import SeatBox from "@/components/subPages/SeatBox.vue";
import SubHeader from "@/components/subPages/SubHeader.vue";

const featureItems = [
  {
    img: "/images/feature/feature-icon-1.svg",
    text: "Save precious time by traveling between our private terminals—skip the lines and crowds.",
  },
  {
    img: "/images/feature/feature-icon-2.svg",
    text: "Check in curbside just 20 minutes before your flight and effortlessly board the jet.",
  },
  {
    img: "/images/feature/feature-icon-3.svg",
    text: "Fly in comfort with generous space, Italian leather seats, and a relaxing ambiance.",
  },
  {
    img: "/images/feature/feature-icon-4.svg", 
    text: "Enjoy a premium open bar oboard.",
  },
];


</script>

<template>
  <div class="subpage-container">
    <v-row no-gutters>
      <v-col cols="12" lg="5" md="5">
        <div
          class="subpage-left"
          style="background-image: url('/images/subPage/seat.svg')"
        >
          <router-link to="/">
            <div class="logo">
              <v-img src="/images/logo/logo.png" max-width="220"></v-img>
            </div>
          </router-link>
          <div class="sub-middle-content">
          <h3 class="sub-text-content text-white font-weight-medium">
            Lets fly to Stockholm
          </h3>

          <v-row class="mt-16">
              <v-col
                v-for="(item, id) in featureItems"
                :key="id"
                cols="12"
                xs="12"
                sm="6"
                md="6"
                lg="6"
              >
                <div class="feature-item">
                  <div>
                    <v-img max-width="60" :src="item.img"></v-img>
                  </div>
                  <p class="mt-5">{{ item.text }}</p>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
      <v-col cols="12" lg="7" md="7">
        <div class="subpage-content">
          <SubHeader />
          <div class="sub-container">
          <v-container>
            <h2 class="title-text text-black font-weight-regular mt-10">
              Seating
            </h2>
            <div
              class="placeholder-text text-grey-lighten-1 font-weight-medium title-text mt-10"
            >
              Choose Your Seat
            </div>

            <SeatBox />  
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
.title-text{
  font-size: 40px;
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
}
.sub-text-content{
  max-width: 340px;
  margin: 120px auto 0;
}
.gap {
  gap: 18px;
}
.subpage-content {
  padding-left: 20px;
}
.placeholder-text {
  position: relative;
  top: -50px;
}
.feature-item p {
  font-size: 14px;
  font-weight: 700;
  max-width: 230px;
  color: #fff;
}
.sub-middle-content{
  max-width: 600px;
  margin: 0 auto;
}
@media (max-width: 991px) {
  .feature-item {
    padding: 0px;
  }
}
@media (max-width: 991px) {
  .subpage-left {
    height: auto;
    padding: 20px;
  }
  h3 {
    margin-top: 40px;
  }
  .subpage-content {
    padding-left: 0px;
  }
  .subpage-content h2 {
    font-size: 32px !important;
  }
  .placeholder-text {
    font-size: 30px !important;
  }
}
</style>
