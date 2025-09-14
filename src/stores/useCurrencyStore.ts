import type {
  Currency,
  CurrencyConvertToSelected,
  CurrencyPair,
} from "@/types/CurrencyTypes";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const popularPairs = ref([
  { base: "USD", target: "EUR", rate: "0.93" },
  { base: "USD", target: "RUB", rate: "96.0" },
  { base: "EUR", target: "USD", rate: "1.07" },
  { base: "GBP", target: "USD", rate: "1.23" },
  { base: "USD", target: "JPY", rate: "148.0" },
]);

export const useCurrency = defineStore("currency", () => {
  const selectedCurrency = ref<string | null>(null);
  const currencyListToSelected = ref<CurrencyConvertToSelected>({})
  const popularCurrencyPairs = ref<CurrencyPair[]>([])
  const favoriteCurrencies = ref<Set<string>>(new Set())

  const currencyCodeList = computed(() => {
    const codes = new Set<string>();
    popularPairs.value.forEach((pair) => {
      codes.add(pair.base);
      codes.add(pair.target);
    });
    return codes;
  });

  async function fetchCurrency(code: string): Promise<void> {
    const response = await fetch("http://localhost:5000/rates/" + code);
    currencyListToSelected.value[code] = await response.json()
  }

  async function fetchPopularPairs() {
    const response = await fetch("http://localhost:5000/rates");
    popularCurrencyPairs.value = await response.json();
  }

  function selectCurrency(code: string) {
    selectedCurrency.value = code;
    if(!currencyListToSelected.value[code]) fetchCurrency(selectedCurrency.value);
  }

  function clearSelection() {
    selectedCurrency.value = null;
  }

  function switchFavor(code: string) {
    if(favoriteCurrencies.value.has(code)) return favoriteCurrencies.value.delete(code)
    favoriteCurrencies.value.add(code)
    window.localStorage.setItem('favoriteCurrencyCodes', JSON.stringify(favoriteCurrencies.value))
  }
  
  function getFavor() {
    favoriteCurrencies.value = new Set(JSON.parse(window.localStorage.getItem('favoriteCurrencyCodes') ?? '') ?? [])
  }

  return {
    currencyCodeList,
    selectedCurrency,
    selectCurrency,
    clearSelection,
    popularCurrencyPairs,
    fetchPopularPairs,
    currencyListToSelected,
    fetchCurrency,
    favoriteCurrencies,
    switchFavor,
  };
});