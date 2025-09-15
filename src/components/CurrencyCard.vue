<template>
  <v-card
    :key="currencyPoint.timestamp"
    class="d-flex flex-column align-center justify-center text-center"
    :class="{
      'bg-amber-lighten-4': !showDetailed && currencyStore.favoriteCurrencies.has(
        currencyPoint.target
      ),
      'glow-red': currencyPoint.delta < 0,
      'glow-green': currencyPoint.delta > 0,
    }"
    outlined
    style="height: 70px"
  >
    <div class="text-h6">{{ showDetailed ? (currencyPoint.base + ' →') : '' }}  {{ currencyPoint.target }}</div>
    <div class="text-subtitle-1">
      {{ currencyPoint.rate?.toFixed(4) ?? "-" }}
    </div>

    <span
      class="position-absolute left-0 ml-4 delta-span"
      :class="currencyPoint.delta > 0 ? 'delta-green' : 'delta-red'"
    >
      {{ currencyPoint.delta > 0 ? "+" : "" }}{{ currencyPoint.delta }}
    </span>

    <button
      v-if="!showDetailed"
      class="favor-btn h-100 bg-amber-lighten-2 position-absolute right-0"
      @click.stop="currencyStore.switchFavor(currencyPoint.target)"
      :class="
        currencyStore.favoriteCurrencies.has(currencyPoint.target)
          ? 'text-white'
          : 'text-grey'"
    >
      <v-icon icon="mdi-star" class="text-h4" />
    </button>
  </v-card>
</template>

<script setup lang="ts">
import { useCurrency } from "@/stores/useCurrencyStore";
import type { CurrencyHistoryPoint } from "@/types/CurrencyTypes";

const props = defineProps<{
  currencyPoint: CurrencyHistoryPoint;
  showDetailed?: boolean;
}>();

const currencyStore = useCurrency();
</script>

<style scoped>
.favor-btn {
  opacity: 0;
  transition: opacity 0.3s;
}

.v-card:hover .favor-btn {
  opacity: 1;
}

.glow-red {
  animation: glow-red-fade 1s ease-out;
}
.glow-green {
  animation: glow-green-fade 1s ease-out;
}
@keyframes glow-red-fade {
  0% {
    box-shadow: inset 0 0 5px rgba(255, 0, 0, 0.9);
  }
  50% {
    box-shadow: inset 0 0 15px rgba(255, 0, 0, 1);
  }
  100% {
    box-shadow: inset 0 0 0 rgba(255, 0, 0, 0);
  }
}

@keyframes glow-green-fade {
  0% {
    box-shadow: inset 0 0 5px rgba(0, 255, 0, 0.9);
  }
  50% {
    box-shadow: inset 0 0 15px rgba(0, 255, 0, 1);
  }
  100% {
    box-shadow: inset 0 0 0 rgba(0, 255, 0, 0);
  }
}

.delta-green {
  color: green;
}

.delta-red {
  color: red;
}

.delta-span {
  opacity: 0;
  display: inline-block;
}

/* <- ВАЖНО: descendant selector (не ~) */
.glow-red .delta-span,
.glow-green .delta-span {
  animation: delta-fade 1s ease-out forwards;
}

@keyframes delta-fade {
  0% {
    opacity: 0;
    transform: translateY(5px);
  }
  20% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-5px);
  }
}
</style>
