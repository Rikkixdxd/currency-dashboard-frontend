
export type CurrencyConvertToSelected = {
  [key: string]: CurrencyPair[];
};

export type Currency = {
  code: string;
  name: string;
  symbol: string;
};

export type CurrencyPair = {
  base: string;
  target: string;
  rate: number;
  amount?: number;
};