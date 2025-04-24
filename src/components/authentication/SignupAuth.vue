<script setup>
import { useAuthStore } from "@/stores/useAuth";
import { useRoute, useRouter } from "vue-router";


const router = useRouter();
const useAuth = useAuthStore();
const name = ref();
const email = ref();
const password = ref();
const confirm_password = ref();
const showError = ref("");


const register = async () => {
  showError.value = "hello"; 

  const res = await useAuth.executeRegister({
    data: {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirm_password.value,
    },
  });

  try {
    if (res.response.value.status === 201) {
       router.push("signin");
    }else{
      showError.value = res.response.value.data?.message || "Registration failed";
    }
  } catch (error) {
    showError.value = error.response?.data?.message || "An unexpected error occurred";
  }
};



const rules = {
  email: (v) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(v) || "Invalid e-mail";
  },
  min: (v) => (v || "").length >= 6 || "Min 8 characters",
};
</script>

<template>
  <div class="auth-container">
    <h3 class="top-title text-black font-weight-regular">
      Welcome back to <strong>JETSHARE</strong>
    </h3>
    <h3 class="text-h4 text-grey-darken-1 font-weight-regular">
      Create a <strong>new</strong> account
    </h3>

    <div class="auth-content mt-10">
      <v-text-field
        v-model="name"
        prepend-inner-icon="mdi-account"
        placeholder="Your Name"
      ></v-text-field>
      <v-text-field
        v-model="email"
        prepend-inner-icon="mdi-email"
        class="mt-1"
        placeholder="E-mail"
        :rules="[rules.email]"
      ></v-text-field>
      <v-text-field
        v-model="password"
        type="password"
        :rules="[rules.min]"
        prepend-inner-icon="mdi-lock"
        class="mt-1"
        placeholder="Password"
      ></v-text-field>
      <v-text-field
        v-model="confirm_password"
        type="password"
        :rules="[rules.min]"
        prepend-inner-icon="mdi-lock"
        class="mt-1"
        placeholder="Confirmed Password"
      ></v-text-field>
      <!-- <v-card-text
        v-if="showError"
        class="text-medium-emphasis text-center text-caption"
      >
        {{ showError }}
        hmm
      </v-card-text> -->
      <v-btn
        color="black"
        class="mt-5"
        size="large"
        block
        @click="register"
      >
        SIGN UP
      </v-btn>

      <div
        class="text-subtitle-2 mt-5 text-center font-weight-medium text-decoration-none cursor-pointer"
        href="#"
      >
        Don't have already an account ? SIGN In now
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
