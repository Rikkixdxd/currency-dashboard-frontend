<template>
  <v-container>
    <div class="d-flex justify-center mb-10">
      <v-autocomplete
        v-if="!currencyStore.selectedCurrency"
        v-model="searchCurrency"
        :items="currencyStore.currencyList"
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
        class="currency-card d-flex flex-column align-center justify-center text-center position-relative"
        outlined
        color="primary"
        dark
      >
        <div class="text-h6 font-weight-bold">
          {{ currencyStore.selectedCurrency.symbol }}
          {{ currencyStore.selectedCurrency.code }}
        </div>
        <button class="delete-btn" @click="currencyStore.clearSelection">
          <v-icon icon="mdi-delete" />
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
          v-for="currency in currencyStore.currencyList"
          :key="currency.code"
          cols="6"
          sm="4"
          md="2"
        >
          <v-card
            :class="{
              'bg-primary text-white opacity-70':
                currency.code === currencyStore.selectedCurrency?.code,
            }"
            :disabled="currency.code === currencyStore.selectedCurrency?.code"
            class="d-flex flex-column align-center justify-center text-center"
            outlined
            style="height: 70px"
            @click="currencyStore.selectCurrency(currency)"
          >
            <div class="text-h6">
              {{ currency.code }}
            </div>
            <div
              v-if="currency.code !== currencyStore.selectedCurrency?.code"
              class="text-subtitle-1"
            >
              {{ convertRate(currencyStore.selectedCurrency, currency).toFixed(2) }}
            </div>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue"
import { useCurrency } from "@/stores/currency"

const currencyStore = useCurrency()
const searchCurrency = ref(null)

function onCurrencySelect(code) {
  const found = currencyStore.currencyList.find((c) => c.code === code)
  if (found) {
    currencyStore.selectCurrency(found)
    searchCurrency.value = null
  }
}

function convertRate(base, target) {
  return target.rate / base.rate
}
</script>

<style scoped>
.currency-input {
  max-width: 250px;
  --v-input-control-height: 70px;
}
.currency-card {
  width: 250px;
  height: 70px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.currency-card:hover {
  background-color: darkred !important;
}
.currency-card:hover > * {
  display: none;
}
.delete-btn {
  display: none;
  transition: opacity 0.2s;
  width: 100%;
  height: 70px;
  justify-content: center;
  align-items: center;
}
.currency-card:hover .delete-btn {
  display: flex;
  background: none;
}
</style>
