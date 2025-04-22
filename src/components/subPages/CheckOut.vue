<script setup></script>

<template>
  <div class="detail-content mt-5">
    <h3 class="text-black font-weight-medium text-h5 mt-10">Guest Info</h3>
    <div class="selected-guest mt-5">
      <span class="text-black font-weight-regular text-caption-1"
        >Guest - 1
      </span>
      <span class="mdi mdi-close"></span>
    </div>

    <Coupon />
    <h3 class="text-black font-weight-medium text-h5 mt-10">Order Details</h3>
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
    <h3 class="text-black font-weight-medium text-h5 mt-10">Payment</h3>
    <div class="payment-container mt-5">
      <v-btn
        density="comfortable"
        size="large"
        icon="mdi-plus"
        variant="tonal"
      ></v-btn>
      <span class="text-caption-1 mt-3">Add payment method</span>
    </div>
    <v-btn block height="48" variant="tonal" rounded class="mt-4">
      Pay with Credit Card
    </v-btn>

    <div class="text-medium-emphasis font-weight-regular text-caption mt-15">
      Please click here to view the change and cancellation policy for our
      different offerings.
    </div>
    <div class="text-medium-emphasis font-weight-regular text-caption mt-5">
        Contact concierge@jivair.se to add redress numbers.
    </div>
    <div class="text-medium-emphasis font-weight-regular text-caption mt-5">
        By confirming this reservation, you acknowledge that you have read and hereby accept the Operator Participant Agreement and Conditions of Carriage as applicable to your flight(s). An email with the details of your reservation will be sent to your email address.
    </div>
    <div class="text-medium-emphasis font-weight-regular text-caption mt-5">
        Unless otherwise advised: All flights within Europe are operated by JIVAIR AOC. We will notify you as soon as possible if the air carrier operating your flight changes or is not one of the above companies. JIVAIR AB acts as an indirect air carrier under US-DOT Part 380. All passengers are required to accept the applicable Operator Participant Agreement and/or Conditions of Carriage at the time of booking. © 2025 JIVAIR AB
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail-content {
  max-width: 500px;
}
.detail-item span {
  font-size: 16px;
  color: #242323;
}
.detail-item {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.selected-guest {
  padding: 12px 15px;
  background-color: #e4e4e4;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 380px;
}
.selected-guest .mdi-close {
  height: 25px;
  width: 25px;
  background-color: rgba(255, 200, 191, 0.719);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(231, 42, 17);
  cursor: pointer;
}
.payment-container {
  height: 200px;
  width: 100%;
  background-color: #ececec;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
}
.payment-container:hover {
  background-color: #dddddd;
}
</style>
