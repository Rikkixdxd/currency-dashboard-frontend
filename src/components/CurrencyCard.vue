<template>
    <v-card
        class="d-flex flex-column align-center justify-center text-center"
        :class="{
            'bg-amber-lighten-4': currencyStore.favoriteCurrencies.has(currency.target),
            'glow-red': currency.delta < 0 && currency.flash,
            'glow-green': currency.delta > 0 && currency.flash,
        }"
        outlined
        style="height: 70px"
        @click.stop="currencyStore.selectCurrency(currency.target)"
        >
        <div class="text-h6">
            {{ currency.target }}
        </div>
        <div
            v-if="currency.target !== currencyStore.selectedCurrency"
            class="text-subtitle-1"
        >
            {{ currency.rate.toFixed(4) }}
        </div>
        <button
            class="favor-btn h-100 bg-amber-lighten-2 position-absolute right-0"
            @click.stop="currencyStore.switchFavor(currency.target)"
            :class="currencyStore.favoriteCurrencies.has(currency.target) ? 'text-white' : 'text-grey'"
        >
            <v-icon icon="mdi-star" class="text-h4" />
        </button>
    </v-card>
</template>

<script setup lang="ts">
import { useCurrency } from '@/stores/useCurrencyStore';
import type { CurrencyPair } from '@/types/CurrencyTypes';
const props = defineProps<{currency: CurrencyPair}>()
const currencyStore = useCurrency();

</script>

<style scoped>
.favor-btn {
  display: none;
}

.v-card:hover .favor-btn {
  display: block;
}

.glow-red {
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.7);
  transition: box-shadow 0.3s;
}
.glow-green {
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
  transition: box-shadow 0.3s;
}

</style>