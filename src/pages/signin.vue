<script setup>
import SeatBox from "@/components/subPages/SeatBox.vue";
import SubHeader from "@/components/subPages/SubHeader.vue";
import { useRouter } from "vue-router";

const router = useRouter();

</script>

<template>
  <div class="subpage-container">
    <v-row no-gutters>
      <v-col cols="12" lg="5" md="6" sm="12">
        <div
          class="subpage-left"
          style="background-image: url('/public/images/subPage/departure.svg')"
        >
          <router-link to="/">
            <div class="logo">
              <v-img src="/public/images/logo/logo.png" max-width="130"></v-img>
            </div>
          </router-link>

          <h3 class="text-grey-lighten-2 font-weight-regular">
            Login to book your next <strong class="text-white">journey! </strong>
          </h3>
          
        </div>
      </v-col>
      <v-col cols="12" lg="7" md="6" sm="12">
        <div class="subpage-content">
          <v-container>
            <v-tooltip text="Go Back" location="bottom">
              <template #activator="{ props }">
                <v-btn
                  density="comfortable"
                  size="large"
                  variant="tonal"
                  color="#6d92cf"
                  icon="mdi-arrow-left"
                  rounded="sm"
                  v-bind="props"
                  @click="router.back()"
                ></v-btn>
              </template>
            </v-tooltip>

            <div class="mt-10">
              <SigninAuth/>
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
}

@media (max-width: 991px) {
  .subpage-container {
    height: auto;
  }
  .subpage-left {
    height: auto;
  }
  .subpage-content {
    padding-left: 0px;
  }
}
</style>
