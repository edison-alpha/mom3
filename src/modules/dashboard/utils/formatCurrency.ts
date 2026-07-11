import { currencyOptions } from "../constants/dashboard";
import type { CurrencyCode } from "../types/dashboard.types";

export function formatCurrency(amountUsd: number, currency: CurrencyCode) {
  const option = currencyOptions[currency];

  return new Intl.NumberFormat(option.locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(amountUsd * option.rate);
}
