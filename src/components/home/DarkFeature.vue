<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const title = computed(() => {
  return props.data?.title || 'Safety Always';
});

const subtitle = computed(() => {
  return props.data?.subtitle || 'Jetshare holds itself to the highest safety standards, mirroring many of the requirements governing commercial airlines.';
});

const description = computed(() => {
  return props.data?.description || 'In addition to our specialization in a single fleet type, owning and operating all of our Embraer Aircraft, we\'ve earned the prestigious ARGUS Platinum rating, which recognizes our safety procedures and places us among the top 5% of private aviation operators worldwide.';
});

const buttonText = computed(() => {
  return props.data?.button_text || 'Book Your Seat';
});

const buttonLink = computed(() => {
  return props.data?.button_link || '/flight';
});

const image = computed(() => {
  return props.data?.image || '/public/images/explore/safety.webp';
});
</script>

<template>
    <div class="explore py-10 py-sm-16 bg-black">
        <v-container>
            <v-row align="center">
                <v-col cols="12" lg="5" md="6" order="2" order-md="1">
                    <div class="explore-content">
                        <h2 class="font-weight-regular text-white">{{ title }}</h2>
                        <h3 class="text-white font-weight-light mt-2 mt-sm-4">
                            {{ subtitle }}
                        </h3>
                        <p class="font-weight-light text-grey-darken-1 mt-4 mt-sm-6">
                            {{ description }}
                        </p>
                    </div>

                    <div class="btn-max mt-8 mt-sm-16">
                          <v-btn
                                class="booking-btn"
                                variant="outlined"
                                rounded="xl"
                                size="large"
                                :width="$vuetify.display.smAndDown ? '100%' : '100%'"
                                :to="buttonLink"
                            >
                                {{ buttonText }}
                            </v-btn>
                    </div>
                </v-col>
                <v-col cols="12" lg="7" md="6" order="1" order-md="2" class="mb-8 mb-md-0">
                    <v-img 
                        :src="image"   
                        cover
                        rounded="xl"
                        min-height="300"
                        :max-height="$vuetify.display.mdAndUp ? '600' : '400'"
                    ></v-img>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<style lang="scss" scoped>
.explore-content {
    h2 {
        font-size: 36px;
        line-height: 1.2;
    }
    
    h3 {
        font-size: 18px;
        line-height: 1.4;
    }
    
    p {
        font-size: 17px;
        line-height: 1.6;
    }
}

.booking-btn {
    background-color: #fff;
    color: #000;
    font-size: 18px;
    text-transform: capitalize;
    min-height: 48px;
    font-weight: 500;
    letter-spacing: 0.5px;
    border: 2px solid #fff !important;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: transparent !important;
        color: #fff !important;
    }
}

.btn-max {
    max-width: 400px;
}

@media (max-width: 1279px) {
    .explore-content {
        h2 {
            font-size: 32px;
        }
        
        h3 {
            font-size: 17px;
        }
        
        p {
            font-size: 16px;
        }
    }
    
    .booking-btn {
        font-size: 17px;
    }
}

@media (max-width: 959px) {
    .explore {
        padding-top: 60px;
        padding-bottom: 60px;
    }
    
    .explore-content {
        text-align: center;
        
        h2 {
            font-size: 28px;
        }
        
        h3 {
            font-size: 16px;
        }
    }
    
    .btn-max {
        margin-left: auto;
        margin-right: auto;
    }
}

@media (max-width: 599px) {
    .explore {
        padding-top: 40px;
        padding-bottom: 40px;
    }
    
    .explore-content {
        h2 {
            font-size: 24px;
        }
        
        h3 {
            font-size: 15px;
        }
        
        p {
            font-size: 15px;
        }
    }
    
    .booking-btn {
        font-size: 16px;
        min-height: 44px;
    }
}
</style>