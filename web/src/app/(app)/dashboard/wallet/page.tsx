import { IconAlertTriangle, IconCurrencyDollar } from "@tabler/icons-react";
import { DepositInstructions } from "@/components/wallet/deposit-instructions";
import { WithdrawRequestForm } from "@/components/wallet/withdraw-request-form";

const pendingDeposits = [
  {
    id: "DEP-45821",
    amount: 500,
    status: "Awaiting hash",
    createdAt: "2025-11-06T09:12:00Z",
  },
  {
    id: "DEP-45819",
    amount: 100,
    status: "Confirming (1/2)",
    createdAt: "2025-11-06T07:03:00Z",
  },
];

export default function WalletPage() {
  return (
    <div className="flex flex-col gap-6">
      <DepositInstructions />

      <section className="glass-panel flex flex-col gap-4 rounded-[28px] px-6 py-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Pending deposits</h2>
            <p className="text-sm text-white/65">
              Provide the transaction hash to expedite manual confirmation.
            </p>
          </div>
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
            {pendingDeposits.length} awaiting
          </span>
        </div>

        <div className="grid gap-3">
          {pendingDeposits.map((deposit) => (
            <div
              key={deposit.id}
              className="flex flex-col gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/75 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-white">{deposit.id}</p>
                <p className="text-xs text-white/55">
                  {new Date(deposit.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#7852ff]/20 px-3 py-1 text-xs text-[#d7c9ff]">
                  <IconCurrencyDollar size={14} /> {deposit.amount.toFixed(2)} USDT
                </span>
                <span className="text-xs uppercase tracking-[0.18em] text-white/55">
                  {deposit.status}
                </span>
                <button className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/75 transition hover:bg-white/10">
                  Add Tx hash
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <WithdrawRequestForm />

      <section className="glass-panel flex items-start gap-3 rounded-[24px] px-6 py-5 text-sm text-white/70">
        <IconAlertTriangle size={18} className="mt-1 text-[#ffbe5c]" />
        <p>
          ArbiterX never requests access to your exchange API keys. Deposits remain in a segregated vault and withdrawals are only sent to the registered address you provide.
        </p>
      </section>
    </div>
  );
}
