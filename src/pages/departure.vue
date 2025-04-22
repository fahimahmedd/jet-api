<script setup>
import SubHeader from "@/components/subPages/SubHeader.vue";
</script>

<template>
  <div class="subpage-container">
    <v-row no-gutters>
      <v-col cols="12" lg="4" md="12">
        <div
          class="subpage-left"
          style="background-image: url('/images/subPage/departure.svg')"
        >
          <router-link to="/">
            <div class="logo">
              <v-img src="/images/logo/logo.png" max-width="130"></v-img>
            </div>
          </router-link>

          <h3 class="text-grey-lighten-2 font-weight-regular">
            When would you like to depart from
            <strong class="text-white">Gothenburg?</strong>
          </h3>
        </div>
      </v-col>
      <v-col cols="12" lg="8" md="12">
        <div class="subpage-content">
          <SubHeader />
          <v-container>
            <h2 class="text-black font-weight-regular text-h3 mt-10">
              Departure
            </h2>
            <div class="gap d-flex align-center mt-8">
              <span class="text-body-1 text-grey-darken-2 font-weight-medium">
                May
              </span>
              <span class="text-body-1 text-grey-darken-2 font-weight-medium">
                Jun
              </span>
              <span class="text-body-1 text-grey-darken-2 font-weight-medium">
                July
              </span>
            </div>

            <div class="departure-content">
              <router-link to="/seat">
                <DepartureItem />
              </router-link>
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
  font-size: 28px;
  margin-top: 120px;
}
.gap {
  gap: 18px;
}
.subpage-content {
  padding-left: 20px;
}

@media (max-width: 991px) {
  .subpage-container {
    height: auto;
  }
  .subpage-left {
    height: auto;
    padding: 20px;
  }
  h3 {
    margin-top: 50px;
  }
  .subpage-content[data-v-49e4dc52] {
    padding-left: 0px;
  }
  h2 {
    margin-top: 15px !important;
    font-size: 36px !important;
  }
}
</style>
