<template>
    <div class="loader-screen">
    <div>
         <img src="https://zupimages.net/up/19/34/4820.gif" class="plane-img">
    </div>
    <div class="app-icon">
        <img src="/public/images/loader-icon.png" alt="">
    </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.loader-screen{
    background: #000;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999999;
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.app-icon{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 150px;
    img{
        height: 100%;
        width: 100%;
        object-fit: contain;
    }
}
.plane {
  position: absolute;
  margin: 0 auto;
  width: 100%;
}

.plane-img {
  -webkit-animation: spin 2.5s linear infinite;
  -moz-animation: spin 2.5s linear infinite;
  animation: spin 2.5s linear infinite;
}

@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}

@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}


.earth-wrapper {
  position: absolute;
  margin: 0 auto;
  width: 100%;
  padding-top: 2.7rem;
}

.earth {
  width: 150px;
  height: 150px;
  background: url("https://zupimages.net/up/19/34/6vlb.gif");
  border-radius: 100%;
  background-size: 320px;
  animation: earthAnim 12s infinite linear;
  margin: 0 auto;
  border: 1px solid #CDD1D3;
}

@keyframes earthAnim {
  0% {background-position-x: 0;}
  100% {background-position-x: -340px;}
}

@media screen and (max-width: 420px) {
  .departure_city {
    left: 0;
    right: 0;
    top: 30%;
    position: absolute;
    margin: 0 auto;
  }
  
  .arrival_city {
    left: 0;
    right: 0;
    top: 93%;
    position: absolute;
    margin: 0 auto;
  }
  
  
}
</style>