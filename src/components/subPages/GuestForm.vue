<script setup>
import { ref, defineEmits, defineProps, watch, computed } from "vue";
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
  name: "United States"
});
const phone = ref("");
const firstName = ref("");
const lastName = ref("");
const birthDate = ref("");
const gender = ref("");
const email = ref("");
const searchCountry = ref("");

const countries = ref([
  { code: "+1", flag: "🇺🇸", label: "US", name: "United States" },
  { code: "+1", flag: "🇺🇸", label: "US", name: "United States" },
  { code: "+44", flag: "🇬🇧", label: "GB", name: "United Kingdom" },
  { code: "+91", flag: "🇮🇳", label: "IN", name: "India" },
  { code: "+880", flag: "🇧🇩", label: "BD", name: "Bangladesh" },
  { code: "+93", flag: "🇦🇫", label: "AF", name: "Afghanistan" },
  { code: "+355", flag: "🇦🇱", label: "AL", name: "Albania" },
  { code: "+213", flag: "🇩🇿", label: "DZ", name: "Algeria" },
  { code: "+376", flag: "🇦🇩", label: "AD", name: "Andorra" },
  { code: "+244", flag: "🇦🇴", label: "AO", name: "Angola" },
  { code: "+54", flag: "🇦🇷", label: "AR", name: "Argentina" },
  { code: "+374", flag: "🇦🇲", label: "AM", name: "Armenia" },
  { code: "+61", flag: "🇦🇺", label: "AU", name: "Australia" },
  { code: "+43", flag: "🇦🇹", label: "AT", name: "Austria" },
  { code: "+994", flag: "🇦🇿", label: "AZ", name: "Azerbaijan" },
  { code: "+973", flag: "🇧🇭", label: "BH", name: "Bahrain" },
  { code: "+32", flag: "🇧🇪", label: "BE", name: "Belgium" },
  { code: "+501", flag: "🇧🇿", label: "BZ", name: "Belize" },
  { code: "+229", flag: "🇧🇯", label: "BJ", name: "Benin" },
  { code: "+975", flag: "🇧🇹", label: "BT", name: "Bhutan" },
  { code: "+591", flag: "🇧🇴", label: "BO", name: "Bolivia" },
  { code: "+387", flag: "🇧🇦", label: "BA", name: "Bosnia and Herzegovina" },
  { code: "+267", flag: "🇧🇼", label: "BW", name: "Botswana" },
  { code: "+55", flag: "🇧🇷", label: "BR", name: "Brazil" },
  { code: "+673", flag: "🇧🇳", label: "BN", name: "Brunei" },
  { code: "+359", flag: "🇧🇬", label: "BG", name: "Bulgaria" },
  { code: "+226", flag: "🇧🇫", label: "BF", name: "Burkina Faso" },
  { code: "+257", flag: "🇧🇮", label: "BI", name: "Burundi" },
  { code: "+855", flag: "🇰🇭", label: "KH", name: "Cambodia" },
  { code: "+237", flag: "🇨🇲", label: "CM", name: "Cameroon" },
  { code: "+1", flag: "🇨🇦", label: "CA", name: "Canada" },
  { code: "+238", flag: "🇨🇻", label: "CV", name: "Cape Verde" },
  { code: "+236", flag: "🇨🇫", label: "CF", name: "Central African Republic" },
  { code: "+235", flag: "🇹🇩", label: "TD", name: "Chad" },
  { code: "+56", flag: "🇨🇱", label: "CL", name: "Chile" },
  { code: "+86", flag: "🇨🇳", label: "CN", name: "China" },
  { code: "+57", flag: "🇨🇴", label: "CO", name: "Colombia" },
  { code: "+269", flag: "🇰🇲", label: "KM", name: "Comoros" },
  { code: "+242", flag: "🇨🇬", label: "CG", name: "Congo" },
  { code: "+506", flag: "🇨🇷", label: "CR", name: "Costa Rica" },
  { code: "+385", flag: "🇭🇷", label: "HR", name: "Croatia" },
  { code: "+53", flag: "🇨🇺", label: "CU", name: "Cuba" },
  { code: "+357", flag: "🇨🇾", label: "CY", name: "Cyprus" },
  { code: "+420", flag: "🇨🇿", label: "CZ", name: "Czech Republic" },
  { code: "+45", flag: "🇩🇰", label: "DK", name: "Denmark" },
  { code: "+253", flag: "🇩🇯", label: "DJ", name: "Djibouti" },
  { code: "+1", flag: "🇩🇲", label: "DM", name: "Dominica" },
  { code: "+1", flag: "🇩🇴", label: "DO", name: "Dominican Republic" },
  { code: "+593", flag: "🇪🇨", label: "EC", name: "Ecuador" },
  { code: "+20", flag: "🇪🇬", label: "EG", name: "Egypt" },
  { code: "+503", flag: "🇸🇻", label: "SV", name: "El Salvador" },
  { code: "+240", flag: "🇬🇶", label: "GQ", name: "Equatorial Guinea" },
  { code: "+291", flag: "🇪🇷", label: "ER", name: "Eritrea" },
  { code: "+372", flag: "🇪🇪", label: "EE", name: "Estonia" },
  { code: "+251", flag: "🇪🇹", label: "ET", name: "Ethiopia" },
  { code: "+679", flag: "🇫🇯", label: "FJ", name: "Fiji" },
  { code: "+358", flag: "🇫🇮", label: "FI", name: "Finland" },
  { code: "+33", flag: "🇫🇷", label: "FR", name: "France" },
  { code: "+241", flag: "🇬🇦", label: "GA", name: "Gabon" },
  { code: "+220", flag: "🇬🇲", label: "GM", name: "Gambia" },
  { code: "+995", flag: "🇬🇪", label: "GE", name: "Georgia" },
  { code: "+49", flag: "🇩🇪", label: "DE", name: "Germany" },
  { code: "+233", flag: "🇬🇭", label: "GH", name: "Ghana" },
  { code: "+30", flag: "🇬🇷", label: "GR", name: "Greece" },
  { code: "+502", flag: "🇬🇹", label: "GT", name: "Guatemala" },
  { code: "+224", flag: "🇬🇳", label: "GN", name: "Guinea" },
  { code: "+245", flag: "🇬🇼", label: "GW", name: "Guinea-Bissau" },
  { code: "+592", flag: "🇬🇾", label: "GY", name: "Guyana" },
  { code: "+509", flag: "🇭🇹", label: "HT", name: "Haiti" },
  { code: "+504", flag: "🇭🇳", label: "HN", name: "Honduras" },
  { code: "+36", flag: "🇭🇺", label: "HU", name: "Hungary" },
  { code: "+354", flag: "🇮🇸", label: "IS", name: "Iceland" },
  { code: "+62", flag: "🇮🇩", label: "ID", name: "Indonesia" },
  { code: "+98", flag: "🇮🇷", label: "IR", name: "Iran" },
  { code: "+964", flag: "🇮🇶", label: "IQ", name: "Iraq" },
  { code: "+353", flag: "🇮🇪", label: "IE", name: "Ireland" },
  { code: "+972", flag: "🇮🇱", label: "IL", name: "Israel" },
  { code: "+39", flag: "🇮🇹", label: "IT", name: "Italy" },
  { code: "+225", flag: "🇨🇮", label: "CI", name: "Ivory Coast" },
  { code: "+1", flag: "🇯🇲", label: "JM", name: "Jamaica" },
  { code: "+81", flag: "🇯🇵", label: "JP", name: "Japan" },
  { code: "+962", flag: "🇯🇴", label: "JO", name: "Jordan" },
  { code: "+7", flag: "🇰🇿", label: "KZ", name: "Kazakhstan" },
  { code: "+254", flag: "🇰🇪", label: "KE", name: "Kenya" },
  { code: "+686", flag: "🇰🇮", label: "KI", name: "Kiribati" },
  { code: "+965", flag: "🇰🇼", label: "KW", name: "Kuwait" },
  { code: "+996", flag: "🇰🇬", label: "KG", name: "Kyrgyzstan" },
  { code: "+856", flag: "🇱🇦", label: "LA", name: "Laos" },
  { code: "+371", flag: "🇱🇻", label: "LV", name: "Latvia" },
  { code: "+961", flag: "🇱🇧", label: "LB", name: "Lebanon" },
  { code: "+266", flag: "🇱🇸", label: "LS", name: "Lesotho" },
  { code: "+231", flag: "🇱🇷", label: "LR", name: "Liberia" },
  { code: "+218", flag: "🇱🇾", label: "LY", name: "Libya" },
  { code: "+423", flag: "🇱🇮", label: "LI", name: "Liechtenstein" },
  { code: "+370", flag: "🇱🇹", label: "LT", name: "Lithuania" },
  { code: "+352", flag: "🇱🇺", label: "LU", name: "Luxembourg" },
  { code: "+261", flag: "🇲🇬", label: "MG", name: "Madagascar" },
  { code: "+265", flag: "🇲🇼", label: "MW", name: "Malawi" },
  { code: "+60", flag: "🇲🇾", label: "MY", name: "Malaysia" },
  { code: "+960", flag: "🇲🇻", label: "MV", name: "Maldives" },
  { code: "+223", flag: "🇲🇱", label: "ML", name: "Mali" },
  { code: "+356", flag: "🇲🇹", label: "MT", name: "Malta" },
  { code: "+692", flag: "🇲🇭", label: "MH", name: "Marshall Islands" },
  { code: "+222", flag: "🇲🇷", label: "MR", name: "Mauritania" },
  { code: "+230", flag: "🇲🇺", label: "MU", name: "Mauritius" },
  { code: "+52", flag: "🇲🇽", label: "MX", name: "Mexico" },
  { code: "+691", flag: "🇫🇲", label: "FM", name: "Micronesia" },
  { code: "+373", flag: "🇲🇩", label: "MD", name: "Moldova" },
  { code: "+377", flag: "🇲🇨", label: "MC", name: "Monaco" },
  { code: "+976", flag: "🇲🇳", label: "MN", name: "Mongolia" },
  { code: "+382", flag: "🇲🇪", label: "ME", name: "Montenegro" },
  { code: "+212", flag: "🇲🇦", label: "MA", name: "Morocco" },
  { code: "+258", flag: "🇲🇿", label: "MZ", name: "Mozambique" },
  { code: "+95", flag: "🇲🇲", label: "MM", name: "Myanmar" },
  { code: "+264", flag: "🇳🇦", label: "NA", name: "Namibia" },
  { code: "+674", flag: "🇳🇷", label: "NR", name: "Nauru" },
  { code: "+977", flag: "🇳🇵", label: "NP", name: "Nepal" },
  { code: "+31", flag: "🇳🇱", label: "NL", name: "Netherlands" },
  { code: "+64", flag: "🇳🇿", label: "NZ", name: "New Zealand" },
  { code: "+505", flag: "🇳🇮", label: "NI", name: "Nicaragua" },
  { code: "+227", flag: "🇳🇪", label: "NE", name: "Niger" },
  { code: "+234", flag: "🇳🇬", label: "NG", name: "Nigeria" },
  { code: "+850", flag: "🇰🇵", label: "KP", name: "North Korea" },
  { code: "+47", flag: "🇳🇴", label: "NO", name: "Norway" },
  { code: "+968", flag: "🇴🇲", label: "OM", name: "Oman" },
  { code: "+92", flag: "🇵🇰", label: "PK", name: "Pakistan" },
  { code: "+680", flag: "🇵🇼", label: "PW", name: "Palau" },
  { code: "+507", flag: "🇵🇦", label: "PA", name: "Panama" },
  { code: "+675", flag: "🇵🇬", label: "PG", name: "Papua New Guinea" },
  { code: "+595", flag: "🇵🇾", label: "PY", name: "Paraguay" },
  { code: "+51", flag: "🇵🇪", label: "PE", name: "Peru" },
  { code: "+63", flag: "🇵🇭", label: "PH", name: "Philippines" },
  { code: "+48", flag: "🇵🇱", label: "PL", name: "Poland" },
  { code: "+351", flag: "🇵🇹", label: "PT", name: "Portugal" },
  { code: "+974", flag: "🇶🇦", label: "QA", name: "Qatar" },
  { code: "+40", flag: "🇷🇴", label: "RO", name: "Romania" },
  { code: "+7", flag: "🇷🇺", label: "RU", name: "Russia" },
  { code: "+250", flag: "🇷🇼", label: "RW", name: "Rwanda" },
  { code: "+685", flag: "🇼🇸", label: "WS", name: "Samoa" },
  { code: "+378", flag: "🇸🇲", label: "SM", name: "San Marino" },
  { code: "+966", flag: "🇸🇦", label: "SA", name: "Saudi Arabia" },
  { code: "+221", flag: "🇸🇳", label: "SN", name: "Senegal" },
  { code: "+381", flag: "🇷🇸", label: "RS", name: "Serbia" },
  { code: "+248", flag: "🇸🇨", label: "SC", name: "Seychelles" },
  { code: "+232", flag: "🇸🇱", label: "SL", name: "Sierra Leone" },
  { code: "+65", flag: "🇸🇬", label: "SG", name: "Singapore" },
  { code: "+421", flag: "🇸🇰", label: "SK", name: "Slovakia" },
  { code: "+386", flag: "🇸🇮", label: "SI", name: "Slovenia" },
  { code: "+677", flag: "🇸🇧", label: "SB", name: "Solomon Islands" },
  { code: "+252", flag: "🇸🇴", label: "SO", name: "Somalia" },
  { code: "+27", flag: "🇿🇦", label: "ZA", name: "South Africa" },
  { code: "+82", flag: "🇰🇷", label: "KR", name: "South Korea" },
  { code: "+211", flag: "🇸🇸", label: "SS", name: "South Sudan" },
  { code: "+34", flag: "🇪🇸", label: "ES", name: "Spain" },
  { code: "+94", flag: "🇱🇰", label: "LK", name: "Sri Lanka" },
  { code: "+249", flag: "🇸🇩", label: "SD", name: "Sudan" },
  { code: "+597", flag: "🇸🇷", label: "SR", name: "Suriname" },
  { code: "+268", flag: "🇸🇿", label: "SZ", name: "Swaziland" },
  { code: "+46", flag: "🇸🇪", label: "SE", name: "Sweden" },
  { code: "+41", flag: "🇨🇭", label: "CH", name: "Switzerland" },
  { code: "+963", flag: "🇸🇾", label: "SY", name: "Syria" },
  { code: "+886", flag: "🇹🇼", label: "TW", name: "Taiwan" },
  { code: "+992", flag: "🇹🇯", label: "TJ", name: "Tajikistan" },
  { code: "+255", flag: "🇹🇿", label: "TZ", name: "Tanzania" },
  { code: "+66", flag: "🇹🇭", label: "TH", name: "Thailand" },
  { code: "+228", flag: "🇹🇬", label: "TG", name: "Togo" },
  { code: "+676", flag: "🇹🇴", label: "TO", name: "Tonga" },
  { code: "+1", flag: "🇹🇹", label: "TT", name: "Trinidad and Tobago" },
  { code: "+216", flag: "🇹🇳", label: "TN", name: "Tunisia" },
  { code: "+90", flag: "🇹🇷", label: "TR", name: "Turkey" },
  { code: "+993", flag: "🇹🇲", label: "TM", name: "Turkmenistan" },
  { code: "+688", flag: "🇹🇻", label: "TV", name: "Tuvalu" },
  { code: "+256", flag: "🇺🇬", label: "UG", name: "Uganda" },
  { code: "+380", flag: "🇺🇦", label: "UA", name: "Ukraine" },
  { code: "+971", flag: "🇦🇪", label: "AE", name: "United Arab Emirates" },
  { code: "+598", flag: "🇺🇾", label: "UY", name: "Uruguay" },
  { code: "+998", flag: "🇺🇿", label: "UZ", name: "Uzbekistan" },
  { code: "+678", flag: "🇻🇺", label: "VU", name: "Vanuatu" },
  { code: "+58", flag: "🇻🇪", label: "VE", name: "Venezuela" },
  { code: "+84", flag: "🇻🇳", label: "VN", name: "Vietnam" },
  { code: "+967", flag: "🇾🇪", label: "YE", name: "Yemen" },
  { code: "+260", flag: "🇿🇲", label: "ZM", name: "Zambia" },
  { code: "+263", flag: "🇿🇼", label: "ZW", name: "Zimbabwe" }
]);

const filteredCountries = computed(() => {
  if (!searchCountry.value) return countries.value;
  const searchTerm = searchCountry.value.toLowerCase();
  return countries.value.filter(country => 
    country.name.toLowerCase().includes(searchTerm) || 
    country.code.toLowerCase().includes(searchTerm) ||
    country.label.toLowerCase().includes(searchTerm)
  );
});

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
      const countryMatch = countries.value.find(c => 
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
    selectedCountry.value = countries.value[0];
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
        <!-- First Name & Last Name - Stack on mobile -->
        <v-col cols="12" sm="6" class="px-2 mb-2">
          <v-text-field
            v-model="firstName"
            :rules="[rules.required]"
            placeholder="First Name"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" class="px-2 mb-2">
          <v-text-field
            v-model="lastName"
            :rules="[rules.required]"
            placeholder="Last Name"
            required
          ></v-text-field>
        </v-col>

        <!-- Birthday & Gender - Stack on mobile -->
        <v-col cols="12" sm="6" class="px-2 mb-2">
          <v-date-input
            v-model="birthDate"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            placeholder="Birthday (DD/MM/YYYY)"
            :rules="[rules.required]"
            required
          ></v-date-input>
        </v-col>
        <v-col cols="12" sm="6" class="px-2 mb-2">
          <v-select 
            v-model="gender"
            :items="items" 
            label="Gender"
            :rules="[rules.required]"
            required
          ></v-select>
        </v-col>

        <!-- Email - Full width -->
        <v-col cols="12" class="px-2 mb-2">
          <v-text-field
            v-model="email"
            type="email"
            prepend-inner-icon="mdi-email"
            :rules="[rules.email]"
            placeholder="E-mail"
          ></v-text-field>
        </v-col>

        <!-- Phone - Country code above phone on mobile -->
        <v-col cols="12" sm="3" class="px-2">
          <v-select
            v-model="selectedCountry"
            hide-details
            :items="filteredCountries"
            item-title="label"
            item-value="code"
            return-object
            class="country-select"
          >
            <template #prepend-item>
              <v-list-item>
                <v-text-field
                  v-model="searchCountry"
                  placeholder="Search country..."
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  density="compact"
                  hide-details
                  @click.stop
                  class="search-input mt-2"
                ></v-text-field>
              </v-list-item>
              <v-divider class="mt-2"></v-divider>
            </template>
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
                <template #title>
                  <span class="text-subtitle-2 ml-2">{{ item.raw.name }}</span>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" sm="9" class="px-2">
          <v-text-field 
            v-model="phone" 
            placeholder="Phone Number" 
            type="tel"
            :rules="[rules.phone]"
          />
        </v-col>

        <!-- Notice - Full width -->
        <v-col cols="12">
          <div class="text-medium-emphasis font-weight-regular text-subtitle-2 px-2">
            By providing your phone number, you agree to receive booking-related
            transactional messages. Please reply 'stop' at any time to opt out.
          </div>
        </v-col>
      </v-row>
      
      <!-- Button - Full width with responsive margin -->
      <v-btn 
        class="booking-btn mt-2 mt-sm-5" 
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

<style scoped>
.search-input {
  width: 100%;
  max-width: 280px;
}

/* Optional: Adjust spacing on small devices */
@media (max-width: 600px) {
  .px-2 {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
}
</style>