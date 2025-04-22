<script setup>
import { ref } from "vue";
import { VDateInput } from "vuetify/labs/VDateInput";

const items = ref(["Male", "Female"]);
const rules = {
  email: (v) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(v) || "Invalid e-mail";
  },
  min: (v) => (v || "").length >= 6 || "Min 6 characters",
  required: (v) => !!v || "Required",
};

const selectedCountry = ref({
  code: "+1",
  flag: "🇺🇸",
  label: "US",
});
const phone = ref("");

const countries = [
  { code: "+1", flag: "🇺🇸", label: "US" , name:"USA" },
  { code: "+44", flag: "🇬🇧", label: "UK" , name:"United Kingdom" },
  { code: "+91", flag: "🇮🇳", label: "IND" , name:"India" },
  { code: "+880", flag: "🇧🇩", label: "BAN" , name:"Bangladesh" },
];
</script>

<template>
  <div class="form-content mt-5">
    <form>
      <v-row no-gutters>
        <v-col cols="6" class="px-2 mb-2">
          <v-text-field
            :rules="[rules.required]"
            placeholder="First Name"
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="px-2 mb-2">
          <v-text-field
            :rules="[rules.required]"
            placeholder="Last Name"
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="px-2 mb-2">
          <v-date-input
            label="Select a date"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            placeholder="Birthday (DD/MM/YYYY)"
            :rules="[rules.required]"
          ></v-date-input>
        </v-col>
        <v-col cols="6" class="px-2 mb-2">
          <v-select :items="items" label="Gender"></v-select>
        </v-col>

        <v-col cols="12" class="px-2 mb-2">
          <v-text-field
            prepend-inner-icon="mdi-email"
            :rules="[rules.email]"
            placeholder="E-mail"
          ></v-text-field>
        </v-col>

        <v-col cols="3" class="px-2">
          <v-select
            v-model="selectedCountry"
            hide-details
            :items="countries"
            item-title="label"
            item-value="code"
            return-object
            class="country-select"
          >
            <template #selection="{ item }">
              <div class="d-flex align-center">
                <span>{{ item.raw.flag }}</span
                >&nbsp;
                <span>{{ item.raw.code }}</span>
              </div>
            </template>

            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <span>{{ item.raw.flag }}</span>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="9" class="px-2">
          <v-text-field v-model="phone" placeholder="Phone Number" type="tel" />
        </v-col>
        <v-col cols="12">
          <div
            class="text-medium-emphasis font-weight-regular text-subtitle-2 px-2"
          >
            By providing your phone number, you agree to receive booking-related
            transactional messages. Please reply ‘stop’ at any time to opt out.
          </div>
          <div>
            <v-checkbox class="text-subtitle-2">
              <template #label>
                <span class="text-subtitle-2 font-weight-medium"
                  >Share trip details with this guest.</span
                >
              </template>
            </v-checkbox>
          </div>
        </v-col>
      </v-row>
    </form>
    <router-link to="/checkout">
                    
    <v-btn class="booking-btn " variant="flat"
            rounded="lg" size="large" block color="#657ca2"
            >Next Guest</v-btn>
                  </router-link>
  </div>
</template>

<style scoped></style>
