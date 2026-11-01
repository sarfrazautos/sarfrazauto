"use client"

import { useEffect } from "react"

export function GoogleTranslateProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return

    const win = window as any

    win.googleTranslateElementInit = () => {
      if (win.google?.translate?.TranslateElement) {
        try {
          new win.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              autoDisplay: false,
            },
            "google_translate_hidden_holder"
          )
        } catch {}
      }
    }

    if (win.google?.translate?.TranslateElement) {
      win.googleTranslateElementInit()
    } else if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script")
      script.id = "google-translate-script"
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      script.async = true
      document.body.appendChild(script)
    }

    const cleanBanner = () => {
      if (document.body.style.top && document.body.style.top !== "0px") {
        document.body.style.top = "0px"
      }
      if (document.documentElement.style.top && document.documentElement.style.top !== "0px") {
        document.documentElement.style.top = "0px"
      }

      const iframes = document.querySelectorAll(
        'iframe.skiptranslate, iframe.goog-te-banner-frame, iframe[id*=":1.container"], iframe[id*=":2.container"], iframe[class*="skiptranslate"], .goog-te-banner-frame, body > .skiptranslate'
      )
      iframes.forEach((el) => {
        const item = el as HTMLElement
        item.style.setProperty("display", "none", "important")
        item.style.setProperty("visibility", "hidden", "important")
        item.style.setProperty("height", "0px", "important")
        item.style.setProperty("width", "0px", "important")
        item.style.setProperty("opacity", "0", "important")
        item.style.setProperty("pointer-events", "none", "important")
      })
    }

    cleanBanner()
    const observer = new MutationObserver(cleanBanner)
    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["style", "class"],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div
      id="google_translate_hidden_holder"
      className="notranslate"
      style={{
        position: "fixed",
        top: "-9999px",
        left: "-9999px",
        width: "1px",
        height: "1px",
        opacity: 0,
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  )
}

