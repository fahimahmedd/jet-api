import { createRouter, createWebHistory , createWebHashHistory } from 'vue-router'
import Index from '@/pages/index.vue'
import Trip from '@/pages/trip.vue'
import Signup from '@/pages/signup.vue'
import Signin from '@/pages/signin.vue'
import Seat from '@/pages/seat.vue'
import ReturnDeparture from '@/pages/return-departure.vue'
import OutboundDeparture from '@/pages/outbound-departure.vue'
import Guest from '@/pages/guest.vue'
import Flight from '@/pages/flight.vue'
import Booked from '@/pages/booked.vue'
import Profile from '@/pages/profile.vue'
import Checkout from '@/pages/checkout.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Index,
    },
    {
      path: '/trip',
      name: 'trip',
      component: Trip,
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
    },
    {
      path: '/signin',
      name: 'signin',
      component: Signin,
    },
    {
      path: '/seat',
      name: 'seat-detail',
      component: Seat,
    },
    {
      path: '/return-departure',
      name: 'return-departure',
      component: ReturnDeparture,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/outbound-departure',
      name: 'outbound-departure',
      component: OutboundDeparture,
    },
    {
      path: '/guest',
      name: 'guest',
      component: Guest,
    },
    {
      path: '/flight',
      name: 'flight',
      component: Flight,
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout,
    },
    {
      path: '/booked',
      name: 'booked',
      component: Booked,
    },
    {
      path: '/seat/:id',
      name: 'seat',
      component: Seat,
    },
 // Add a catch-all route for 404 errors
//  {
//   path: '/:pathMatch(.*)*',
//   name: 'not-found',
//   component: () => import('@/pages/NotFound.vue') // Lazy load 404 page
// }
    
  ],
})

export default router
