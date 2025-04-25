<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from "@/stores/useAuth";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const useAuth = useAuthStore();
const name = ref('');
const email = ref('');
const password = ref('');
const confirm_password = ref('');
const showError = ref('');
const isLoading = ref(false);
const formValid = ref(false);

const validatePasswordMatch = () => {
  return password.value === confirm_password.value || "Passwords don't match";
};

const rules = {
  required: (v) => !!v || "This field is required",
  email: (v) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(v) || "Invalid e-mail";
  },
  min: (v) => (v || "").length >= 8 || "Min 8 characters",
  name: (v) => (v || "").length >= 3 || "Name must be at least 3 characters",
  passwordMatch: () => validatePasswordMatch()
};

const validateForm = () => {
  return (
    name.value &&
    email.value &&
    password.value &&
    confirm_password.value &&
    rules.email(email.value) === true &&
    rules.min(password.value) === true &&
    rules.min(confirm_password.value) === true &&
    rules.name(name.value) === true &&
    validatePasswordMatch() === true
  );
};

const isFormValid = computed(() => {
  return validateForm();
});

const register = async () => {
  if (!isFormValid.value) return;
  
  showError.value = "";
  isLoading.value = true;

  try {
    const res = await useAuth.executeRegister({
      data: {
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: confirm_password.value,
      },
    });

    if (res.response.value.status === 201) {
      router.push("signin");
    } else {
      showError.value = res.response.value.data?.message || "Registration failed";
    }
  } catch (error) {
    showError.value = error.response?.data?.message || "An unexpected error occurred";
  } finally {
    isLoading.value = false;
  }
};

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && isFormValid.value) {
    register();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
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
      <v-form v-model="formValid" @keydown.enter.prevent>
        <v-text-field
          v-model="name"
          prepend-inner-icon="mdi-account"
          placeholder="Your Name"
          :rules="[rules.required, rules.name]"
          required
          clearable
        ></v-text-field>

        <v-text-field
          v-model="email"
          prepend-inner-icon="mdi-email"
          class="mt-1"
          placeholder="E-mail"
          :rules="[rules.required, rules.email]"
          required
          clearable
        ></v-text-field>

        <v-text-field
          v-model="password"
          type="password"
          :rules="[rules.required, rules.min]"
          prepend-inner-icon="mdi-lock"
          class="mt-1"
          placeholder="Password"
          required
          clearable
        ></v-text-field>

        <v-text-field
          v-model="confirm_password"
          type="password"
          :rules="[rules.required, rules.min, rules.passwordMatch]"
          prepend-inner-icon="mdi-lock"
          class="mt-1"
          placeholder="Confirmed Password"
          required
          clearable
        ></v-text-field>

        <v-alert
          v-if="showError"
          type="error"
          variant="tonal"
          class="mb-4 text-caption font-weight-regular"
        >
          {{ showError }}
        </v-alert>

        <v-btn
          color="black"
          class="mt-5"
          size="large"
          block
          @click="register"
          :disabled="!isFormValid || isLoading"
          :loading="isLoading"
        >
          SIGN UP
        </v-btn>
      </v-form>

      <div class="text-subtitle-2 mt-5 text-center font-weight-regular">
        Already have an account? 
        <router-link to="signin" class="text-decoration-none text-primary font-weight-bold">
          SIGN IN 
        </router-link>
        now
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

.text-primary {
  color: #1976D2;
}
</style>