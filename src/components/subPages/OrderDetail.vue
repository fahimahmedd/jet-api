<script setup></script>

<template>
  <h3 class="text-black font-weight-medium text-h5 mt-10">Order Details</h3>
  <div class="detail-content mt-5">
    <div class="detail-item">
      <span>Adult (1) </span>
      <span> 1 x 15 990 SEK </span>
    </div>
    <div class="detail-item">
      <span>Taxes and fees </span>
      <span> 6% </span>
    </div>
    <div class="detail-item">
      <span>Subtotal </span>
      <span> 6% </span>
    </div>
    <v-divider class="my-5"></v-divider>
    <div class="detail-item">
      <span class="text-h5"> Total : </span>
      <span class="text-h4"> <strong>5990 $</strong> </span>
    </div>
    <router-link to="/guest">
                    
    <v-btn class="booking-btn mt-10" variant="flat"
            rounded="lg" size="large" block color="#657ca2"
            >Continue</v-btn>
                  </router-link>
  </div>
</template>

<style lang="scss" scoped>
.detail-content{
    max-width: 500px;
}
.detail-item span{
    font-size: 16px;
    color: #242323;
}
.detail-item{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
</style>
