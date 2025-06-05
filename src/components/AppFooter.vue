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
  <v-footer class="py-10 py-sm-16">
    <v-container>
      <v-row>
        <!-- Company Links -->
        <v-col cols="6" xs="6" sm="4" lg="3" md="3" class="mb-6 mb-sm-0">
          <h4 class="text-grey-darken-1 font-weight-regular">Jetshare</h4>
          <ul class="footer-links">
            <li><a href="#">Safety</a></li>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Reviews</a></li>
            <li><a href="#">Travel Advisors</a></li>
            <li><a href="#">Charters by Jetshare</a></li>
            <li><a href="#">JetsharePrivate™</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </v-col>

        <!-- Resources -->
        <v-col cols="6" xs="6" sm="4" lg="3" md="3" class="mb-6 mb-sm-0">
          <h4 class="text-grey-darken-1 font-weight-regular">Resources</h4>
          <ul class="footer-links">
            <li v-for="page in pages" :key="page.id">
              <router-link :to="`/${page.slug}`">{{ page.slug }}</router-link>
            </li>
          </ul>
        </v-col>

        <!-- Connect -->
        <v-col cols="6" xs="6" sm="4" lg="2" md="3" class="mb-6 mb-md-0">
          <h4 class="text-grey-darken-1 font-weight-regular">Connect</h4>
          <ul class="footer-links">
            <li><a :href="settingsData?.instagram">Instagram</a></li>
            <li><a :href="settingsData?.facebook">Facebook</a></li>
            <li><a :href="settingsData?.linkedIn">LinkedIn</a></li>
          </ul>
        </v-col>

        <!-- Newsletter -->
        <v-col cols="12" sm="12" lg="4" md="3" class="mt-6 mt-sm-0">
          <h4 class="text-grey-darken-1 font-weight-regular text-sm-center text-lg-start">
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
          
          <p class="text-caption text-grey-darken-1 font-weight-regular mt-6 mt-sm-10">
            By subscribing you are accepting to receive marketing information from Jetshare and agree to the terms of Jetshare's Privacy Policy.
          </p>
        </v-col>
      </v-row>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <v-row class="align-center">
          <v-col cols="12" lg="6" md="6" class="mb-4 mb-lg-0">
            <p class="text-caption text-grey-darken-1 font-weight-regular">
              Unless otherwise advised: All flights within North America are
              operated by USAC Airways 695 LLC dba Jetshare, and Jetshare Technologies
              Inc. Acts as an indirect air carrier under US-DOT Part 380.
            </p>
          </v-col>
          
          <v-col cols="12" lg="6" md="6">
            <ul class="bottom-navigate">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Use</a></li>
            </ul>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-footer>
</template>

<style lang="scss" scoped>
.footer-links {
  margin-top: 15px;
  
  li {
    font-size: 14px;
    margin-top: 12px;
    line-height: 1.4;
    
    a {
      font-weight: 700;
      color: #000;
      text-transform: capitalize;
      transition: all 0.2s ease;
      
      &:hover {
        text-decoration: underline;
        opacity: 0.8;
      }
    }
  }
}

.footer-bottom {
  border-top: 1px solid rgba(195, 195, 195, 0.4);
  margin-top: 40px;
  padding-top: 20px;
}

.bottom-navigate {
  display: flex;
  gap: 20px;
  justify-content: flex-start;
  
  li {
    font-size: 13px;
    
    a {
      font-weight: 500;
      color: #777474;
      transition: all 0.2s ease;
      
      &:hover {
        color: #000;
        text-decoration: underline;
      }
    }
  }
}

.email-field {
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  
  @media (min-width: 960px) {
    margin-left: 0;
    margin-right: 0;
  }
}

@media (max-width: 1279px) {
  .footer-links li {
    font-size: 13px;
  }
}

@media (max-width: 959px) {
  .footer-links {
    margin-top: 12px;
    
    li {
      font-size: 12px;
      margin-top: 10px;
    }
  }
  
  .footer-bottom {
    margin-top: 30px;
    padding-top: 15px;
  }
  
  .bottom-navigate {
    justify-content: center;
  }
}

@media (max-width: 599px) {
  .footer-links {
    li {
      font-size: 11px;
      margin-top: 8px;
    }
  }
  
  .bottom-navigate {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
}
</style>