<script setup>
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
  <div
    class="feature"
    style="background-image: url('/images/feature/feature-bg.jpg')"
  >
    <v-container>
      <v-row>
        <v-col>
          <div class="feature-content">
            <h2>
              What to Except: <br />
              <span class="text-grey-lighten-1"
                >The Perks of Flying Private</span
              >
            </h2>

            <v-row class="mt-5">
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

            <div class="btn-max">
              <router-link to="/flight">
                <v-btn
                  class="flight-serach-btn booking-btn mt-16"
                  variant="outlined"
                  rounded="xl"
                  size="large"
                  width="400"
                  block
                  >Book Your Seat</v-btn
                >
              </router-link>
            </div>
          </div>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6">
          <div class="feature-img">
            <v-img
              cover
              rounded="xl"
              src="/public/images/feature/feature.jpg"
            ></v-img>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.feature {
  padding: 70px 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  z-index: 1;
}
.feature::after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.89);
  z-index: -1;
}
.feature-content {
  color: #fff;
}
.feature-content h2 {
  font-size: 38px;
  font-weight: 400;
}
.feature-item {
  padding: 20px;
}
.feature-item p {
  font-size: 14px;
  font-weight: 700;
  max-width: 230px;
}
.booking-btn {
    background-color: #fff;
    color: #000;
    font-size: 22px;
    text-transform: capitalize;
    min-height: 48px;
    font-weight: 500;
}

@media (max-width: 991px) {
  .feature-item {
    padding: 0px;
  }
  .feature-item p {
    font-size: 14px;
    font-weight: 700;
    max-width: 100%;
}
}
</style>
