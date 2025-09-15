<template>
  <v-container>
    <div class="d-flex justify-center mb-10">
      <v-autocomplete
        v-if="!currencyStore.selectedCurrency"
        v-model="searchCurrency"
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
          @click="currencyStore.clearSelection"
        >
          <v-icon icon="mdi-delete" class="text-h4" />
        </button>
        <div class="text-h6 font-weight-bold">
          {{ currencyStore.selectedCurrency }}
        </div>
        <button
          class="favor-btn h-100 w-50 bg-amber-lighten-2 position-absolute right-0"
          @click="currencyStore.switchFavor(currencyStore.selectedCurrency)"
          :class="currencyStore.favoriteCurrencies.has(currencyStore.selectedCurrency) ? 'text-white' : 'text-grey'"
        >
          <v-icon icon="mdi-star" class="text-h4" />
        </button>
      </v-card>
    </div>

    <v-row dense>
      <template v-if="!currencyStore.selectedCurrency">
        <v-col
          v-for="pair in currencyStore.popularCurrencyPairs"
          :key="pair.base + pair.target"
          cols="6"
          sm="4"
          md="2"
        >
          <v-card
            class="d-flex flex-column align-center justify-center text-center"
            :class="{'bg-amber-lighten-4': currencyStore.favoriteCurrencies.has(pair.target) || currencyStore.favoriteCurrencies.has(pair.base)}"
            outlined
            style="height: 70px"
          >
            <div class="text-h6">{{ pair.base }} → {{ pair.target }}</div>
            <div class="text-subtitle-1">
              {{ pair.rate }}
            </div>
          </v-card>
        </v-col>
      </template>

      <template v-else>
        <v-col
          v-for="currency in currencyStore.currencyListToSelected[
            currencyStore.selectedCurrency
          ]"
          :key="currency.target"
          cols="6"
          sm="4"
          md="2"
        >
          <CurrencyCard :currency="currency"/>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useCurrency } from "@/stores/useCurrencyStore";
import { onMounted } from "vue";

const currencyStore = useCurrency();
const searchCurrency = ref(null);

function onCurrencySelect(code) {
  currencyStore.selectCurrency(code);
  searchCurrency.value = null;
}

onMounted(() => {
  currencyStore.fetchPopularPairs(); // сразу при загрузке
  setInterval(() => {
    if (!currencyStore.selectedCurrency) {
      currencyStore.fetchPopularPairs()
    } else {
      currencyStore.fetchCurrency(currencyStore.selectedCurrency)
    }
  }, 1000);
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
