"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  IconHash,
  IconLoader2,
  IconLock,
  IconMail,
  IconUser,
} from "@tabler/icons-react";

type FieldErrors = Partial<Record<string, string>>;

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    referral: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  function updateField(key: keyof typeof form) {
    return (value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords must match." });
      setPending(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          referralCode: form.referral || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data?.errors) {
          setFieldErrors(data.errors as FieldErrors);
        }
        throw new Error(data?.message ?? "Failed to create account");
      }

      setSuccess(true);
      setForm({ name: "", email: "", password: "", confirmPassword: "", referral: "" });
      setTimeout(() => {
        window.location.assign("/login");
      }, 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="glass-panel w-full rounded-[28px] px-8 py-10 shadow-[0_22px_48px_rgba(14,20,58,0.3)]">
      <div className="mb-8 space-y-2">
        <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white/60">
          Start trading
        </span>
        <h1 className="text-3xl font-semibold text-white">Create your ArbiterX ID</h1>
        <p className="text-sm text-white/60">
          Purchase bots, monitor cross-exchange analytics, and grow passive income through referrals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          label="Full name"
          icon={IconUser}
          type="text"
          value={form.name}
          onChange={updateField("name")}
          placeholder="Serra Yılmaz"
          error={fieldErrors.name}
          required
        />
        <Field
          label="Email"
          icon={IconMail}
          type="email"
          value={form.email}
          onChange={updateField("email")}
          placeholder="you@example.com"
          error={fieldErrors.email}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Password"
            icon={IconLock}
            type="password"
            value={form.password}
            onChange={updateField("password")}
            placeholder="••••••••"
            error={fieldErrors.password}
            required
          />
          <Field
            label="Confirm password"
            icon={IconLock}
            type="password"
            value={form.confirmPassword}
            onChange={updateField("confirmPassword")}
            placeholder="••••••••"
            error={fieldErrors.confirmPassword}
            required
          />
        </div>
        <Field
          label="Referral code (optional)"
          icon={IconHash}
          type="text"
          value={form.referral}
          onChange={updateField("referral")}
          placeholder="ARB-XXXX"
          error={fieldErrors.referralCode ?? fieldErrors.referral}
        />

        {error && (
          <p className="rounded-2xl border border-[#ff6680]/30 bg-[#ff6680]/10 px-4 py-3 text-sm text-[#ff97a8]">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-2xl border border-[#43c984]/30 bg-[#43c984]/10 px-4 py-3 text-sm text-[#7ee3a7]">
            Account created! Redirecting to sign in...
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed"
        >
          {pending ? (
            <>
              <IconLoader2 className="animate-spin" size={18} />
              Creating profile...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/60">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-white hover:text-white/80">
          Sign in
        </Link>
      </p>
    </div>
  );
}

type FieldProps = {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
};

function Field({
  label,
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  error,
  required,
}: FieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="flex items-center gap-2 text-white/70">
        <Icon size={18} /> {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
      />
      {error ? <span className="text-xs text-[#ff97a8]">{error}</span> : null}
    </label>
  );
}
