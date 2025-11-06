import { Prisma } from "@prisma/client";

export const decimalToNumber = (value: Prisma.Decimal | number | bigint | null | undefined) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (value instanceof Prisma.Decimal) return Number(value);
  return Number(value);
};

export const formatUSDT = (value: number, minimumFractionDigits = 2) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
  }).format(value);

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
