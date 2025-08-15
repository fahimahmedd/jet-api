<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBookFlight } from '@/stores/useBookFlight';
import { useFlightStore } from '@/stores/useFlight';
import { url } from "@/plugins/baseUrl";


const router = useRouter();
const bookFlightStore = useBookFlight();
const flightStore = useFlightStore();

const booking = ref({
  outbound: null,
  return: null,
  isRoundTrip: false,
  passengers: 0
});

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Get booking data from store
onMounted(() => {
  try {
    if (bookFlightStore.bookingResponse) {
      booking.value.outbound = bookFlightStore.bookingResponse.outbound_booking;
      booking.value.return = bookFlightStore.bookingResponse.return_booking;
      booking.value.isRoundTrip = !!booking.value.return;
      booking.value.passengers = bookFlightStore.bookingResponse.outbound_booking.total_seats || 1;

    } else {
      console.warn('No booking response found in store');
      router.push('/'); // Redirect if no booking data
    }
  } catch (error) {
    console.error('Error loading booking data:', error);
    router.push('/');
  }
});

const downloadTicket = computed(() => {
  if (!booking.value.outbound?.id) return '#';
  return `https://appsdevelopmentfirm.agency/admin/site/bookings/${booking.value.outbound.id}/download`;
});
const goToBookings = () => {
  router.push('/my-trip');
};

const goToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="confirmation-page">
    <!-- Main Content -->
    <div class="confirmation-container">
      <div class="confirmation-card">
        <!-- Animated Checkmark -->
        <div class="exclamation-animation">
          <span class="mdi mdi-exclamation-thick"></span>
        </div>

        <h1 class="confirmation-title">Booking Pending..</h1>
        <p class="confirmation-subtitle">Your flight request has been successfully submitted</p>

        <!-- Booking Details -->
        <div class="confirmation-details">
          <div class="detail-item">
            <v-icon color="#6d92cf">mdi-airplane</v-icon>
            <div>
              <div class="detail-label">Flight Number</div>
              <div class="detail-value">SW{{ booking.outbound?.flight_id }}</div>
            </div>
          </div>

          <div class="detail-item">
            <v-icon color="#6d92cf">mdi-swap-horizontal</v-icon>
            <div>
              <div class="detail-label">Trip Type</div>
              <div class="detail-value">{{ booking.isRoundTrip ? 'Round Trip' : 'One Way' }}</div>
            </div>
          </div>

          <div class="detail-item">
            <v-icon color="#6d92cf">mdi-account-multiple</v-icon>
            <div>
              <div class="detail-label">Passengers</div>
              <div class="detail-value">{{ booking.passengers }} traveler(s)</div>
            </div>
          </div>
        </div>

        <!-- Outbound Flight -->
        <div class="route-display">
          <div class="airport origin">
            <div class="code">{{ booking.outbound?.flight.origin.code || '---' }}</div>
            <div class="city">{{ booking.outbound?.flight.origin.city || 'Origin' }}</div>
          </div>

          <div class="flight-path">
            <div class="duration">
              <span class="mdi mdi-calendar"></span>
              {{ formatDate(booking.outbound?.flight.departure_date) }}
            </div>
            <div class="line"></div>
            <v-icon color="#6d92cf">mdi-airplane</v-icon>
          </div>

          <div class="airport destination">
            <div class="code">{{ booking.outbound?.flight.destination.code || '---' }}</div>
            <div class="city">{{ booking.outbound?.flight.destination.city || 'Destination' }}</div>
          </div>
        </div>

        <!-- Return Flight (only for round trips) -->
        <div class="route-display" v-if="booking.isRoundTrip && booking.return">
          <div class="airport origin">
            <div class="code">{{ booking.return?.flight.origin.code || '---' }}</div>
            <div class="city">{{ booking.return?.flight.origin.city || 'Origin' }}</div>
          </div>

          <div class="flight-path">
            <div class="duration">
              <span class="mdi mdi-calendar"></span>
              {{ formatDate(booking.return?.flight.departure_date) }}
            </div>
            <div class="line"></div>
            <v-icon color="#6d92cf">mdi-airplane</v-icon>
          </div>

          <div class="airport destination">
            <div class="code">{{ booking.return?.flight.destination.code || '---' }}</div>
            <div class="city">{{ booking.return?.flight.destination.city || 'Destination' }}</div>
          </div>
        </div>

        <div class="confirmation-actions">
          <v-btn outlined color="#6d92cf" large class="action-btn" @click="goToBookings">
            <v-icon left>mdi-text-box-outline</v-icon>
            View All Bookings
          </v-btn>

          <v-btn outlined color="#6d92cf" large class="action-btn" @click="goToHome">
            <v-icon left>mdi-home</v-icon>
            Back Home
          </v-btn>
        </div>

        <div class="confirmation-note">
          <v-icon color="success" small>mdi-information-outline</v-icon>
          <span>A confirmation email has been sent to your registered address</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.confirmation-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.confirmation-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 0;
  position: relative;
}

.confirmation-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  position: relative;
  z-index: 2;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: linear-gradient(to right, #749fe4 0%, #5880c0 100%);
  }
}

.exclamation-animation {
  margin: 0 auto 20px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirmation-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
  background: linear-gradient(to right, #89afed 0%, #5a80bc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.confirmation-subtitle {
  font-size: 1rem;
  color: #7f8c8d;
  margin-bottom: 25px;
  line-height: 1.4;
}

.confirmation-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin: 25px 0;
  text-align: left;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;

  .v-icon {
    margin-right: 12px;
    font-size: 24px;
    flex-shrink: 0;
  }

  > div {
    overflow: hidden;
  }
}

.detail-label {
  font-size: 0.75rem;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-value {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.route-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  flex-wrap: wrap;
}

.airport {
  flex: 1;
  min-width: 100px;
  padding: 5px;

  .code {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    line-height: 1.2;
  }

  .city {
    font-size: 0.9rem;
    color: #7f8c8d;
    margin-top: 3px;
    line-height: 1.3;
  }
}

.flight-path {
  flex: 2;
  min-width: 150px;
  position: relative;
  padding: 0 15px;
  margin: 10px 0;

  .duration {
    font-size: 0.8rem;
    color: #757a7a;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .mdi {
      margin-right: 5px;
    }
  }

  .line {
    height: 2px;
    background: #bdc3c7;
    position: relative;
    width: 100%;
  }

  .v-icon {
    position: absolute;
    left: 50%;
    bottom: -12px;
    transform: translateX(-50%);
    background: #f8f9fa;
    padding: 0 8px;
    font-size: 20px;
  }
}

.confirmation-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 25px 0;
  flex-wrap: wrap;

  .action-btn {
    min-width: 180px;
    margin: 5px 0;
  }
}

.confirmation-note {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-top: 15px;
  padding: 0 10px;
  flex-wrap: wrap;

  .v-icon {
    margin-right: 6px;
    flex-shrink: 0;
  }
}

/* Animation styles remain the same as before */
.exclamation-animation {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 52px;
}

.exclamation-animation::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid #5a80bc;
  border-radius: 50%;
  box-sizing: border-box;
  animation: exclamation-circle 0.6s ease-in-out both;
}

.exclamation-animation .mdi-exclamation-thick {
  position: relative;
  display: block;
  font-size: 24px;
  color: #5a80bc;
  text-align: center;
  line-height: 52px;
  opacity: 0;
  transform: scale(0.8);
  animation: exclamation-mark 0.4s 0.4s ease-in-out both;
}

@keyframes exclamation-circle {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes exclamation-mark {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive Breakpoints */
@media (max-width: 768px) {
 
  .confirmation-page {
    padding: 15px;
    align-items: flex-start;
  }

  .confirmation-card {
    padding: 25px 15px;
  }

  .confirmation-title {
    font-size: 1.75rem;
  }

  .confirmation-subtitle {
    font-size: 0.95rem;
  }

  .confirmation-details {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .detail-item {
    padding: 10px;
    
    .v-icon {
      font-size: 22px;
      margin-right: 10px;
    }
  }

   .route-display{
    flex-direction: row;
    flex-wrap:nowrap;
    padding: 10px 0;
  }

  .airport {
    width: 100%;
    text-align: center;
    padding: 5px 0;
    
    .code {
      font-size: 1.3rem;
    }
  }

  .flight-path {
    width: 100%;
    padding: 15px 0;
    margin: 5px 0;
    
    .v-icon {
      bottom: -10px;
    }
  }

  .confirmation-actions {
    flex-direction: column;
    gap: 8px;
    
    .action-btn {
      width: 100%;
      min-width: unset;
    }
  }
}

@media (max-width: 480px) {
  .confirmation-title {
    font-size: 1.5rem;
  }

  .confirmation-subtitle {
    font-size: 0.9rem;
  }

  .detail-value {
    font-size: 0.9rem;
  }

  .confirmation-actions .v-btn {
    font-size: 0.85rem;
  }

  .confirmation-note {
    font-size: 0.8rem;
    justify-content: flex-start;
    text-align: left;
  }
}
</style>