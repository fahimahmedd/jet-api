<script setup>

</script>

<template>
    <div class="explore py-10">
        <v-container>
            <v-row class="d-flex align-center">
                <v-col cols="12" lg="5" md="6">
                    <div class="explore-content">
                    <h2 class="text-h4 text-black">Explore Destinations</h2>
                    <h3 class="text-black font-weight-light">Wherever you choose to wander, fly in signature Aero style.</h3>
                    <p class="font-weight-light text-grey-darken-2">Jet to a collection of sought-after leisure destinations or seek out an elevated travel experience to the world's largest entertainment and sporting events.</p>
                    <div class="mt-10 text-h6 text-black font-weight-medium">Where should we jet next? <span class="mdi mdi-arrow-right"></span> </div>
                    </div>

                    
            <v-btn class="booking-btn mt-16" variant="outlined"
            rounded="xl" size="large" width="400"
            >Book Your Seat</v-btn>
                </v-col>
                <v-col cols="12" lg="7" md="6">
                    <v-img src="/public/images/explore/map.webp"   cover
                    rounded="xl"></v-img>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<style lang="scss" scoped>
   .explore-content h3{
    font-size: 18px;
    padding-top: 120px;
   }
   .explore-content p{
    font-size: 17px;
   }
   
.booking-btn{
    background-color: #000;
    font-weight: 700;
    color: #fff;
}

@media (max-width: 991px) {
    .explore-content h3{
    padding-top: 20px;
   }
}
</style>