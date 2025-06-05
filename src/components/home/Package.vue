<script setup></script>

<template>
  <div class="package py-10 py-sm-16">
    <v-container>
      <h2 class="text-black font-weight-medium text-center text-md-start">The Complete Travel Package</h2>
      <div
        class="package-bg mt-6 mt-sm-10 d-flex align-end"
        style="background-image: url('/images/explore/package-bg.webp')"
      >
        <div class="package-content">
          <h4 class="text-h6 font-weight-regular">Meadowood</h4>
          <p class="text-grey-darken-1 font-weight-regular mt-2 mt-sm-4">
            Experience a fixture of the northern wine country community and recipient of the Michelin Three Key award, nestled in the woodlands of St. Helena.
          </p>
          <v-btn
            class="booking-btn mt-4 mt-sm-6"
            variant="outlined"
            rounded="xl"
            size="large"
             min-width="300"
            :width="$vuetify.display.smAndDown ? '100%' : '100%'"
          >
            Book Now
          </v-btn>
        </div>
      </div>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.package {
  background-color: #fff;
  
  h2 {
    font-size: 36px;
    line-height: 1.2;
  }
}

.package-bg {
  height: 400px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  z-index: 1;
  border-radius: 12px;
  overflow: hidden;
  padding: 50px;
  
  &::after {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
    z-index: -1;
  }
}

.package-content {
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  max-width: 500px;
  
  p {
    font-size: 17px;
    line-height: 1.6;
  }
}

.booking-btn {
  background-color: #000;
  color: #fff;
  font-size: 18px;
  text-transform: capitalize;
  min-height: 48px;
  font-weight: 500;
  letter-spacing: 0.5px;
  border: 2px solid #000 !important;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: transparent !important;
    color: #000 !important;
  }
}

@media (max-width: 1279px) {
  .package {
    h2 {
      font-size: 32px;
    }
  }
  
  .package-content {
    p {
      font-size: 16px;
    }
  }
  
  .booking-btn {
    font-size: 17px;
  }
}

@media (max-width: 959px) {
  .package {
    padding-top: 60px;
    padding-bottom: 60px;
    
    h2 {
      font-size: 28px;
    }
  }
  
  .package-bg {
    height: 350px;
    padding: 30px;
  }
  
  .package-content {
    max-width: 100%;
    text-align: center;
    margin: 0 auto;
    
    p {
      font-size: 15px;
    }
  }
}

@media (max-width: 599px) {
  .package {
    padding-top: 40px;
    padding-bottom: 40px;
    
    h2 {
      font-size: 24px;
    }
  }
  
  .package-bg {
    height: 300px;
    padding: 20px;
  }
  
  .package-content {
    p {
      font-size: 14px;
    }
  }
  
  .booking-btn {
    font-size: 16px;
    min-height: 44px;
  }
}
</style>