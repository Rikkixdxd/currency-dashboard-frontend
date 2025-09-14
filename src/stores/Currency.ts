import { defineStore } from "pinia";
import { ref } from "vue";

const currencies = ref([
  { code: "USD", symbol: "$", rate: 1 },
  { code: "EUR", symbol: "€", rate: 0.93 },
  { code: "GBP", symbol: "£", rate: 0.81 },
  { code: "JPY", symbol: "¥", rate: 148 },
  { code: "RUB", symbol: "₽", rate: 96 },
  { code: "CNY", symbol: "¥", rate: 7.25 },
  { code: "CHF", symbol: "₣", rate: 0.91 },
]);

const popularPairs = ref([
  { base: "USD", target: "EUR", rate: "0.93" },
  { base: "USD", target: "RUB", rate: "96.0" },
  { base: "EUR", target: "USD", rate: "1.07" },
  { base: "GBP", target: "USD", rate: "1.23" },
  { base: "USD", target: "JPY", rate: "148.0" },
]);

export const useCurrency = defineStore('currency', () => {
    const selectedCurrency = ref<{ code: string; symbol: string } | null>(null);
    const currencyList = ref(currencies.value);
    const popularCurrencyPairs = ref(popularPairs.value);

    function selectCurrency(currency: { code: string; symbol: string }) {
        selectedCurrency.value = currency;
    }

    function clearSelection() {
        selectedCurrency.value = null;
    }

    return { selectedCurrency, selectCurrency, clearSelection, currencyList, popularCurrencyPairs };
});