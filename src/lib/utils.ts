import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type MarketCode, marketConfig } from "./marketConfig";

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

function getMarket(marketCode?: MarketCode) {
  const defaultMarket = marketConfig.SE;

  if (!marketCode) {
    return defaultMarket;
  }

  return marketConfig[marketCode as MarketCode];
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
