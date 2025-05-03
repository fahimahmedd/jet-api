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
    <h2 class="booking-header">Your Flight Tickets</h2>
    
    <v-progress-linear
      v-if="bookStore.loading"
      indeterminate
      color="primary"
      class="mb-4"
    ></v-progress-linear>
    
    <v-alert
      v-if="bookStore.error"
      type="error"
      class="mb-4"
    >
      {{ bookStore.error }}
    </v-alert>

    <div class="ticket-grid">
      <div 
        v-for="booking in currentBookings" 
        :key="booking.id" 
        class="ticket-card"
        :class="{
          'ticket-confirmed': booking.status === 'confirmed',
          'ticket-pending': booking.status === 'pending'
        }"
      >
        <div class="ticket-header">
          <div class="airline-logo">
            <v-img src="/public/images/logo/logo.png" width="60" />
          </div>
          <div class="ticket-status">
            <v-chip 
              small 
              :color="booking.status === 'confirmed' ? 'success' : 'warning'"
              class="status-chip"
            >
              {{ booking.status.toUpperCase() }}
            </v-chip>
          </div>
        </div>

        <div class="ticket-body">
          <div class="flight-route">
            <div class="route-info">
              <div class="city">{{ booking.flight.origin.city }}</div>
              <div class="code">{{ booking.flight.origin.code }}</div>
            </div>
            
            <div class="flight-details">
              <div class="flight-icon">
                <v-icon>mdi-airplane</v-icon>
              </div>
              <div class="flight-duration">
                {{ formatTime(booking.flight.departure_start_time) }} - {{ formatTime(booking.flight.departure_land_time) }}
              </div>
              <div class="flight-type">
                {{ booking.trip_type === 'oneway' ? 'ONE WAY' : 'ROUND TRIP' }}
              </div>
            </div>
            
            <div class="route-info text-right">
              <div class="city">{{ booking.flight.destination.city }}</div>
              <div class="code">{{ booking.flight.destination.code }}</div>
            </div>
          </div>

          <v-divider class="my-3"></v-divider>

          <div class="flight-info">
            <div class="info-item">
              <div class="info-label">Date</div>
              <div class="info-value">{{ formatDate(booking.flight.departure_date) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Flight No.</div>
              <div class="info-value">FL-{{ booking.flight.id }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Booking Ref.</div>
              <div class="info-value">BK-{{ booking.id }}</div>
            </div>
          </div>

          <v-divider class="my-3"></v-divider>

          <div class="seat-info">
            <div class="seat-label">Seats:</div>
            <div class="seat-tags">
              <v-chip
                v-for="seat in booking.seats"
                :key="seat.id"
                small
                color="primary"
                class="mr-1 mb-1"
              >
                {{ seat.seat_number }}
              </v-chip>
            </div>
          </div>
        </div>

        <div class="ticket-footer">
          <div class="price">{{ booking.total_price }}</div>
          <!-- <div class="barcode">
            <v-img src="/images/barcode.svg" height="30" />
          </div> -->
        </div>
      </div>
    </div>

    <v-alert
      v-if="!bookStore.loading && currentBookings.length === 0"
      type="info"
      class="mt-4"
    >
      You don't have any bookings yet
    </v-alert>
  </div>
</template>

<style scoped>
.booking-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.booking-header {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.ticket-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.ticket-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.ticket-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.ticket-confirmed {
  border-top: 4px solid #4CAF50;
}

.ticket-pending {
  border-top: 4px solid #FFC107;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f9f9f9;
}

.status-chip {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.ticket-body {
  padding: 20px;
}

.flight-route {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.route-info {
  flex: 1;
}

.city {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.code {
  font-size: 14px;
  color: #666;
}

.flight-details {
  flex: 2;
  text-align: center;
}

.flight-icon {
  color: #3F51B5;
  margin-bottom: 5px;
}

.flight-duration {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.flight-type {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 5px;
}

.flight-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.info-item {
  text-align: center;
}

.info-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  margin-top: 3px;
}

.seat-info {
  display: flex;
  align-items: center;
}

.seat-label {
  font-size: 14px;
  margin-right: 10px;
  color: #666;
}

.ticket-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f5f5f5;
}

.price {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

@media (max-width: 600px) {
  .ticket-grid {
    grid-template-columns: 1fr;
  }
  
  .flight-info {
    grid-template-columns: 1fr;
  }
}
</style>