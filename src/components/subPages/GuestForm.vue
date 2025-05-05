<script setup>
import { ref, defineEmits, defineProps, watch } from "vue";
import { VDateInput } from "vuetify/labs/VDateInput";

const props = defineProps({
  isLastGuest: {
    type: Boolean,
    default: false  
  },
  currentGuestData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['submit']);

const items = ref(["Male", "Female"]);
const selectedCountry = ref({
  code: "+1",
  flag: "🇺🇸",
  label: "US",
  name: "USA"
});
const phone = ref("");
const firstName = ref("");
const lastName = ref("");
const birthDate = ref("");
const gender = ref("");
const email = ref("");

const countries = [
  { code: "+1", flag: "🇺🇸", label: "US", name: "USA" },
  { code: "+44", flag: "🇬🇧", label: "UK", name: "United Kingdom" },
  { code: "+91", flag: "🇮🇳", label: "IND", name: "India" },
  { code: "+880", flag: "🇧🇩", label: "BAN", name: "Bangladesh" },
];

const rules = {
  required: (v) => !!v || "Required",
  email: (v) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !v || pattern.test(v) || "Invalid e-mail";
  },
  phone: (v) => {
    if (!v) return true;
    const pattern = /^[0-9]{6,15}$/;
    return pattern.test(v) || "6-15 digits required";
  },
};

watch(() => props.currentGuestData, (newData) => {
  if (newData) {
    firstName.value = newData.firstName;
    lastName.value = newData.lastName;
    birthDate.value = newData.birthDate;
    gender.value = newData.gender;
    email.value = newData.email;
    
    // Improved phone number handling
    if (newData.phone) {
      const countryMatch = countries.find(c => 
        newData.phone.startsWith(c.code)
      );
      
      if (countryMatch) {
        selectedCountry.value = countryMatch;
        phone.value = newData.phone.replace(countryMatch.code, '');
      } else {
        phone.value = newData.phone.replace(/^\+/, '');
      }
    } else {
      phone.value = '';
    }
  } else {
    // Reset form if no data
    firstName.value = "";
    lastName.value = "";
    birthDate.value = "";
    gender.value = "";
    email.value = "";
    phone.value = "";
    selectedCountry.value = countries[0];
  }
}, { immediate: true });

const validateForm = () => {
  return firstName.value && 
         lastName.value && 
         birthDate.value && 
         email.value &&
         phone.value
};

const handleSubmit = () => {
  if (!validateForm()) return;
  
  const formData = {
    firstName: firstName.value,
    lastName: lastName.value,
    birthDate: birthDate.value,
    gender: gender.value,
    email: email.value,
    phone: phone.value ? `${selectedCountry.value.code}${phone.value}` : null,
    country: selectedCountry.value.name,
  };
  
  emit('submit', formData);
};
</script>

<template>
  <div class="form-content mt-5">
    <form @submit.prevent="handleSubmit">
      <v-row no-gutters>
        <v-col cols="6" class="px-2 mb-2">
          <v-text-field
            v-model="firstName"
            :rules="[rules.required]"
            placeholder="First Name"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="px-2 mb-2">
          <v-text-field
            v-model="lastName"
            :rules="[rules.required]"
            placeholder="Last Name"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="px-2 mb-2">
          <v-date-input
            v-model="birthDate"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            placeholder="Birthday (DD/MM/YYYY)"
            :rules="[rules.required]"
            required
          ></v-date-input>
        </v-col>
        <v-col cols="6" class="px-2 mb-2">
          <v-select 
            v-model="gender"
            :items="items" 
            label="Gender"
            :rules="[rules.required]"
            required
          ></v-select>
        </v-col>

        <v-col cols="12" class="px-2 mb-2">
          <v-text-field
            v-model="email"
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
                <span>{{ item.raw.flag }}</span>&nbsp;
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
          <v-text-field 
            v-model="phone" 
            placeholder="Phone Number" 
            type="tel"
            :rules="[rules.phone]"
          />
        </v-col>
        <v-col cols="12">
          <div class="text-medium-emphasis font-weight-regular text-subtitle-2 px-2">
            By providing your phone number, you agree to receive booking-related
            transactional messages. Please reply 'stop' at any time to opt out.
          </div>
          <div>
            <v-checkbox class="text-subtitle-2">
              <template #label>
                <span class="text-subtitle-2 font-weight-medium">
                  Share trip details with this guest.
                </span>
              </template>
            </v-checkbox>
          </div>
        </v-col>
      </v-row>
      
      <v-btn 
        class="booking-btn" 
        variant="flat"
        rounded="lg" 
        size="large" 
        block 
        color="#657ca2"
        type="submit"
        :disabled="!validateForm()"
      >
        {{ isLastGuest ? 'Continue to Payment' : 'Next Guest' }}
      </v-btn>
    </form>
  </div>
</template>