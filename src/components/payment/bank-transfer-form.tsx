"use client";

import { useState } from "react";
import { AlertCircle, Check, Copy, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const bankAccounts = [
  {
    id: "meezan",
    name: "Meezan Bank",
    badge: "Most Popular",
    title: "Sarfraz Autos",
    accountNumber: "01020304050607",
    iban: "PK56MEZN0001020304050607",
    branch: "Saddar Branch Karachi (0102)",
  },
  {
    id: "ubl",
    name: "UBL (United Bank)",
    badge: "Direct Transfer",
    title: "Sarfraz Autos",
    accountNumber: "123456789012",
    iban: "PK36UNIL0109001234567890",
    branch: "M.A. Jinnah Road Karachi",
  },
  {
    id: "easypaisa",
    name: "EasyPaisa",
    badge: "Instant Wallet",
    title: "Muhammad Sarfraz",
    accountNumber: "03331285556",
    iban: "Raast ID: 03331285556",
    branch: "Mobile Account / Raast",
  },
  {
    id: "jazzcash",
    name: "JazzCash",
    badge: "Instant Wallet",
    title: "Muhammad Sarfraz",
    accountNumber: "03331285556",
    iban: "Raast ID: 03331285556",
    branch: "Mobile Account / Raast",
  },
];

export interface BankTransferFormProps {
  onProofChange?: (file: File | null) => void;
  hasError?: boolean;
  className?: string;
}

export function BankTransferForm({
  onProofChange,
  hasError = false,
  className = "",
}: BankTransferFormProps) {
  const [selectedBankId, setSelectedBankId] = useState("meezan");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const currentBank = bankAccounts.find((b) => b.id === selectedBankId) || bankAccounts[0];

  const handleCopy = (text: string, key: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFileName(file ? file.name : null);
    onProofChange?.(file);
  };

  const handleRemoveFile = () => {
    setSelectedFileName(null);
    onProofChange?.(null);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2.5">
        <Label className="text-sm font-semibold text-foreground">
          Select Bank or Wallet
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {bankAccounts.map((bank) => {
            const isSelected = selectedBankId === bank.id;
            return (
              <button
                key={bank.id}
                type="button"
                onClick={() => setSelectedBankId(bank.id)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[72px]",
                  isSelected
                    ? "border-neutral-950 bg-neutral-50 shadow-xs ring-1 ring-neutral-950"
                    : "border-border bg-card hover:border-neutral-300"
                )}
              >
                <span className="text-xs font-semibold text-foreground block">
                  {bank.name}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  {bank.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {currentBank.name} Details
            </h3>
            <p className="text-xs text-muted-foreground">{currentBank.branch}</p>
          </div>
          <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Active Account
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-muted/40 border border-border/80">
            <span className="text-muted-foreground block text-[11px]">Account Title</span>
            <span className="font-semibold text-foreground text-sm mt-0.5 block">
              {currentBank.title}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between gap-2">
            <div>
              <span className="text-muted-foreground block text-[11px]">
                {currentBank.id === "easypaisa" || currentBank.id === "jazzcash"
                  ? "Mobile Account No."
                  : "Account Number"}
              </span>
              <span className="font-semibold text-foreground text-sm tracking-wider mt-0.5 block">
                {currentBank.accountNumber}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleCopy(currentBank.accountNumber, "acc")}
              className="h-8 px-2.5 text-xs cursor-pointer shrink-0"
            >
              {copiedKey === "acc" ? (
                <>
                  <Check className="size-3.5 text-emerald-600 mr-1" />
                  <span className="text-emerald-600 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 mr-1" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>

          <div className="sm:col-span-2 p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground block text-[11px]">
                {currentBank.id === "easypaisa" || currentBank.id === "jazzcash"
                  ? "Raast Payment"
                  : "IBAN"}
              </span>
              <span className="font-semibold text-foreground text-xs sm:text-sm tracking-wider mt-0.5 block truncate">
                {currentBank.iban}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleCopy(currentBank.iban, "iban")}
              className="h-8 px-2.5 text-xs cursor-pointer shrink-0"
            >
              {copiedKey === "iban" ? (
                <>
                  <Check className="size-3.5 text-emerald-600 mr-1" />
                  <span className="text-emerald-600 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 mr-1" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div id="payment-proof-section" className="space-y-4 scroll-mt-28">
        <div className="space-y-2">
          <Label htmlFor="payment-proof-input" className="text-sm font-semibold text-foreground block">
            Upload Transfer Screenshot / Proof
          </Label>

          {selectedFileName ? (
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center gap-2.5 min-w-0">
                <Check className="size-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-medium text-emerald-900 truncate">
                  {selectedFileName}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-1"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <>
              <label
                className={cn(
                  "border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all",
                  hasError
                    ? "border-red-500 bg-red-50/50 ring-2 ring-red-500/20"
                    : "border-border hover:border-neutral-400 bg-card"
                )}
              >
                <UploadCloud
                  className={cn(
                    "size-8 mb-2",
                    hasError ? "text-red-500 animate-bounce" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-semibold",
                    hasError ? "text-red-700" : "text-foreground"
                  )}
                >
                  Click or drag &amp; drop payment screenshot
                </span>
                <span
                  className={cn(
                    "text-[11px] mt-1",
                    hasError ? "text-red-600 font-medium" : "text-muted-foreground"
                  )}
                >
                  PNG, JPG or PDF receipt from your bank app (Meezan, EasyPaisa, HBL, etc.)
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {hasError && (
                <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>Payment proof is required. Please upload your transfer screenshot.</span>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BankTransferForm;
