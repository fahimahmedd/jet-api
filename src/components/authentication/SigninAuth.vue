<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from "@/stores/useAuth";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUser";

const router = useRouter();
const useAuth = useAuthStore();
const useUser = useUserStore();

const email = ref("");
const password = ref("");
const showError = ref("");
const isLoading = ref(false);
const showPassword = ref(false);
const formValid = ref(false);

const rules = {
  required: (v) => !!v || "This field is required",
  email: (v) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(v) || "Invalid e-mail";
  },
  min: (v) => (v || "").length >= 8 || "Min 8 characters",
};

const isFormValid = computed(() => {
  return email.value && 
         password.value && 
         rules.email(email.value) === true && 
         rules.min(password.value) === true;
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  if (!isFormValid.value) return;
  
  showError.value = "";
  isLoading.value = true;

  try {
    const response = await useAuth.executeLogin({
      data: {
        email: email.value,
        password: password.value,
      },
    });

    const res = response?.response?.value || response;
    
    if (res?.status === 200) {
      const user = res.data?.user;
      const token = res.data?.token;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        useUser.setTokenAndFetchUser(token);
        
        // Check for stored booking data and redirect accordingly
        const bookingData = sessionStorage.getItem('bookingData');
        const authRedirect = sessionStorage.getItem('authRedirect');
        
        if (bookingData && authRedirect) {
          // Redirect to the trip page after successful login
          router.push(authRedirect);
          // Clear the redirect storage
          sessionStorage.removeItem('authRedirect');
        } else {
          // Default redirect if no booking flow in progress
          router.push("/");
        }
      } else {
        showError.value = "Invalid response from server";
      }
    } else {
      showError.value = res?.data?.message || "Login failed";
    }
  } catch (error) {
    console.error("Login error:", error);
    showError.value = error.response?.data?.message || "An unexpected error occurred";
  } finally {
    isLoading.value = false;
  }
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter' && isFormValid.value) {
    handleLogin();
  }
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
      <v-form v-model="formValid" @submit.prevent="handleLogin">
        <div class="text-subtitle-1 text-black font-weight-regular">Email Address</div>
        <v-text-field
          v-model="email"
          prepend-inner-icon="mdi-email"
          class="mt-3"
          :rules="[rules.required, rules.email]"
          placeholder="E-mail"
          required
          clearable
          @keyup.enter="handleKeyPress"
        ></v-text-field>

        <div class="text-subtitle-1 text-black font-weight-regular">Password</div>
        <v-text-field
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required, rules.min]"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="togglePasswordVisibility"
          class="mt-3"
          placeholder="Password"
          required
          clearable
          @keyup.enter="handleKeyPress"
        ></v-text-field>

        <div class="d-flex justify-end">
          <div
            class="text-black text-subtitle-1 font-weight-regular text-decoration-none"
          >
            Forgot password?
          </div>
        </div>

        <v-card-text
          v-if="showError"
          class="text-medium-emphasis text-center text-caption mt-2 error-message"
        >
          {{ showError }}
        </v-card-text>

        <v-btn
          color="black"
          class="mt-5"
          size="large"
          block
          @click="handleLogin"
          :disabled="!isFormValid || isLoading"
          :loading="isLoading"
        >
          Log In
        </v-btn>

        <div
          class="text-subtitle-2 mt-5 text-center font-weight-medium text-decoration-none cursor-pointer"
          @click="router.push('/signup')"
        >
          Don't have an account ? <span class="text-primary font-weight-bold">SIGN UP</span> now
        </div>
      </v-form>
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
.error-message {
  color: #ff5252 !important;
  background-color: rgba(255, 82, 82, 0.1);
  border-radius: 4px;
}
.text-primary {
  color: #1976D2;
}
</style>