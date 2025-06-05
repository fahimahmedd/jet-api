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
      <v-row class="align-center">
        <!-- Content Column -->
        <v-col cols="12" md="7" lg="6" order-md="1" order="2">
          <div class="feature-content">
            <h2>
              What to Expect: <br />
              <span class="text-grey-lighten-1"
                >The Perks of Flying Private</span
              >
            </h2>

            <v-row class="mt-5">
              <v-col
                v-for="(item, id) in featureItems"
                :key="id"
                cols="12"
                sm="6"
                class="feature-col"
              >
                <div class="feature-item d-flex align-start">
                  <div class="feature-icon">
                    <v-img width="50" max-width="50" :src="item.img"></v-img>
                  </div>
                  <p class="ml-4">{{ item.text }}</p>
                </div>
              </v-col>
            </v-row>

            <div class="btn-max mt-8 mt-md-16">
              <router-link to="/flight">
                <v-btn
                  class="flight-search-btn booking-btn"
                  variant="outlined"
                  rounded="xl"
                  size="large"
                  :width="$vuetify.display.mobile ? '100%' : '400'"
                  >Book Your Seat</v-btn
                >
              </router-link>
            </div>
          </div>
        </v-col>

        <!-- Image Column -->
        <v-col cols="12" md="5" lg="6" order-md="2" order="1" class="mb-8 mb-md-0">
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
  
  h2 {
    font-size: 38px;
    font-weight: 400;
    line-height: 1.2;
  }
}

.feature-item {
  padding: 12px 0;
  display: flex;
  align-items: flex-start;
  
  p {
    font-size: 15px;
    font-weight: 500;
    max-width: 100%;
    line-height: 1.5;
    margin-left: 16px;
    margin-top: 4px;
  }
}

.feature-icon {
  flex-shrink: 0;
}

.booking-btn {
  background-color: #fff;
  color: #000;
  font-size: 18px;
  text-transform: capitalize;
  min-height: 48px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.feature-img {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.btn-max {
  max-width: 400px;
}

@media (max-width: 1279px) {
  .feature-content h2 {
    font-size: 34px;
  }
  
  .feature-item p {
    font-size: 14px;
  }
  
  .booking-btn {
    font-size: 17px;
  }
}

@media (max-width: 959px) {
  .feature {
    padding: 60px 0;
  }
  
  .feature-content h2 {
    font-size: 30px;
    text-align: center;
    
    span {
      display: inline-block;
      margin-top: 4px;
    }
  }
  
  .feature-col:nth-child(odd) {
    padding-right: 12px;
  }
  
  .feature-col:nth-child(even) {
    padding-left: 12px;
  }
  
  .btn-max {
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 599px) {
  .feature {
    padding: 50px 0;
  }
  
  .feature-content h2 {
    font-size: 26px;
  }
  
  .feature-item {
    align-items: flex-start;
    text-align: left;
    padding: 16px 0;
    
    p {
      margin-left: 16px !important;
      margin-top: 4px;
    }
  }
  
  .feature-icon {
    width: 50px;
  }
  
  .feature-col {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  
  .booking-btn {
    font-size: 16px;
    min-height: 44px;
  }
}
</style>