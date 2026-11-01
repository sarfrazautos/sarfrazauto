"use client"

import { useEffect, useRef, useState } from "react"
import * as Flags from "country-flag-icons/react/3x2"
import { Globe, Check } from "lucide-react"

const LANGUAGES = [
  { value: "en", label: "English", flag: "GB" },
  { value: "ur", label: "Urdu", flag: "PK" },
  { value: "ar", label: "Arabic", flag: "SA" },
  { value: "es", label: "Spanish", flag: "ES" },
  { value: "fr", label: "French", flag: "FR" },
  { value: "de", label: "German", flag: "DE" },
  { value: "zh-CN", label: "Chinese", flag: "CN" },
  { value: "hi", label: "Hindi", flag: "IN" },
  { value: "tr", label: "Turkish", flag: "TR" },
  { value: "ru", label: "Russian", flag: "RU" },
  { value: "pt", label: "Portuguese", flag: "PT" },
  { value: "ja", label: "Japanese", flag: "JP" },
  { value: "ko", label: "Korean", flag: "KR" },
  { value: "it", label: "Italian", flag: "IT" },
  { value: "fa", label: "Persian", flag: "IR" },
  { value: "bn", label: "Bengali", flag: "BD" },
  { value: "id", label: "Indonesian", flag: "ID" },
  { value: "ms", label: "Malay", flag: "MY" },
  { value: "th", label: "Thai", flag: "TH" },
  { value: "vi", label: "Vietnamese", flag: "VN" },
  { value: "nl", label: "Dutch", flag: "NL" },
  { value: "el", label: "Greek", flag: "GR" },
  { value: "sv", label: "Swedish", flag: "SE" },
  { value: "no", label: "Norwegian", flag: "NO" },
  { value: "da", label: "Danish", flag: "DK" },
  { value: "fi", label: "Finnish", flag: "FI" },
  { value: "pl", label: "Polish", flag: "PL" },
  { value: "ro", label: "Romanian", flag: "RO" },
  { value: "cs", label: "Czech", flag: "CZ" },
  { value: "hu", label: "Hungarian", flag: "HU" },
]

function FlagIcon({ code }: { code?: string }) {
  if (!code) {
    return <Globe className="size-4 text-neutral-700" />
  }

  const FlagComponent = (Flags as any)[code]
  if (!FlagComponent) {
    return <Globe className="size-4 text-neutral-700" />
  }

  return (
    <span className="inline-flex w-5 h-3.5 overflow-hidden rounded-xs shrink-0 shadow-2xs border border-neutral-200/60">
      <FlagComponent className="w-full h-full object-cover" />
    </span>
  )
}

function getSavedLanguage() {
  if (typeof document === "undefined") return "en"
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/)
  if (match) {
    const parts = match[1].split("/")
    return parts[2] || parts[1] || "en"
  }
  return "en"
}

function applyGoogleLanguage(langCode: string) {
  const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null
  if (combo) {
    combo.value = langCode === "en" ? "" : langCode
    combo.dispatchEvent(new Event("change"))
  }

  const hostname = window.location.hostname
  if (!langCode || langCode === "en") {
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  } else {
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${hostname};`
    document.cookie = `googtrans=/en/${langCode}; path=/;`
  }
}

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState("en")
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const active = getSavedLanguage()
    if (active && active !== "en") {
      setCurrentLang(active)
      const applyWhenReady = () => {
        const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null
        if (combo) {
          if (combo.value !== active) {
            combo.value = active
            combo.dispatchEvent(new Event("change"))
          }
        } else {
          setTimeout(applyWhenReady, 300)
        }
      }
      applyWhenReady()
    } else {
      setCurrentLang("en")
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (val: string) => {
    setCurrentLang(val)
    applyGoogleLanguage(val)
    setIsOpen(false)
    setSearch("")
  }

  const currentObj = LANGUAGES.find((l) => l.value === currentLang) || LANGUAGES[0]

  const filtered = LANGUAGES.filter((l) =>
    l.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative inline-flex items-center" ref={containerRef}>
      <button
        type="button"
        aria-label="Select Language"
        title={currentObj.label}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#f7f7f7] text-black hover:bg-[#e5e5e5] border border-neutral-200 rounded-full sm:h-12 sm:w-12 h-10 w-10 flex items-center justify-center cursor-pointer shadow-xs transition-colors notranslate focus:outline-none"
      >
        <FlagIcon code={currentObj.flag} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-56 max-w-[85vw] bg-white border border-neutral-200 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col notranslate animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2.5 border-b border-neutral-100 bg-neutral-50/70">
            <input
              type="text"
              placeholder="Search language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 px-2.5 text-xs bg-white border border-neutral-200 rounded-lg outline-none focus:border-red-500 transition-colors"
              autoFocus
            />
          </div>

          <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5">
            {filtered.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => handleSelect(l.value)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${currentLang === l.value
                  ? "bg-red-50 text-red-600"
                  : "text-neutral-700 hover:bg-neutral-100"
                  }`}
              >
                <FlagIcon code={l.flag} />
                <span className="flex-1 uppercase truncate tracking-wide">
                  {l.label}
                </span>
                {currentLang === l.value && (
                  <Check className="size-3.5 text-red-600 shrink-0" />
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="py-4 text-center text-xs text-neutral-400">
                No language found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
