<script setup></script>

<template>
  <div class="common-section py-10 py-sm-16">
    <v-container>
      <v-row class="d-flex align-center">
        <v-col cols="12" lg="6" md="7">
          <div class="feature-content">
            <h2 class="text-grey-darken-1 font-weight-regular">Interested in private charters?</h2>
            <h2 class="text-black font-weight-regular mt-2 mt-sm-4">Fly anywhere, anytime</h2>
            <p class="font-weight-light text-black mt-4 mt-sm-6">
              In addition to our ongoing scheduled routes, Jetshare also offers private charter bookings. Fly with flexibility, convenience and ease, and enjoy our unparalleled service from the comfort of your own jet.
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.common-section {
  background-color: #f3f3f3;
}

.feature-content {
  h2 {
    font-size: 36px;
    line-height: 1.2;
  }
  
  p {
    font-size: 17px;
    line-height: 1.6;
    max-width: 600px;
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

.btn-max {
  max-width: 400px;
}

@media (max-width: 1279px) {
  .feature-content {
    h2 {
      font-size: 32px;
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
  .common-section {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  
  .feature-content {
    text-align: center;
    
    h2 {
      font-size: 28px;
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
  .common-section {
    padding-top: 40px;
    padding-bottom: 40px;
  }
  
  .feature-content {
    h2 {
      font-size: 24px;
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