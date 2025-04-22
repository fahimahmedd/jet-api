<script setup></script>

<template>
  <div class="departure-item">
    <div class="item-content">
      <h2 class="text-white">Mon, May 12</h2>
      <div class="flight-content mt-2">
        <v-row>
          <v-col cols="6" lg="4" md="4">
            <div>
              <h3 class="text-h5 text-white font-weight-medium">08:05</h3>
              <h5 class="text-body-1 text-grey-lighten-4 font-weight-medium">Göteborg</h5>
              <p class="text-caption text-grey-lighten-2">Landvetter Flygplats</p>
            </div>
          </v-col>
          <v-col cols="6" lg="4" md="4" class="d-none d-lg-block">
            <div>
              <v-img
                src="/public/images/subPage/plane.svg"
                class="mx-auto"
                width="100%"
                max-width="260px"
              ></v-img>
              <div
                class="time-text text-center text-caption text-white font-weight-regular"
              >
                0H 40MIN
              </div>
            </div>
          </v-col>
          <v-col cols="6" lg="4" md="4">
            <div class="text-right">
              <h3 class="text-h5 text-white font-weight-medium">08:45</h3>
              <h5 class="text-body-1 text-grey-lighten-4 font-weight-medium">
                Stockholm
              </h5>
              <p class="text-caption text-grey-lighten-2">Bromma Flygplats</p>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
    <div class="item-price">
      <h2 class="text-white text-h4 font-weight-bold">6995 $</h2>
      <div class="seat-wrap">
        <span class="mdi mdi-car-seat booked"></span>
        <span class="mdi mdi-car-seat booked"></span>
        <span class="mdi mdi-car-seat booked"></span>
        <span class="mdi mdi-car-seat booked"></span>
        <span class="mdi mdi-car-seat"></span>
        <span class="mdi mdi-car-seat"></span>
        <span class="mdi mdi-car-seat"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.departure-item {
  height: 150px;
  width: 100%;
  max-width: 800px;
  background-color: #6c7a90;
  margin-top: 20px;
  border-radius: 10px;
  display: flex;
  padding: 16px;
}

.item-content {
  width: 75%;
  padding-right: 12px;
  position: relative;
}

.item-price {
  border-left: 1px solid #e7e4e485;
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.flight-content {
  width: 100%;
}

.flight-content h5 {
  line-height: 1.1;
  margin-top: 2px;
}
.time-text {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
}
.seat-wrap {
  display: flex;
  gap: 2px;
  margin-top: 6px;
}
.seat-wrap span {
  width: 23px;
  height: 23px;
  border: 1px solid #dedbdb5d;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.seat-wrap .booked {
  color: #d5d4d4;
}
.seat-wrap .booked::after {
  position: absolute;
  content: "";
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 1px;
  height: 100%;
  background-color: #d5d4d4;
}

@media (max-width: 991px) {
  .departure-item {
    height: auto;
    display: grid;
    padding: 16px;
  }
  .item-content {
    width: 100%;
    padding-right: 10px;
  }
  .item-price {
    width: 100%;
    border-left: none;
    margin-top: 20px;
  }
}
</style>
