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
      const payload = {
        guest: allGuestInfo,
        user_id: userStore.user?.user?.id || null,
        flight_id: guestData.value.flight_id 
      };

      const { data, error } = await guestStore.executeGuest({ 
        data: payload 
      });

      if (error.value) {
        throw error.value;
      }

      const responseData = data.value;
      
      if (responseData?.status === "success") {
        if (!payload.user_id && responseData.token && responseData.user) {
          localStorage.setItem('token', responseData.token);
          localStorage.setItem('user', JSON.stringify(responseData.user));
          userStore.setTokenAndFetchUser(responseData.token);
        }
        
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
  <div >
    <v-row no-gutters class="subpage-container">
      <v-col cols="12" lg="4" md="4">
        <div
          class="subpage-left"
          style="background-image: url('/images/subPage/seat.jpg')"
        >
          <router-link to="/">
            <div class="logo">
              <v-img src="/images/logo/logo.png" :max-width="logoSize"></v-img>
            </div>
          </router-link>

          <div class="guest-list">
            <h3 class="section-title text-grey-lighten-2 font-weight-regular">
              Who will be flying?
            </h3>

            <h4 class="guest-title text-white">Guests</h4>
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
                <h5 class="guest-number text-white font-weight-medium">Adult {{ guest.id }}</h5>
                <p class="guest-status font-weight-medium" :class="guest.completed ? 'text-green-lighten-2' : 'text-grey-lighten-2'">
                  {{ guest.completed ? 'Completed' : 'Missing Information' }}
                </p>
              </div>
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col cols="12" lg="8" md="8">
        <div class="subpage-content">
          <SubHeader />
          <div class="sub-container">
            <v-container class="content-container">
              <div class="guest-form">
                <h2 class="form-title text-black font-weight-medium">
                  Guest Info
                  <span class="guest-counter text-grey-darken-1 font-weight-medium">
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

<script>
export default {
  computed: {
    logoSize() {
      switch (this.$vuetify.display.name) {
        case 'xs': return '120px';
        case 'sm': return '150px';
        default: return '180px';
      }
    }
  }
}
</script>

<style scoped>

.subpage-row {
  min-height: 100vh;
}

.subpage-left {
  height: 100%;
  width: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  z-index: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
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

.logo {
  margin-bottom: 40px;
}

.guest-list {
  max-width: 400px;
  margin: 40px auto 0;
  width: 100%;
}

.section-title {
  font-size: 2rem;
  line-height: 1.2;
}

.guest-title {
  font-size: 1.5rem;
  margin: 1.5rem 0 0.5rem;
}

.guest-item {
  border-radius: 12px;
  margin-top: 0.75rem;
  text-transform: capitalize !important;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 12px 20px;
  width: 100%;
}

.guest-number {
  font-size: 1.125rem;
  line-height: 1.2;
}

.guest-status {
  font-size: 0.75rem;
  line-height: 1.2;
  margin-top: 2px;
}

.subpage-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sub-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.guest-form {
  max-width: 560px;
  margin: 0 auto;
  width: 100%;
}

.form-title {
  font-size: 2rem;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.guest-counter {
  font-size: 1.5rem;
  display: block;
  margin-top: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 1279px) {
  .section-title {
    font-size: 1.75rem;
  }
  
  .form-title {
    font-size: 1.75rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .guest-counter {
    font-size: 1.25rem;
    margin-top: 0px;
  }
}

@media (max-width: 959px) {
  .subpage-left {
    height: auto;
    padding: 25px 20px;
  }
  
  .guest-list {
    margin: 0px auto;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .guest-title {
    font-size: 1.25rem;
    margin: 10px 0px 0 0;
  }
}

@media (max-width: 767px) {
  .subpage-row {
    flex-direction: column;
  }
  
  .subpage-left {
    padding: 20px 15px;
  }
  
  
  .logo {
    margin-bottom: 20px;
  }
  
  .section-title {
    font-size: 1.25rem;
    margin-top: 20px;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .guest-counter {
    font-size: 1.1rem;
  }
}

@media (max-width: 479px) {
  .subpage-left {
    padding: 15px 12px;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .form-title {
    font-size: 1.25rem;
  }
  
  .guest-item {
    padding: 10px 15px;
  }
  
  .guest-number {
    font-size: 1rem;
  }
}
</style>