<script setup>
import { useMyBookStore } from '@/stores/useMyBook';
import { onMounted, computed } from 'vue';

const bookStore = useMyBookStore();

onMounted(() => {
  bookStore.fetchBookings();
});

const formatDate = (dateString) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString.slice(0, 5); // Get HH:MM
};

const currentBookings = computed(() => {
  return bookStore.bookings || [];
});
</script>

<template>
  <div class="booking-container">
    <h2 class="booking-title">Your Flight Itineraries</h2>
    
    <v-progress-linear
      v-if="bookStore.loading"
      indeterminate
      color="#6d92cf"
      class="mb-4"
    ></v-progress-linear>

    
    <!-- <v-alert
      v-if="bookStore.error"
      type="error"
      class="mb-4"
    >
      {{ bookStore.error }}
    </v-alert> -->

    <v-row class="booking-grid">
      <v-col
        cols="12"
        sm="6"
        lg="6"
        v-for="booking in currentBookings"
        :key="booking.id"
      >
        <div 
          class="trip-card"
          :class="{
            'trip-card-confirmed': booking.status === 'confirmed',
            'trip-card-pending': booking.status === 'pending'
          }"
        >
          <div class="trip-card-header">
            <div class="airline-brand">
              <div class="airline-logo">
                <v-icon color="#6d92cf">mdi-airplane</v-icon>
              </div>
            </div>
            <v-chip
              small
              :color="booking.status === 'confirmed' ? 'success' : 'warning'"
              class="status-badge"
            >
              <v-icon small left>
                {{ booking.status === 'confirmed' ? 'mdi-check-circle' : 'mdi-clock' }}
              </v-icon>
              {{ booking.status.toUpperCase() }}
            </v-chip>
          </div>

          <div class="trip-card-body">
            <div class="route-display">
              <div class="airport-info origin">
                <div class="airport-code">{{ booking.flight.origin.code }}</div>
                <div class="airport-city">{{ booking.flight.origin.city }}</div>
                <div class="flight-time">{{ formatTime(booking.flight.departure_start_time) }}</div>
              </div>

              <div class="flight-connector">
                <div class="flight-duration">
                  {{ calculateDuration(booking.flight.departure_start_time, booking.flight.departure_land_time) }}
                </div>
                <div class="flight-line">
                  <v-icon small class="flight-icon">mdi-airplane</v-icon>
                </div>
                <div class="flight-type">
                  {{ booking.trip_type === 'oneway' ? 'ONE WAY' : 'ROUND TRIP' }}
                </div>
              </div>

              <div class="airport-info destination">
                <div class="airport-code">{{ booking.flight.destination.code }}</div>
                <div class="airport-city">{{ booking.flight.destination.city }}</div>
                <div class="flight-time">{{ formatTime(booking.flight.departure_land_time) }}</div>
              </div>
            </div>

            <v-divider class="my-3"></v-divider>

            <div class="flight-details">
              <div class="detail-item">
                <v-icon small class="mr-1">mdi-calendar</v-icon>
                <span>{{ formatDate(booking.flight.departure_date) }}</span>
              </div>
              <div class="detail-item">
                <v-icon small class="mr-1">mdi-ticket-confirmation</v-icon>
                <span>Booking #{{ booking.id }}</span>
              </div>
              <div class="detail-item">
                <v-icon small class="mr-1">mdi-seat</v-icon>
                <span class="d-flex">
                  <v-chip
                    v-for="seat in booking.seats"
                    :key="seat.id"
                    x-small
                    color="#6d92cf"
                    class="mr-1 seat-batch"
                  >
                    {{ seat.seat_number }}
                  </v-chip>
                </span>
              </div>
            </div>
          </div>

          <div class="trip-card-footer">
            <div class="price-tag">
              <span class="price-label">Total</span>
              <span class="price-value">{{ booking.total_price }}</span>
            </div>
            <div class="flight-number">
              Flight #{{ booking.flight.id }}
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-alert
      v-if="!bookStore.loading && currentBookings.length === 0"
      type="info"
      class="mt-4"
    >
      You don't have any bookings yet
    </v-alert>
    
  </div>
</template>

<style lang="scss" scoped>
.booking-container {
  max-width: 1200px;
  margin: 0 auto;
}

.booking-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
  text-align: center;
  position: relative;
}

.booking-grid {
  margin-top: 20px;
}

.trip-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(50, 50, 50, 0.254);
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
}

.trip-card-confirmed {
  border-top: 4px solid #4caf50;
}

.trip-card-pending {
  border-top: 4px solid #ffc107;
}

.trip-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.airline-brand {
  display: flex;
  align-items: center;
}

.airline-logo {
  width: 36px;
  height: 36px;
  background-color: #e3f2fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.airline-name {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
}

.status-badge {
  font-weight: 600;
  letter-spacing: 0.5px;
  height: 30px;
}
.seat-batch{
  font-weight: 500;
  letter-spacing: 0.2px;
  height: 25px;
  font-size: 12px;
}

.trip-card-body {
  padding: 20px;
  flex-grow: 1;
}

.route-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.airport-info {
  flex: 1;
  
  &.origin {
    text-align: left;
  }
  
  &.destination {
    text-align: right;
  }
}

.airport-code {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.airport-city {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.flight-time {
  font-size: 16px;
  font-weight: 600;
  color: #34495e;
}

.flight-connector {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 0 10px;
}

.flight-duration {
  font-size: 11px;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.flight-line {
  width: 100%;
  height: 1px;
  background-color: #bdc3c7;
  position: relative;
  margin: 5px 0;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: #bdc3c7;
    top: 0;
    left: 0;
  }
}

.flight-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 0 5px;
  color: #3f51b5;
}

.flight-type {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #7f8c8d;
  margin-top: 8px;
}

.flight-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #34495e;
}

.trip-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.price-tag {
  display: flex;
  align-items: center;
}

.price-label {
  font-size: 12px;
  color: #7f8c8d;
  margin-right: 5px;
}

.price-value {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
}

.flight-number {
  font-size: 12px;
  color: #7f8c8d;
}

@media (max-width: 960px) {
  .booking-title {
    font-size: 24px;
  }
  
  .airport-code {
    font-size: 20px;
  }
}

@media (max-width: 600px) {
  .route-display {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .airport-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    &.origin, &.destination {
      text-align: left;
    }
  }
  
  .flight-connector {
    width: 100%;
    margin: 10px 0;
    align-items: flex-start;
  }
  
  .flight-line {
    width: 100%;
  }
}
</style>

<script>
export default {
  methods: {
    calculateDuration(start, end) {
      if (!start || !end) return '';
      
      const startTime = new Date(`2000-01-01T${start}`);
      const endTime = new Date(`2000-01-01T${end}`);
      const diff = endTime - startTime;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    }
  }
}
</script>