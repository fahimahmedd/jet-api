<script setup>

</script>

<template>
    <div class="explore py-10 bg-black">
        <v-container>
            <v-row class="d-flex align-center">
                <v-col cols="12" lg="5" md="6">
                    <div class="explore-content">
                    <h2 class="text-h4 text-white">The Art of Traveling Well </h2>
                    <h3 class="text-white font-weight-light">Thoughtfully curated to redefine your expectations.</h3>
                    <p class="font-weight-light text-grey-darken-1 mt-2">With a shared dedication to hospitality, the brand partners we've integrated throughout your journey offer the highest level of product integrity, attentive service, and experience to indulge the senses from start to finish.</p>
                    </div>

                    
            <v-btn class="booking-btn mt-16" variant="outlined"
            rounded="xl" size="large" width="400"
            >Book Your Seat</v-btn>
                </v-col>
                <v-col cols="12" lg="7" md="6">
                    <v-img src="/public/images/explore/travel.webp"   cover
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