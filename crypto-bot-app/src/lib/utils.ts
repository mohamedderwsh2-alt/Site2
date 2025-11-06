import type { Prisma } from "@/generated/prisma/client";

type DecimalLike = Prisma.Decimal | { toNumber: () => number };

const hasToNumber = (value: unknown): value is { toNumber: () => number } =>
  typeof value === "object" &&
  value !== null &&
  "toNumber" in value &&
  typeof (value as { toNumber?: unknown }).toNumber === "function";

export const decimalToNumber = (value: DecimalLike | number | bigint | null | undefined) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (hasToNumber(value)) return value.toNumber();
  return Number(value);
};

export const formatUSDT = (value: number, minimumFractionDigits = 2) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
  }).format(value);

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
