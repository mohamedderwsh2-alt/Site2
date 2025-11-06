"use client";

import { FormEvent, useState } from "react";
import { IconLoader2, IconReceipt2 } from "@tabler/icons-react";

export function WithdrawRequestForm() {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("USDT-TRC20-");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), address, password, note }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message ?? "Failed to submit withdrawal request");
      }

      setMessage("Withdrawal request submitted. You will receive a Telegram confirmation once processed.");
      setAmount("");
      setAddress("USDT-TRC20-");
      setPassword("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel flex flex-col gap-4 rounded-[28px] px-6 py-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Request withdrawal</h2>
          <p className="text-sm text-white/65">
            Payouts are processed manually to ensure blockchain finality. Average processing time: under 2 hours.
          </p>
        </div>
        <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
          Manual review
        </span>
      </div>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-white/70">Amount (USDT)</span>
        <input
          type="number"
          step="0.01"
          min="5"
          required
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="100.00"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-white/70">Destination wallet address</span>
        <input
          type="text"
          required
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="USDT-TRC20-..."
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-white/70">Account password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-white/70">Note to operations (optional)</span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          placeholder="Add context for our finance team..."
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
        />
      </label>

      {message && (
        <p className="rounded-2xl border border-[#43c984]/30 bg-[#43c984]/10 px-4 py-3 text-sm text-[#7ee3a7]">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-2xl border border-[#ff6680]/30 bg-[#ff6680]/10 px-4 py-3 text-sm text-[#ff97a8]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed"
      >
        {pending ? (
          <>
            <IconLoader2 className="animate-spin" size={18} />
            Sending request...
          </>
        ) : (
          <>
            <IconReceipt2 size={18} /> Submit withdrawal
          </>
        )}
      </button>
    </form>
  );
}
