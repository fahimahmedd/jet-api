<script setup></script>

<template>
  <div class="profile-content">
    <div class="profile-content-warp">
      <v-avatar color="blue" size="120">
        <span class="text-h2">F</span>
      </v-avatar>
      <v-text-field class="mt-8" hide-details="auto" label="Name"></v-text-field>
      <v-text-field class="mt-5" hide-details="auto" label="E-mail"></v-text-field>
      <v-btn block class="mt-8 profile-btn" variant="tonal" size="large" color="#fff">Save Profile</v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
 .profile-content-warp{
  max-width: 450px;
  margin: 20px auto;
  text-align: center;
  border: 1px solid #8686861a;
  padding: 40px;
  border-radius: 16px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
 }
 .profile-btn{
  background-color: #000;
 }
</style>
