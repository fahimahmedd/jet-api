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
  <div class="booking-container pa-4 pa-sm-6">
    <h2 class="booking-title text-h5 text-sm-h4">Your Flight Itineraries</h2>
    
    <v-progress-linear
      v-if="bookStore.loading"
      indeterminate
      color="#6d92cf"
      class="mb-4"
    ></v-progress-linear>

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
              density="comfortable"
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
                <span class="d-flex flex-wrap">
                  <v-chip
                    v-for="seat in booking.seats"
                    :key="seat.id"
                    x-small
                    color="#6d92cf"
                    class="mr-1 mb-1 seat-batch"
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
  padding-bottom: 32px;
}

.booking-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 24px;
  text-align: center;
  position: relative;
  
  @media (min-width: 600px) {
    margin-bottom: 32px;
  }
}

.booking-grid {
  margin-top: 16px;
  
  @media (min-width: 600px) {
    margin-top: 24px;
  }
}

.trip-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(50, 50, 50, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
  
  @media (max-width: 600px) {
    margin-bottom: 24px;
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
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  
  @media (min-width: 600px) {
    padding: 16px 20px;
  }
}

.airline-brand {
  display: flex;
  align-items: center;
}

.airline-logo {
  width: 32px;
  height: 32px;
  background-color: #e3f2fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  
  @media (min-width: 600px) {
    width: 36px;
    height: 36px;
  }
}

.status-badge {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.seat-batch {
  font-weight: 500;
  letter-spacing: 0.2px;
  font-size: 12px;
}

.trip-card-body {
  padding: 16px;
  flex-grow: 1;
  
  @media (min-width: 600px) {
    padding: 20px;
  }
}

.route-display {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  
  @media (min-width: 600px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
}

.airport-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 12px;
  
  @media (min-width: 600px) {
    display: block;
    flex: 1;
    margin-bottom: 0;
    
    &.origin {
      text-align: left;
    }
    
    &.destination {
      text-align: right;
    }
  }
}

.airport-code {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 2px;
  
  @media (min-width: 600px) {
    font-size: 22px;
    margin-bottom: 4px;
  }
}

.airport-city {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 4px;
  
  @media (min-width: 600px) {
    font-size: 13px;
    margin-bottom: 8px;
  }
}

.flight-time {
  font-size: 14px;
  font-weight: 600;
  color: #34495e;
  
  @media (min-width: 600px) {
    font-size: 16px;
  }
}

.flight-connector {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin: 8px 0 12px;
  
  @media (min-width: 600px) {
    flex: 1;
    padding: 0 10px;
    margin: 0;
  }
}

.flight-duration {
  font-size: 11px;
  color: #7f8c8d;
  margin-bottom: 4px;
}

.flight-line {
  width: 100%;
  height: 1px;
  background-color: #bdc3c7;
  position: relative;
  margin: 4px 0;
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
  margin-top: 4px;
}

.flight-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 12px;
  
  @media (min-width: 400px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #34495e;
  
  @media (min-width: 600px) {
    font-size: 13px;
  }
}

.trip-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  
  @media (min-width: 600px) {
    padding: 12px 20px;
  }
}

.price-tag {
  display: flex;
  align-items: center;
}

.price-label {
  font-size: 12px;
  color: #7f8c8d;
  margin-right: 4px;
}

.price-value {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  
  @media (min-width: 600px) {
    font-size: 18px;
  }
}

.flight-number {
  font-size: 11px;
  color: #7f8c8d;
  
  @media (min-width: 600px) {
    font-size: 12px;
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