<script setup>
import { usePagesStore } from '@/stores/usePages';
import { useSettingStore } from '@/stores/useSetting';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';

const pagesStore = usePagesStore();

const settingStore = useSettingStore();
const { settingsData } = storeToRefs(settingStore);

const pages = ref([]);

onMounted(async () => {
  const { data } = await pagesStore.fetchPages();
  pages.value = data.value;
});
</script>


<template>
  <v-footer class="py-10">
    <v-container>
      <v-row>
        <v-col cols="6" xs="6" sm="4" lg="3" md="3">
          <h4 class="text-grey-darken-1 font-weight-regular">Jetshare</h4>
          <ul>
            <li><a href="#"> Safety </a></li>
            <li><a href="#"> Our Story </a></li>
            <li><a href="#"> Reviews </a></li>
            <li><a href="#"> Travel Advisors </a></li>
            <li><a href="#"> Charters by Jetshare </a></li>
            <li><a href="#"> JetsharePrivate™ </a></li>
            <li><a href="#"> Careers </a></li>
          </ul>
        </v-col>
        <v-col cols="6" xs="6" sm="4" lg="3" md="3">
          <h4 class="text-grey-darken-1 font-weight-regular">
            Resources
          </h4>
         <ul>
            <li v-for="page in pages" :key="page.id">
              <router-link :to="`/${page.slug}`">{{ page.slug }}</router-link>
            </li>
          </ul>
        </v-col>
        <v-col cols="5" xs="6" sm="4" lg="2" md="3">
          <h4 class="text-grey-darken-1 font-weight-regular">Connect</h4>
          <ul>
            <li><a :href="`${settingsData?.instagram}`"> Instagram </a></li>
            <li><a :href="`${settingsData?.facebook}`"> Facebook </a></li>
            <li><a :href="`${settingsData?.linkedIn}`"> LinkedIn </a></li>
          </ul>
        </v-col>
        <v-col cols="7" xs="12" sm="12" lg="4" md="3">
          <h4 class="text-caption-2 text-grey-darken-1 font-weight-regular">
            Sign up for info on special partnerships and new destinations
          </h4>

          <v-text-field
            density="comfortable"
            label="E-mail"
            variant="outlined"
            hide-details
            single-line
            bg-color="#f3f3f3"
            class="email-field mt-5"
            append-inner-icon="mdi-arrow-right"
          ></v-text-field>
          <p class="text-caption text-grey-darken-1 font-weight-regular mt-10">
            By subscribing you are accepting to receive marketing information from Jetshare and agree to the terms of Jetshare’s Privacy Policy.
          </p>
        </v-col>
      </v-row>

      <div class="footer-bottom">
        <v-row>
          <v-col cols="12" lg="6" md="6"><p class="text-caption text-grey-darken-1 font-weight-regular">
              Unless otherwise advised: All flights within North America are
              operated by USAC Airways 695 LLC dba Jetshare, and Jetshare Technologies
              Inc. Acts as an indirect air carrier under US-DOT Part 380.
            </p></v-col
          >
          <v-col cols="12" lg="6" md="6">
            <ul class="bottom-navigate d-flex">
              <li><a href="#"> Privacy Policy </a></li>
              <li>
                <a href="#"> Terms of Use </a>
              </li>
            </ul>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup></script>

<style scoped>
ul {
  margin-top: 15px;
}
ul li {
  font-size: 14px;
  margin-top: 12px;
}
ul li a {
  font-weight: 700;
  color: #000;
  text-transform: capitalize;
}
ul li a:hover {
  text-decoration: underline;
}
.footer-bottom {
  border-top: 1px solid #c3c3c365;
  margin-top: 40px;
  padding-top: 20px;
}
.bottom-navigate {
  margin-top: 0px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}
.bottom-navigate li {
  font-size: 13px;
  margin-top: 0px;
}
.bottom-navigate li a {
  font-weight: 500;
  color: #777474;
}
</style>
