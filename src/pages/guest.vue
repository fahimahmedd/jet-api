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
            Who will be flying to <strong class="text-white">Stockholm?</strong>
          </h3>
          <div class="guest-list mt-10">
            <h4 class="text-white">Guests</h4>
            <v-btn
              class="guest-item"
              height="auto"
              min-height="unset"
              variant="flat"
              rounded="lg"
              color="#6C7A90"
            >
              <div class="text-left">
                <h5 class="text-h6 text-white font-weight-medium">Adult 1</h5>
                <p class="font-weight-medium text-grey-lighten-2">
                  Missing Information
                </p>
              </div>
            </v-btn>
            <v-btn
              class="guest-item"
              height="auto"
              min-height="unset"
              variant="flat"
              rounded="lg"
              color="#6C7A90"
            >
              <div class="text-left">
                <h5 class="text-h6 text-white font-weight-medium">Adult 2</h5>
                <p class="font-weight-medium text-grey-lighten-2">
                  Missing Information
                </p>
              </div>
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col cols="12" lg="7" md="8">
        <div class="subpage-content">
          <SubHeader />
          <v-container>
            <div class="guest-form">
              <h2 class="text-black font-weight-medium text-h4 mt-5">
                Guest Info
                <span
                  class="placeholder-text text-grey-darken-1 font-weight-medium text-h6 mt-10"
                  >(Adult 1)</span
                >
              </h2>

              <GuestForm />
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

.guest-list {
  max-width: 350px;
}

.guest-item {
  border-radius: 5px;
  margin-top: 12px;
  text-transform: capitalize !important;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 10px 20px;
  width: 100%;
}
.guest-item p {
  font-size: 12px;
}
.guest-form {
  max-width: 560px;
  margin: 0 auto;
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
