<script setup>
import GuestForm from "@/components/subPages/GuestForm.vue";
import SubHeader from "@/components/subPages/SubHeader.vue";
</script>

<template>
  <div class="subpage-container">
    <v-row no-gutters>
      <v-col cols="12" lg="5" md="4">
        <div
          class="subpage-left"
          style="background-image: url('/images/subPage/seat.svg')"
        >
          <router-link to="/">
            <div class="logo">
              <v-img src="/images/logo/logo.png" max-width="130"></v-img>
            </div>
          </router-link>

          <h3 class="text-grey-lighten-2 font-weight-regular">
            let's Checkout your Trip!
            <strong class="text-white">Stockholm</strong>
          </h3>
        </div>
      </v-col>
      <v-col cols="12" lg="7" md="8">
        <div class="subpage-content">
          <SubHeader />
          <v-container>
            <div class="guest-form">
              <h2 class="text-black font-weight-medium text-h4 mt-5">
                Checkout
              </h2>
              <CheckOut />
            </div>
          </v-container>
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
  font-size: 24px;
  margin-top: 120px;
}

.gap {
  gap: 18px;
}

.subpage-content {
  padding-left: 20px;
}

.placeholder-text {
  position: relative;
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
