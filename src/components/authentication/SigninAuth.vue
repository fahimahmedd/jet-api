<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/useAuth";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUser";

const router = useRouter();
const useAuth = useAuthStore();
const useUser = useUserStore();


const email = ref("");
const password = ref("");
const showError = ref("");

const login = async () => {
  showError.value = "";

  try {
    const res = await useAuth.executeLogin({
      data: {
        email: email.value,
        password: password.value,
      },
    });

    if (res.response.value.status === 200) {
      const user = res.response.value.data.user;
      const token = res.response.value.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      useUser.setTokenAndFetchUser(token);
      router.push("/"); 
    } else {
      showError.value = res.response.value.data?.message || "Login failed";
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
        v-model="email"
        prepend-inner-icon="mdi-email"
        class="mt-3"
        :rules="[rules.email]"
        placeholder="E-mail"
      ></v-text-field>

      <div class="text-subtitle-1 text-black font-weight-regular">Password</div>
      <v-text-field
        v-model="password"
        type="password"
        :rules="[rules.min]"
        prepend-inner-icon="mdi-lock"
        class="mt-3"
        placeholder="Password"
      ></v-text-field>

      <div class="d-flex justify-end">
        <a
          class="text-black text-subtitle-1 font-weight-regular text-decoration-none"
          href="#"
        >
          Forgot password?
        </a>
      </div>

      <v-card-text
        v-if="showError"
        class="text-medium-emphasis text-center text-caption mt-2"
      >
        {{ showError }}
      </v-card-text>

      <v-btn
        color="black"
        class="mt-5"
        size="large"
        block
        @click="login"
      >
        Log In
      </v-btn>

      <div
        class="text-subtitle-2 mt-5 text-center font-weight-medium text-decoration-none cursor-pointer"
        @click="router.push('/signup')"
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
