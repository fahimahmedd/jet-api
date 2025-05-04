<script setup>
import GuestForm from "@/components/subPages/GuestForm.vue";
import SubHeader from "@/components/subPages/SubHeader.vue";
import { ref, onMounted, computed } from 'vue';
import { useRouter } from "vue-router";
import { useGuestStore } from "@/stores/useGuest";
import { useUserStore } from "@/stores/useUser";

const userStore = useUserStore();
const router = useRouter();
const guestStore = useGuestStore();

const guestData = ref({
  flight_id: null,
  total_guests: 1,
  selected_seats: []
});

const currentGuestIndex = ref(0);
const guestForms = ref([]);

onMounted(() => {
  try {
    const storedData = sessionStorage.getItem('guestData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      guestData.value = {
        ...guestData.value,
        ...parsedData
      };
    }
  } catch (error) {
    console.error('Error loading guest data:', error);
  }

  guestForms.value = Array(guestData.value.total_guests).fill(null).map((_, i) => ({
    id: i + 1,
    completed: false,
    data: null
  }));
});

const handleGuestSubmit = async (formData) => {
  if (!formData.firstName || !formData.lastName || 
      !formData.birthDate || !formData.gender) {
    return;
  }

  const guestWithNumber = {
    ...formData,
    guestNumber: currentGuestIndex.value + 1
  };

  guestForms.value[currentGuestIndex.value].data = guestWithNumber;
  guestForms.value[currentGuestIndex.value].completed = true;
  
  if (currentGuestIndex.value < guestData.value.total_guests - 1) {
    currentGuestIndex.value++;
  } else {
    const allGuestInfo = guestForms.value.map(g => g.data);
    
    try {
      // Prepare payload - include user_id if user exists
      const payload = {
        guest: allGuestInfo,
        user_id: userStore.user.user?.id || null,
        flight_id: guestData.value.flight_id 
      };

      // Execute API call
      const { data, error } = await guestStore.executeGuest({ 
        data: payload 
      });

      if (error.value) {
        throw error.value;
      }

      const responseData = data.value;
      
      if (responseData?.status === "success") {
        // Only store token/user if we didn't send a user_id (new registration)
        if (!payload.user_id && responseData.token && responseData.user) {
          localStorage.setItem('token', responseData.token);
          localStorage.setItem('user', JSON.stringify(responseData.user));
          userStore.setTokenAndFetchUser(responseData.token);
        }
        
        // Always store guest info
        sessionStorage.setItem('guestInfo', JSON.stringify(allGuestInfo));
        router.push('/checkout');
      } else {
        console.error('API Error:', responseData);
        throw new Error(responseData?.message || 'Unknown API error');
      }
    } catch (error) {
      console.error('Error submitting guests:', error.message || error);
      alert(`Error submitting guest data: ${error.message || 'Please try again'}`);
    }
  }
};

const isLastGuest = computed(() => {
  return currentGuestIndex.value === (guestData.value?.total_guests || 1) - 1;
});
</script>

<template>
  <div class="subpage-container">
    <v-row no-gutters>
      <v-col cols="12" lg="5" md="4">
        <div
          class="subpage-left"
          style="background-image: url('/images/subPage/seat.svg')"
        >
          <router-link to="/">
            <div class="logo">
              <v-img src="/images/logo/logo.png" max-width="180"></v-img>
            </div>
          </router-link>

          <h3 class="text-grey-lighten-2 font-weight-regular">
            Who will be flying to <strong class="text-white">Stockholm?</strong>
          </h3>
          <div class="guest-list mt-10">
            <h4 class="text-white">Guests</h4>
            <v-btn
              v-for="(guest, index) in guestForms"
              :key="guest.id"
              class="guest-item"
              height="auto"
              min-height="unset"
              variant="flat"
              rounded="lg"
              :color="index === currentGuestIndex ? '#657ca2' : '#6C7A90'"
              @click="currentGuestIndex = index"
            >
              <div class="text-left">
                <h5 class="text-h6 text-white font-weight-medium">Adult {{ guest.id }}</h5>
                <p class="font-weight-medium" :class="guest.completed ? 'text-green-lighten-2' : 'text-grey-lighten-2'">
                  {{ guest.completed ? 'Completed' : 'Missing Information' }}
                </p>
              </div>
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col cols="12" lg="7" md="8">
        <div class="subpage-content">
          <SubHeader />
          <div class="sub-container">
            <v-container>
              <div class="guest-form">
                <h2 class="text-black font-weight-medium text-h4 mt-5">
                  Guest Info
                  <span class="placeholder-text text-grey-darken-1 font-weight-medium text-h6 mt-10">
                    (Adult {{ currentGuestIndex + 1 }})
                  </span>
                </h2>

                <GuestForm 
                  :key="currentGuestIndex"
                  @submit="handleGuestSubmit"
                  :is-last-guest="isLastGuest"
                  :current-guest-data="guestForms[currentGuestIndex]?.data"
                />
              </div>
            </v-container>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>


<style scoped>
.subpage-container {
  height: 100vh;
  width: 100%;
}

.subpage-left {
  height: 100vh;
  width: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  z-index: 1;
  padding: 30px;
}

.subpage-left::after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: -1;
}

h3 {
  font-size: 24px;
  margin-top: 120px;
}

.gap {
  gap: 18px;
}

.subpage-content {
  padding-left: 20px;
}

.placeholder-text {
  position: relative;
}

.guest-list {
  max-width: 350px;
}

.guest-item {
  border-radius: 5px;
  margin-top: 12px;
  text-transform: capitalize !important;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 10px 20px;
  width: 100%;
}
.guest-item p {
  font-size: 12px;
}
.guest-form {
  max-width: 560px;
  margin: 0 auto;
}
@media (max-width: 991px) {
  .subpage-left {
    height: auto;
    padding: 20px;
  }

  h3 {
    margin-top: 40px;
  }

  .subpage-content {
    padding-left: 0px;
  }

  .subpage-content h2 {
    font-size: 32px !important;
  }

  .placeholder-text {
    font-size: 30px !important;
  }
}
</style>
