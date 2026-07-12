"use client";

import { useState } from "react";

function venmoUrl(h?: string | null) {
  const v = (h || "").replace(/^@/, "");
  return v ? `https://venmo.com/u/${encodeURIComponent(v)}` : "";
}
function paypalUrl(v?: string | null) {
  const s = (v || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.includes("@")) return "";
  return `https://paypal.me/${encodeURIComponent(s.replace(/^@/, ""))}`;
}

export default function CheckoutForm({
  productName,
  priceCents,
  venmo,
  paypal,
  zelle,
}: {
  productName: string;
  priceCents: number;
  venmo?: string | null;
  paypal?: string | null;
  zelle?: string | null;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const fmt = "$" + (priceCents / 100).toLocaleString("en-US");

  if (step === 3) {
    return (
      <div className="card p-8 text-center">
        <div className="text-5xl">✓</div>
        <h2 className="mt-2 font-serif text-2xl font-bold">Order placed</h2>
        <p className="mt-2 text-[#6b6152]">
          Thanks {name || "!"} — your order for <b>{productName}</b> ({fmt}) is
          confirmed. The seller will reach out about shipping.
        </p>
      </div>
    );
  }

  if (step === 2) {
    const vu = venmoUrl(venmo);
    const pp = paypalUrl(paypal);
    return (
      <div className="card p-6">
        <h2 className="font-serif text-2xl font-bold">Payment</h2>
        <p className="mt-1 text-[#6b6152]">
          {productName} · <b className="text-golddeep">{fmt}</b>
        </p>
        <button
          onClick={() => setStep(3)}
          className="btn mt-4 w-full py-3"
        >
          🔒 Pay securely by card
        </button>
        {(vu || pp || zelle) && (
          <div className="my-3 text-center text-xs tracking-widest text-[#a89e8b]">
            — OR PAY THE SELLER DIRECTLY —
          </div>
        )}
        {vu && (
          <a href={vu} target="_blank" rel="noreferrer" className="mb-2 block w-full rounded-lg bg-[#3d95ce] py-3 text-center font-semibold text-white">
            Pay with Venmo
          </a>
        )}
        {pp && (
          <a href={pp} target="_blank" rel="noreferrer" className="mb-2 block w-full rounded-lg bg-[#003087] py-3 text-center font-semibold text-white">
            Pay with PayPal
          </a>
        )}
        {zelle && (
          <div className="mb-2 block w-full rounded-lg bg-[#6d1ed4] py-3 text-center font-semibold text-white">
            Zelle: {zelle}
          </div>
        )}
        <p className="mt-3 text-xs text-[#a89e8b]">
          Card payments are processed securely by Stripe. (Wire your Stripe keys
          in .env to enable live card checkout.)
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="font-serif text-2xl font-bold">Secure checkout</h2>
      <p className="mt-1 text-[#6b6152]">
        {productName} · <b className="text-golddeep">{fmt}</b>
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) setStep(2);
        }}
      >
        <label className="label">Full name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="label">Email</label>
        <input className="input" type="email" />
        <label className="label">Shipping address</label>
        <input className="input" placeholder="Street address" />
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="label">City</label>
            <input className="input" />
          </div>
          <div className="w-20">
            <label className="label">State</label>
            <input className="input" />
          </div>
          <div className="w-24">
            <label className="label">ZIP</label>
            <input className="input" />
          </div>
        </div>
        <button className="btn mt-4 w-full py-3">Continue to payment →</button>
      </form>
    </div>
  );
}
