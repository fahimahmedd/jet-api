<script setup>

const rules = {
  email: (v) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(v) || "Invalid e-mail";
  },
  min: (v) => (v || "").length >= 6 || "Min 6 characters",
};
</script>

<template>
  <div class="auth-container">
    <h3 class="top-title text-black font-weight-regular">
      Welcome back to <strong>JETSHARE</strong>
    </h3>
    <h3 class="text-h4 text-grey-darken-1 font-weight-regular">
      Log in to an <strong>existing</strong> account
    </h3>

    <div class="auth-content mt-16">
      <div class="text-subtitle-1 text-black font-weight-regular">Email Address</div>
      <v-text-field
        prepend-inner-icon="mdi-email"
        class="mt-3"
        :rules="[rules.email]"
      ></v-text-field>

      <div
        class="text-subtitle-1 text-black font-weight-regular"
      >
        Password
      </div>
      <v-text-field
        type="password"
        :rules="[rules.min]"
        prepend-inner-icon="mdi-lock"
        class="mt-3"
      ></v-text-field>
      <div class="d-flex justify-end">
        <a
          class="text-black text-subtitle-1 font-weight-regular text-decoration-none"
          href="#"
        >
          Forgot password?</a
        >
      </div>
      <!-- <v-card-text
        v-if="showError"
        class="text-medium-emphasis text-center text-caption"
      >
        {{ showError }}
      </v-card-text> -->
      <v-btn
        color="black"
        class="mt-5"
        size="large"
        block
      >
        Log In
      </v-btn>

      <div
        class="text-subtitle-2 mt-5 text-center font-weight-medium text-decoration-none cursor-pointer"
        href="#"
      >
        Don't have an account ? SIGN UP now
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
}
.top-title {
  font-size: 28px;
}
</style>
