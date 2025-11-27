import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "@/env";
import { type MarketCode, marketConfig } from "./market";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isServer() {
  return typeof window === "undefined";
}

export function normalizeSlug(slug: string) {
  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function removeLeadingSlash(slug: string) {
  return slug.startsWith("/") ? slug.slice(1) : slug;
}

export function getMarket(marketCode: MarketCode = env.VITE_MARKET_CODE) {
  return marketConfig[marketCode];
}

export function formatPrice(amount: number, marketCode?: MarketCode) {
  const market = getMarket(marketCode);

  return new Intl.NumberFormat(market.locale, {
    style: "currency",
    currency: market.currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
