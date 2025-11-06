"use client";

import { useState } from "react";
import { IconCopy, IconQrcode } from "@tabler/icons-react";

const WALLET_ADDRESS = "TRC20-USDT-1AVf63F9h92mx4Wq";

export function DepositInstructions() {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Failed to copy address", error);
    }
  }

  return (
    <div className="glass-panel flex flex-col gap-5 rounded-[28px] px-6 py-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Deposit to central vault</h2>
          <p className="text-sm text-white/65">
            Send TRC20 USDT to the address below. Funds appear after manual confirmation.
          </p>
        </div>
        <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
          Minimum 5 USDT
        </span>
      </div>

      <div className="flex flex-col gap-4 rounded-[24px] bg-white/5 px-5 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.22em] text-white/55">
            Vault address
          </span>
          <p className="mt-2 text-lg font-semibold">{WALLET_ADDRESS}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={copyAddress}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition hover:opacity-90"
          >
            <IconCopy size={16} /> {copied ? "Copied" : "Copy"}
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs text-white/75 transition hover:bg-white/10">
            <IconQrcode size={16} /> QR Code
          </button>
        </div>
      </div>

      <ul className="flex flex-col gap-3 text-sm text-white/70">
        <li>1. Transfer the amount from your personal wallet to the ArbiterX vault above.</li>
        <li>2. Submit the transaction hash so the operations team can validate the deposit.</li>
        <li>3. Once confirmed, the balance will be available for the next trading cycle.</li>
      </ul>
    </div>
  );
}
