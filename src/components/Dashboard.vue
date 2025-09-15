<template>
  <v-container>
    <div class="d-flex justify-center mb-10">
      <v-autocomplete
        v-if="!selectedCurrency"
        v-model="selectedCurrency"
        :items="currencyStore.currencyCodeList"
        item-title="code"
        item-value="code"
        label="Выберите валюту"
        variant="outlined"
        clearable
        hide-details
        class="currency-input"
        @update:modelValue="onCurrencySelect"
      />
      <v-card
        v-else
        class="currency-card cursor-pointer d-flex align-center justify-center text-center position-relative"
        outlined
        color="primary"
        dark
      >
        <button
          class="delete-btn h-100 justify-center align-center bg-red-darken-4 w-50 position-absolute left-0"
          @click="selectedCurrency = null"
        >
          <v-icon icon="mdi-delete" class="text-h4" />
        </button>
        <div class="text-h6 font-weight-bold">
          {{ selectedCurrency }}
        </div>
        <button
          class="favor-btn h-100 w-50 bg-amber-lighten-2 position-absolute right-0"
          @click="currencyStore.switchFavor(selectedCurrency)"
          :class="
            currencyStore.favoriteCurrencies.has(selectedCurrency)
              ? 'text-white'
              : 'text-grey'
          "
        >
          <v-icon icon="mdi-star" class="text-h4" />
        </button>
      </v-card>
    </div>
    <v-row dense>
      <template v-if="!selectedCurrency">
        <v-col
          v-for="pair in currencyStore.popularCurrencyPairs"
          :key="pair.base + pair.target"
          cols="6"
          sm="4"
          md="2"
        >
          <CurrencyCard
            :currencyPoint="pair"
            :showDetailed="true"
          />
        </v-col>
      </template>

      <template v-else>
        <v-col
          v-for="currencyPoint in currencyStore.currencyHistory[
            selectedCurrency
          ]"
          :key="currencyPoint[currencyPoint.length - 1].timestamp"
          cols="6"
          sm="4"
          md="2"
        >
          <CurrencyCard
            :currencyPoint="currencyPoint[currencyPoint.length - 1]"
            @click="
              selectedCurrency = currencyPoint[currencyPoint.length - 1].target
            "
          />
        </v-col>
      </template>
    </v-row>
  </v-container>
  <!-- <Graphs v-if="selectedCurrency" :history="currencyStore.currencyHistory[selectedCurrency]" /> -->
</template>

<script setup>
import { ref } from "vue";
import { useCurrency } from "@/stores/useCurrencyStore";
import { onMounted } from "vue";
import CurrencyCard from "./CurrencyCard.vue";
import Graphs from "./Graphs.vue";

const currencyStore = useCurrency();
const selectedCurrency = ref(null);

function onCurrencySelect(code) {
  currencyStore.fetchCurrency(code);
  selectedCurrency.value = code;
}

onMounted(() => {
  currencyStore.getFavor();
  currencyStore.fetchPopularPairs();
  setInterval(() => {
    if (!selectedCurrency.value) {
      currencyStore.fetchPopularPairs();
    } else {
      currencyStore.fetchCurrency(selectedCurrency.value);
    }
  }, 3000);
});
</script>

<style scoped>
.currency-input {
  max-width: 250px;
  --v-input-control-height: 70px;
}
.currency-card {
  width: 250px;
  height: 70px;
  transition: background-color 0.2s;
}
.currency-card .favor-btn,
.currency-card .delete-btn {
  opacity: 0;
  transition: opacity 0.2s;
}
.currency-card:hover .favor-btn,
.currency-card:hover .delete-btn {
  opacity: 1;
}
</style>
