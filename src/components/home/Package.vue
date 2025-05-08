<script setup></script>

<template>
  <div class="package py-16">
    <v-container>
      <h2 class="text-black font-weight-medium">The Complete Travel Package</h2>
      <div
        class="package-bg mt-6 d-flex align-end"
        style="background-image: url('/images/explore/package-bg.webp')"
      >
      <div class="package-content">
                <h4 class="text-h6 font-weight-regular">Meadowood</h4>
                <p class="text-grey-darken-1 font-weight-regular">Experience a fixture of the northern wine country community and recipient of the Michelin Three Key award, nestled in the woodlands of St. Helena.</p>
             </div>
      </div>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
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
}
.package-bg::after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}
.package h2{
    font-size: 38px;
}
.package-content{
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    max-width: 500px;

}
.package-content p{
    font-size: 15px;
    margin-top: 10px;
}
.booking-btn{
    background-color: #fff;
    font-weight: 700;
    color: #000;
}
@media (max-width: 991px) {
  .package-bg {
      height: 300px;
      padding: 20px;
  }
}
</style>
