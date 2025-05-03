<script setup>
import { useUserStore } from "@/stores/useUser";
import { ref } from 'vue';

const userStore = useUserStore();

// Form data refs
const name = ref(userStore.user.user?.name || '');
const email = ref(userStore.user.user?.email || '');

// Snackbar controls
const showSnackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

// Function to handle profile save
const saveProfile = async () => {
  try {
    await userStore.updateProfile({
      name: name.value,
    });

    userStore.user.user.name = name.value;
    localStorage.setItem('user', JSON.stringify(userStore.user));
    
    // Show success snackbar
    snackbarMessage.value = 'Profile updated successfully!';
    snackbarColor.value = 'success';
    showSnackbar.value = true;
    
  } catch (error) {
    console.error('Error updating profile:', error);
    // Show error snackbar
    snackbarMessage.value = 'Failed to update profile';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  }
};
</script>

<template>
  <div class="profile-content">
    <div class="profile-content-warp">
      <v-avatar color="#8599b9" size="120">
        <span class="text-h2">{{ userStore.user?.name?.charAt(0) || 'F' }}</span>
      </v-avatar>
      
      <v-text-field 
        class="mt-8" 
        hide-details="auto" 
        label="Name"
        v-model="name"
      ></v-text-field>
      
      <v-text-field 
        class="mt-5" 
        hide-details="auto" 
        label="E-mail (cannot be changed)"
        v-model="email"
        disabled
        readonly
      ></v-text-field>
      
      <v-btn 
        block 
        class="mt-8 profile-btn" 
        variant="tonal" 
        size="large" 
        color="#fff"
        @click="saveProfile"
      >
        Save Profile
      </v-btn>
    </div>

    <!-- Snackbar Notification -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      :color="snackbarColor"
      location="bottom right"
    >
      {{ snackbarMessage }}

      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style lang="scss" scoped>
.profile-content-warp {
  max-width: 440px;
  margin: 20px auto;
  text-align: center;
  border: 1px solid #86868656;
  padding: 40px;
  border-radius: 16px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}
.profile-btn {
  background-color: #000;
}
</style>