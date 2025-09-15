import type {
  CurrencyPair,
  CurrencyHistory,
  CurrencyHistoryPoint,
} from "@/types/CurrencyTypes";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCurrency = defineStore("currency", () => {
  const currencyHistory = ref<CurrencyHistory>({});
  const currencyPopularHistory = ref<CurrencyHistory>({});

  const favoriteCurrencies = ref<Set<string>>(new Set());

  const currencyCodeList = computed(() => {
    const codes = new Set<string>();
    Object.keys(currencyPopularHistory.value).forEach(base => {
      codes.add(base);
      Object.keys(currencyPopularHistory.value[base]).forEach(target => {
        codes.add(target);
      });
    });
    return codes;
  });

  const popularCurrencyPairs = computed(() => {
    const pairs: CurrencyHistoryPoint[] = [];
    Object.keys(currencyPopularHistory.value).forEach(base => {
      Object.keys(currencyPopularHistory.value[base]).forEach(target => {
        const history = currencyPopularHistory.value[base][target];
        if (history.length > 0) {
          const last = history[history.length - 1];
          pairs.push(last);
        }
      });
    });
    return pairs;
  });

  async function fetchCurrency(code: string): Promise<void> {
    const response = await fetch("http://localhost:5000/rates/" + code);
    currencyHistory.value = updateHistory(currencyHistory.value, await response.json());
  }

  async function fetchPopularPairs() {
    const response = await fetch("http://localhost:5000/rates");
    const pairs = await response.json();
    currencyPopularHistory.value = updateHistory(currencyPopularHistory.value, pairs);
  }

  function switchFavor(code: string) {
    if (favoriteCurrencies.value.has(code))
      return favoriteCurrencies.value.delete(code);
    favoriteCurrencies.value.add(code);
    window.localStorage.setItem(
      "favoriteCurrencyCodes",
      JSON.stringify([...favoriteCurrencies.value])
    );
  }

  function updateHistory(history: CurrencyHistory, value: CurrencyPair[]) {
    value.forEach((currency) => {
      if (!history[currency.base]) {
        history[currency.base] = {};
      }
      if (!history[currency.base][currency.target]) {
        history[currency.base][currency.target] = [];
      }

      const arr = history[currency.base][currency.target];
      const last = arr.length ? arr[arr.length - 1] : null;
      const delta = last ? Math.round((Number(currency.rate) - last.rate) * 1e4) / 1e4 : 0;

      arr.push({
        base: currency.base,
        target: currency.target,
        timestamp: Date.now(),
        rate: Number(currency.rate),
        delta,
      });

      if (arr.length > 20) {
        arr.shift();
      }
    });

    return history;
  }
  
  function getFavor() {
    const stored = window.localStorage.getItem("favoriteCurrencyCodes");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          favoriteCurrencies.value = new Set(parsed);
        } else {
          favoriteCurrencies.value = new Set();
        }
      } catch {
        favoriteCurrencies.value = new Set();
      }
    } else {
      favoriteCurrencies.value = new Set();
    }
  }

  return {
    currencyCodeList,
    popularCurrencyPairs,
    fetchPopularPairs,
    fetchCurrency,
    favoriteCurrencies,
    switchFavor,
    currencyHistory,
    currencyPopularHistory,
    getFavor
  };
});
