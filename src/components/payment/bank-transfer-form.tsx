"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Check, Copy, Loader2, UploadCloud, X, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { compressImage, formatFileSize } from "@/lib/image-compressor";

export const BANK_ACCOUNTS = [
  {
    id: "ubl",
    name: "UBL (United Bank)",
    badge: "Official Bank Account",
    title: "Muhammad Afraz",
    accountNumber: "257996808",
    iban: "PK12UNIL0109000257996808",
    branch: "Branch# 0947, Moli Musafir Khana",
    instructions: "Transfer to United Bank Limited via mobile banking, ATM, or over-the-counter deposit.",
    type: "bank",
  },
  {
    id: "easypaisa",
    name: "Easypaisa",
    badge: "Instant Mobile Wallet",
    title: "Muhammad Afraz",
    accountNumber: "03332624410",
    iban: "03332624410",
    branch: "Easypaisa Mobile Wallet",
    instructions: "Send money via Easypaisa App or any Easypaisa Retailer shop to 03332624410.",
    type: "wallet",
  },
  {
    id: "jazzcash",
    name: "JazzCash / Raast QR",
    badge: "Till ID & Raast QR",
    title: "SARFARAZ AUTOS",
    accountNumber: "983205868",
    iban: "Till ID: 983205868",
    branch: "Till ID / Raast QR Code",
    instructions: "Dial *786*10# and enter Till ID 983205868, or scan the official Raast QR code with any banking app.",
    type: "qr",
    qrImage: "/jazzcash-raast-qr.jpg",
  },
];

export interface BankTransferFormProps {
  onProofChange?: (file: File | null) => void;
  onMethodChange?: (methodName: string) => void;
  hasError?: boolean;
  className?: string;
}

export function BankTransferForm({
  onProofChange,
  onMethodChange,
  hasError = false,
  className = "",
}: BankTransferFormProps) {
  const [selectedBankId, setSelectedBankId] = useState("ubl");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileSavings, setFileSavings] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const currentBank = BANK_ACCOUNTS.find((b) => b.id === selectedBankId) || BANK_ACCOUNTS[0];

  useEffect(() => {
    onMethodChange?.(currentBank.name);
  }, [selectedBankId]);

  const handleCopy = (text: string, key: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (file.type.startsWith("image/")) {
      try {
        setIsCompressing(true);
        const res = await compressImage(file, { maxSizeMB: 0.15, maxWidthOrHeight: 1200 });
        setSelectedFileName(res.file.name);
        if (res.savedPercent > 0) {
          setFileSavings(`${formatFileSize(res.compressedSize)} (-${res.savedPercent}%)`);
        } else {
          setFileSavings(formatFileSize(res.compressedSize));
        }
        onProofChange?.(res.file);
      } catch {
        setSelectedFileName(file.name);
        setFileSavings(null);
        onProofChange?.(file);
      } finally {
        setIsCompressing(false);
      }
    } else {
      setSelectedFileName(file.name);
      setFileSavings(null);
      onProofChange?.(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFileName(null);
    setFileSavings(null);
    onProofChange?.(null);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2.5">
        <Label className="text-sm font-semibold text-foreground">
          Select Payment Method
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {BANK_ACCOUNTS.map((bank) => {
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
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-foreground block">
                    {bank.name}
                  </span>
                  {bank.id === "jazzcash" && <QrCode className="size-3.5 text-neutral-500" />}
                </div>
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
            Verified Account
          </span>
        </div>

        {currentBank.qrImage && (
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="size-36 sm:size-40 rounded-xl overflow-hidden bg-white p-1 border border-amber-300 shrink-0 shadow-2xs">
              <img
                src={currentBank.qrImage}
                alt="JazzCash Raast QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-xs text-neutral-700 space-y-1.5 text-center sm:text-left">
              <span className="font-bold text-neutral-900 text-sm block">
                Scan Raast QR / Pay via Till ID
              </span>
              <p className="text-neutral-600 leading-relaxed">
                Scan this QR code with <strong>JazzCash, Easypaisa, or ANY Pakistani banking app</strong> using Raast P2M payment.
              </p>
              <div className="inline-block px-3 py-1 rounded-md bg-white border border-amber-300 font-mono text-amber-900 font-bold text-xs mt-1">
                Dial *786*10# &bull; Till ID: 983205868
              </div>
            </div>
          </div>
        )}

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
                {currentBank.id === "easypaisa"
                  ? "Mobile Account No."
                  : currentBank.id === "jazzcash"
                  ? "Till ID"
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
                {currentBank.id === "easypaisa"
                  ? "Raast ID (Instant Transfer)"
                  : currentBank.id === "jazzcash"
                  ? "USSD Till Code"
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
            Upload Transfer Screenshot / Receipt Proof
          </Label>

          {isCompressing ? (
            <div className="flex items-center justify-center gap-2 p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 text-xs font-medium text-emerald-800">
              <Loader2 className="size-4 animate-spin text-emerald-600" />
              <span>Optimizing screenshot for fast submission...</span>
            </div>
          ) : selectedFileName ? (
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center gap-2.5 min-w-0">
                <Check className="size-4 text-emerald-600 shrink-0" />
                <div className="min-w-0 flex items-center gap-2">
                  <span className="text-xs font-medium text-emerald-900 truncate">
                    {selectedFileName}
                  </span>
                  {fileSavings && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium shrink-0">
                      {fileSavings}
                    </span>
                  )}
                </div>
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
                  PNG, JPG or PDF receipt from your bank or wallet app (UBL, Easypaisa, JazzCash)
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
