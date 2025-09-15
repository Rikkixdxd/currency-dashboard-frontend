import type {
  Currency,
  CurrencyConvertToSelected,
  CurrencyPair,
  CurrencyHistory,
} from "@/types/CurrencyTypes";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCurrency = defineStore("currency", () => {
  const selectedCurrency = ref<string | null>(null);
  const currencyListToSelected = ref<CurrencyConvertToSelected>({})
  const currencyBaseTargetHistory = ref<CurrencyHistory>({})

  const popularCurrencyPairs = ref<CurrencyPair[]>([])
  const favoriteCurrencies = ref<Set<string>>(new Set())

  const currencyCodeList = computed(() => {
    const codes = new Set<string>();
    popularCurrencyPairs.value.forEach((pair) => {
      codes.add(pair.base);
      codes.add(pair.target);
    });
    return codes;
  });

  async function fetchCurrency(code: string): Promise<void> {
    const response = await fetch("http://localhost:5000/rates/" + code);
    const data = await response.json()
    currencyListToSelected.value[code] = data
    
    currencyBaseTargetHistory.value = updateHistory(currencyBaseTargetHistory.value, code)
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
  
  function updateHistory(history: CurrencyHistory, code: string) {
    if (!history[code]) history[code] = []
    currencyListToSelected.value[code].forEach((currency) => { // TODO: возможно избавиться от currencyListToSelected, отображать историю 
      if (!history[currency.base][currency.target]) history[currency.base][currency.target] = []
      
      
      // const delta = history[currency.base][currency.target].length ? (Number(currency.rate) - history[currency.base][currency.target][-1].rate) : 0
      // console.log(history[currency.base][currency.target].length);
      
      history[currency.base][currency.target].push({
        timestamp: Date.now(),
        rate: Number(currency.rate),
        delta: 1
      })

      if (history[currency.base][currency.target].length > 100) history[currency.base][currency.target].shift()
    })
    return history
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