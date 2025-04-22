<script setup>

</script>

<template>
    <div class="departure-history">
        <h3 class="text-h4 text-grey-lighten-2">Departure</h3>
        <h3 class="text-h4 text-white mt-2">Thursday, April 3</h3>
        <v-divider class="my-2 mt-10" color="#fff"></v-divider>
        <div class="departure-item">
            <div class="flight-content">
                <v-row no-gutters align="center">
                    <v-col cols="4">
                        <div>
                            <h3 class="text-h5 text-white font-weight-regular">08:05</h3>
                            <h5 class="text-body-2 text-grey-lighten-4 font-weight-regular mt-2">Göteborg</h5>
                            <p class="text-caption text-grey-lighten-2">Landvetter Flygplats</p>
                            <p class="text-caption text-grey-lighten-2">JIVAIR Executive Jets FBO</p>
                        </div>
                    </v-col>
                    <v-col cols="4">
                        <div>
                            <v-img src="/public/images/subPage/plane.svg" class="mx-auto" width="100%" max-width="260px"></v-img>
                            <div class="time-text text-center text-caption text-grey-lighten-4 font-weight-regular">
                            0H 40MIN
                        </div>
                        </div>
                    </v-col>
                    <v-col cols="4">
                        <div class="text-right">
                            <h3 class="text-h5 text-white font-weight-regular">08:45</h3>
                            <h5 class="text-body-2 text-grey-lighten-4 font-weight-regular mt-2">Stockholm</h5>
                            <p class="text-caption text-grey-lighten-2">Bromma Flygplats</p>
                            <p class="text-caption text-grey-lighten-2">GRAFAIR Executive Jets FBO</p>
                        </div>
                    </v-col>
                </v-row>
            </div>
    </div>
    <v-divider class="my-2" color="#fff"></v-divider>
    <div class="departure-item">
        <div class="flight-content">
                <v-row no-gutters align="center">
                    <v-col cols="4">
                        <div>
                            <h3 class="text-h5 text-white font-weight-regular">08:05</h3>
                            <h5 class="text-body-2 text-grey-lighten-4 font-weight-regular mt-2">Göteborg</h5>
                            <p class="text-caption text-grey-lighten-2">Landvetter Flygplats</p>
                            <p class="text-caption text-grey-lighten-2">JIVAIR Executive Jets FBO</p>
                        </div>
                    </v-col>
                    <v-col cols="4">
                        <div>
                            <v-img src="/public/images/subPage/plane.svg" class="mx-auto" width="100%" max-width="260px"></v-img>
                            <div class="time-text text-center text-caption text-grey-lighten-4 font-weight-regular">
                            0H 40MIN
                        </div>
                        </div>
                    </v-col>
                    <v-col cols="4">
                        <div class="text-right">
                            <h3 class="text-h5 text-white font-weight-regular">08:45</h3>
                            <h5 class="text-body-2 text-grey-lighten-4 font-weight-regular mt-2">Stockholm</h5>
                            <p class="text-caption text-grey-lighten-2">Bromma Flygplats</p>
                            <p class="text-caption text-grey-lighten-2">GRAFAIR Executive Jets FBO</p>
                        </div>
                    </v-col>
                </v-row>
            </div>
       </div>
    </div>
     
</template>


<style lang="scss" scoped>
.departure-history{
    background-color: #6C7A90;
    padding: 20px;
    border-radius: 26px;
    max-width: 600px;
    margin: 60px auto 0;
}
.departure-item {
    height: auto;
    width: 100%;
    max-width: 600px;
    border-radius: 10px;
    padding: 10px 0;
}

.flight-content {
    width: 100%;
    position: relative;

}

.flight-content h5 {
    line-height: 1.1;
    margin-top: 2px;
}
.time-text{
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}
.seat-wrap{
    display: flex;
    gap: 2px;
    margin-top: 6px;
}
.seat-wrap span{
    width: 23px;
    height: 23px;
    border: 1px solid #dedbdb5d;
    color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}
</style>