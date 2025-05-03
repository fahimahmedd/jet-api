<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  // Sample booking data - replace with actual data from store/route
  const booking = ref({
    flight: {
      id: 4521,
      origin: { code: 'JFK', city: 'New York' },
      destination: { code: 'LAX', city: 'Los Angeles' },
      departure_date: '2023-06-15',
      departure_time: '08:30:00',
      arrival_time: '11:45:00'
    },
    seats: ['12A', '12B']
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const calculateDuration = () => {
    const dep = booking.value.flight?.departure_time || '08:30:00';
    const arr = booking.value.flight?.arrival_time || '11:45:00';
    
    const depHours = parseInt(dep.split(':')[0]);
    const depMins = parseInt(dep.split(':')[1]);
    const arrHours = parseInt(arr.split(':')[0]);
    const arrMins = parseInt(arr.split(':')[1]);
    
    let hours = arrHours - depHours;
    let mins = arrMins - depMins;
    
    if (mins < 0) {
      hours--;
      mins += 60;
    }
    
    return `${hours}h ${mins}m`;
  };
  
  
  
  const downloadTicket = () => {
    // Implement download functionality
    console.log('Downloading ticket...');
  };
  
  const goToBookings = () => {
    router.push('/bookings');
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
          <div class="checkmark-animation">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
  
          <h1 class="confirmation-title">Booking Confirmed!</h1>
          <p class="confirmation-subtitle">Your flight has been successfully booked</p>
  
          <div class="confirmation-details">
            <div class="detail-item">
              <v-icon color="#6d92cf">mdi-airplane</v-icon>
              <div>
                <div class="detail-label">Flight Number</div>
                <div class="detail-value">SW{{ booking.flight?.id || '1234' }}</div>
              </div>
            </div>
  
            <div class="detail-item">
              <v-icon color="#6d92cf">mdi-calendar</v-icon>
              <div>
                <div class="detail-label">Departure Date</div>
                <div class="detail-value">{{ formatDate(booking.flight?.departure_date) || 'June 15, 2023' }}</div>
              </div>
            </div>
  
            <div class="detail-item">
              <v-icon color="#6d92cf">mdi-account-multiple</v-icon>
              <div>
                <div class="detail-label">Passengers</div>
                <div class="detail-value">{{ booking.seats?.length || 1 }} traveler(s)</div>
              </div>
            </div>
          </div>
  
          <div class="route-display">
            <div class="airport origin">
              <div class="code">{{ booking.flight?.origin?.code || 'JFK' }}</div>
              <div class="city">{{ booking.flight?.origin?.city || 'New York' }}</div>
            </div>
  
            <div class="flight-path">
              <div class="duration">{{ calculateDuration() }}</div>
              <div class="line"></div>
              <v-icon color="#6d92cf">mdi-airplane</v-icon>
            </div>
  
            <div class="airport destination">
              <div class="code">{{ booking.flight?.destination?.code || 'LAX' }}</div>
              <div class="city">{{ booking.flight?.destination?.city || 'Los Angeles' }}</div>
            </div>
          </div>
  
          <div class="confirmation-actions">
            <v-btn 
              color="#6d92cf" 
              large 
              class="action-btn"
              @click="downloadTicket"
            >
              <v-icon left>mdi-download</v-icon>
              Download Ticket
            </v-btn>
            
            <v-btn 
              outlined 
              color="#6d92cf" 
              large 
              class="action-btn"
              @click="goToBookings"
            >
              <v-icon left>mdi-text-box-outline</v-icon>
              View All Bookings
            </v-btn>
            <v-btn 
              outlined 
              color="#6d92cf" 
              large 
              class="action-btn"
              @click="goToHome"
            >
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
    padding-top: 50px;
    padding-bottom: 50px;
    position: relative;
    overflow: hidden;
  }
  
  
  
  .confirmation-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
  }
  
  .confirmation-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 40px;
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
      background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
    }
  }
  
  .checkmark-animation {
    margin: 0 auto 20px;
    width: 100px;
    height: 100px;
  }
  
  .checkmark {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: block;
    stroke-width: 4;
    stroke: #fff;
    stroke-miterlimit: 10;
    margin: 0 auto;
    animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
    
    &__circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 4;
      stroke-miterlimit: 10;
      stroke: #4bb71b;
      fill: none;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }
    
    &__check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
    }
  }
  
  @keyframes stroke {
    100% { stroke-dashoffset: 0; }
  }
  
  @keyframes scale {
    0%, 100% { transform: none; }
    50% { transform: scale3d(1.1, 1.1, 1); }
  }
  
  @keyframes fill {
    100% { box-shadow: inset 0 0 0 100px #4bb71b; }
  }
  
  .confirmation-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 10px;
    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .confirmation-subtitle {
    font-size: 1.2rem;
    color: #7f8c8d;
    margin-bottom: 30px;
  }
  
  .confirmation-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 30px 0;
    text-align: left;
  }
  
  .detail-item {
    display: flex;
    align-items: center;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    
    .v-icon {
      margin-right: 15px;
      font-size: 28px;
    }
  }
  
  .detail-label {
    font-size: 0.8rem;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .detail-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin-top: 5px;
  }
  
  .route-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 40px 0;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
  }
  
  .airport {
    flex: 1;
    
    .code {
      font-size: 2rem;
      font-weight: 700;
      color: #2c3e50;
    }
    
    .city {
      font-size: 1rem;
      color: #7f8c8d;
      margin-top: 5px;
    }
  }
  
  .flight-path {
    flex: 2;
    position: relative;
    padding: 0 20px;
    
    .duration {
      font-size: 0.9rem;
      color: #7f8c8d;
      margin-bottom: 10px;
    }
    
    .line {
      height: 2px;
      background: #bdc3c7;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        background: #bdc3c7;
        top: 0;
        left: 0;
      }
    }
    
    .v-icon {
      position: absolute;
      left: 50%;
      bottom: -10px;
      transform: translateX(-50%);
      background: #f8f9fa;
      padding: 0 10px;
    }
  }
  
  .confirmation-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 30px 0;
    
    .action-btn {
      min-width: 200px;
    }
  }
  
  .confirmation-note {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    color: #7f8c8d;
    margin-top: 20px;
    
    .v-icon {
      margin-right: 8px;
    }
  }
  
  .confetti-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
  }
  
  .confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: var(--color);
    left: var(--x);
    top: var(--y);
    transform: rotate(var(--angle));
    animation: confettiFall var(--speed) var(--delay) linear infinite;
    opacity: 0.8;
  }
  
  @keyframes confettiFall {
    0% { transform: translateY(-100vh) rotate(var(--angle)); }
    100% { transform: translateY(100vh) rotate(calc(var(--angle) * 2)); }
  }
  
  @media (max-width: 768px) {
    .confirmation-card {
      padding: 30px 20px;
    }
    
    .confirmation-title {
      font-size: 2rem;
    }
    
    .confirmation-details {
      grid-template-columns: 1fr;
    }
    
    .route-display {
      flex-direction: column;
      gap: 20px;
    }
    
    .flight-path {
      width: 100%;
      padding: 20px 0;
      
      .line {
        width: 100%;
      }
    }
    
    .confirmation-actions {
      flex-direction: column;
      gap: 10px;
      
      .action-btn {
        width: 100%;
      }
    }
  }
  </style>