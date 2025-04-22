<script setup>

</script>

<template>
    <div class="explore py-16 bg-black">
        <v-container>
            <v-row align="center">
                <v-col cols="12" lg="5" md="6">
                    <div class="explore-content">
                    <h2 class="text-h4 text-white">Safety Always</h2>
                    <h3 class="text-white font-weight-light">Aero holds itself to the highest safety standards, mirroring many of the requirements governing commercial airlines.</h3>
                    <p class="font-weight-light text-grey-darken-1 mt-2">In addition to our specialization in a single fleet type, owning and operating all of our Embraer Aircraft, we've earned the prestigious ARGUS Platinum rating, which recognizes our safety procedures and places us among the top 5% of private aviation operators worldwide.</p>
                    </div>

                    
            <v-btn class="booking-btn mt-16" variant="outlined"
            rounded="xl" size="large" width="400"
            >Book Your Seat</v-btn>
                </v-col>
                <v-col cols="12" lg="7" md="6">
                    <v-img src="/public/images/explore/safety.webp"   cover
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
    background-color: #fff;
    font-weight: 700;
    color: #000;
}

@media (max-width: 991px) {
    .explore-content h3{
    padding-top: 20px;
   }
}
</style>