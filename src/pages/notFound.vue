<template>
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-illustration">
          <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M150 50L175 75L150 100L125 75L150 50Z" fill="#FF5252" stroke="#D32F2F" stroke-width="2"/>
            <path d="M100 100L125 125L100 150L75 125L100 100Z" fill="#FF5252" stroke="#D32F2F" stroke-width="2"/>
            <path d="M200 100L225 125L200 150L175 125L200 100Z" fill="#FF5252" stroke="#D32F2F" stroke-width="2"/>
            <circle cx="150" cy="75" r="5" fill="#D32F2F"/>
            <circle cx="125" cy="125" r="5" fill="#D32F2F"/>
            <circle cx="175" cy="125" r="5" fill="#D32F2F"/>
            <path d="M50 50H250V150H50V50Z" stroke="#E0E0E0" stroke-width="2" stroke-dasharray="4 4"/>
            <path d="M60 60H240V140H60V60Z" stroke="#E0E0E0" stroke-width="2" stroke-dasharray="4 4"/>
          </svg>
        </div>
        
        <h1 class="error-title">404 - Page Not Found</h1>
        
        <p class="error-message">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <v-btn
          color="primary"
          size="large"
          rounded
          class="home-button"
          @click="goHome"
        >
          <v-icon start>mdi-home</v-icon>
          Return to Home
        </v-btn>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const goHome = () => {
    router.push('/')
  }
  </script>
  
  <style scoped>
  .not-found-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 2rem;
  }
  
  .not-found-content {
    text-align: center;
    max-width: 600px;
    padding: 2rem;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .error-illustration {
    margin-bottom: 2rem;
  }
  
  .error-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 1rem;
  }
  
  .error-message {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  .home-button {
    padding: 0.75rem 2rem;
    font-weight: 600;
    text-transform: none;
    letter-spacing: normal;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .home-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 600px) {
    .error-title {
      font-size: 2rem;
    }
    
    .error-message {
      font-size: 1rem;
    }
    
    .not-found-content {
      padding: 1.5rem;
    }
  }
  </style>