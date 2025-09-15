export type CurrencyHistory = {
  [base: string]: {
    [target: string]: CurrencyHistoryPoint[]
  }
}

export type Currency = {
  code: string;
  name: string;
  symbol: string;
}

export type CurrencyPair = {
  base: string;
  target: string;
  rate: number;
  amount?: number;
}

export type CurrencyHistoryPoint = CurrencyPair & {
  timestamp: number
  delta: number
}