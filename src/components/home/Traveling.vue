<script setup></script>

<template>
  <div class="explore py-10 py-sm-16 bg-black">
    <v-container>
      <v-row class="align-center">
        <v-col cols="12" lg="5" md="6" order="2" order-md="1">
          <div class="explore-content">
            <h2 class="text-white font-weight-regular">The Art of Traveling Well</h2>
            <h3 class="text-white font-weight-light mt-2 mt-sm-4">
              Thoughtfully curated to redefine your expectations.
            </h3>
            <p class="font-weight-light text-grey-darken-1 mt-4 mt-sm-6">
              With a shared dedication to hospitality, the brand partners we've
              integrated throughout your journey offer the highest level of
              product integrity, attentive service, and experience to indulge
              the senses from start to finish.
            </p>
          </div>

          <div class="btn-max mt-8 mt-sm-16">
            <router-link to="/flight">
              <v-btn
                class="booking-btn"
                variant="outlined"
                rounded="xl"
                size="large"
                :width="$vuetify.display.smAndDown ? '100%' : '100%'"
                >Book Your Seat</v-btn
              >
            </router-link>
          </div>
        </v-col>
        <v-col cols="12" lg="7" md="6" order="1" order-md="2" class="mb-8 mb-md-0">
          <v-img
            src="/public/images/explore/travel.webp"
            cover
            rounded="xl"
            min-height="300"
            class="explore-image"
          ></v-img>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.explore {
  background-color: #000;
}

.explore-content {
  h2 {
    font-size: 36px;
    line-height: 1.2;
  }
  
  h3 {
    font-size: 18px;
    line-height: 1.4;
  }
  
  p {
    font-size: 17px;
    line-height: 1.6;
    max-width: 500px;
  }
}

.booking-btn {
  background-color: #fff;
  color: #000;
  font-size: 18px;
  text-transform: capitalize;
  min-height: 48px;
  font-weight: 500;
  letter-spacing: 0.5px;
  border: 2px solid #fff !important;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: transparent !important;
    color: #fff !important;
  }
}

.explore-image {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.btn-max {
  max-width: 400px;
}

@media (max-width: 1279px) {
  .explore-content {
    h2 {
      font-size: 32px;
    }
    
    h3 {
      font-size: 17px;
    }
    
    p {
      font-size: 16px;
    }
  }
  
  .booking-btn {
    font-size: 17px;
  }
}

@media (max-width: 959px) {
  .explore {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  
  .explore-content {
    text-align: center;
    
    h2 {
      font-size: 28px;
    }
    
    h3 {
      font-size: 16px;
    }
    
    p {
      margin-left: auto;
      margin-right: auto;
    }
  }
  
  .btn-max {
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 599px) {
  .explore {
    padding-top: 40px;
    padding-bottom: 40px;
  }
  
  .explore-content {
    h2 {
      font-size: 24px;
    }
    
    h3 {
      font-size: 15px;
    }
    
    p {
      font-size: 15px;
    }
  }
  
  .booking-btn {
    font-size: 16px;
    min-height: 44px;
  }
}
</style>