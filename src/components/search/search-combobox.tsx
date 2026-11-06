"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface SearchComboboxProps {
  searchQuery: string;
  onSearchSubmit: (val: string) => void;
  placeholder?: string;
  type?: "retail" | "wholesale";
  className?: string;
}

export function SearchCombobox({
  searchQuery,
  onSearchSubmit,
  placeholder = "Search parts by name (e.g. cylinder, clutch, piston)...",
  type = "retail",
  className,
}: SearchComboboxProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(searchQuery || "");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const onSearchSubmitRef = useRef(onSearchSubmit);
  const lastSubmittedRef = useRef(searchQuery || "");
  const lastFetchedRef = useRef("");

  useEffect(() => {
    onSearchSubmitRef.current = onSearchSubmit;
  }, [onSearchSubmit]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const incoming = searchQuery || "";
    if (incoming !== searchInput) {
      setSearchInput(incoming);
      lastSubmittedRef.current = incoming;
      lastFetchedRef.current = incoming;
      setIsLoading(false);
      setIsDebouncing(false);
      if (!incoming) {
        setSuggestions([]);
        setIsOpen(false);
      }
    }
  }, [searchQuery]);

  useEffect(() => {
    const trimmed = searchInput.trim();

    if (trimmed === lastSubmittedRef.current) {
      setIsDebouncing(false);
    }

    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsLoading(false);

      if (trimmed !== lastSubmittedRef.current) {
        setIsDebouncing(true);
        const timer = setTimeout(() => {
          lastSubmittedRef.current = trimmed;
          onSearchSubmitRef.current(trimmed);
          setIsDebouncing(false);
        }, 500);
        return () => clearTimeout(timer);
      }
      return;
    }

    let suggestTimer: NodeJS.Timeout | null = null;
    if (trimmed !== lastFetchedRef.current) {
      setIsLoading(true);
      suggestTimer = setTimeout(async () => {
        try {
          const res = await fetch(
            `/api/products?search=${encodeURIComponent(trimmed)}&limit=6&type=${type}`
          );
          const data = await res.json();
          lastFetchedRef.current = trimmed;
          if (data.success && Array.isArray(data.products)) {
            setSuggestions(data.products);
          } else {
            setSuggestions([]);
          }
        } catch {
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    }

    let submitTimer: NodeJS.Timeout | null = null;
    if (trimmed !== lastSubmittedRef.current) {
      setIsDebouncing(true);
      submitTimer = setTimeout(() => {
        lastSubmittedRef.current = trimmed;
        onSearchSubmitRef.current(trimmed);
        setIsDebouncing(false);
      }, 650);
    }

    return () => {
      if (suggestTimer) clearTimeout(suggestTimer);
      if (submitTimer) clearTimeout(submitTimer);
    };
  }, [searchInput, type]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = searchInput.trim();
      lastSubmittedRef.current = trimmed;
      setIsDebouncing(false);
      setIsLoading(false);
      setIsOpen(false);
      onSearchSubmitRef.current(trimmed);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelectProduct = (product: any) => {
    setSearchInput(product.name);
    lastSubmittedRef.current = product.name;
    lastFetchedRef.current = product.name;
    setIsDebouncing(false);
    setIsLoading(false);
    setIsOpen(false);
    onSearchSubmitRef.current(product.name);
  };

  const handleDirectNavigate = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    setIsOpen(false);
    const targetUrl =
      type === "wholesale"
        ? `/wholesale-product-overview/${product.slug || product.id}`
        : `/product-overview/${product.slug || product.id}`;
    router.push(targetUrl);
  };

  const handleClear = () => {
    setSearchInput("");
    lastSubmittedRef.current = "";
    lastFetchedRef.current = "";
    setSuggestions([]);
    setIsDebouncing(false);
    setIsLoading(false);
    setIsOpen(false);
    onSearchSubmitRef.current("");
  };

  const getProductImage = (product: any) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[product.mainImageIndex || 0] || product.images[0];
    }
    if (typeof product.images === "string" && product.images.startsWith("http")) {
      return product.images;
    }
    return type === "wholesale" ? "/wholesale-bulk.png" : "/bike-engine.png";
  };

  const showSuggestions = isOpen && searchInput.trim().length >= 2;

  return (
    <div ref={containerRef} className={cn("relative flex-1 max-w-lg", className)}>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none z-10" />
        <Input
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (searchInput.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-10 pl-10 pr-10 text-sm transition-all bg-white"
        />

        {isDebouncing || isLoading ? (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <Loader2 className="size-4 animate-spin text-neutral-400" />
          </div>
        ) : searchInput ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 rounded-full cursor-pointer transition-colors z-10"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>

      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in-50 zoom-in-98 duration-150">
          <Command shouldFilter={false} className="border-0 bg-transparent p-0">
            <CommandList className="max-h-88 overflow-y-auto p-1.5 divide-y divide-neutral-100">
              {isLoading && suggestions.length === 0 ? (
                <div className="flex items-center justify-center gap-2 py-6 text-xs text-neutral-500">
                  <Loader2 className="size-3.5 animate-spin text-red-600" />
                  <span>Searching products...</span>
                </div>
              ) : suggestions.length === 0 ? (
                <CommandEmpty className="py-6 text-center text-xs text-neutral-500">
                  No products found matching &quot;{searchInput}&quot;
                </CommandEmpty>
              ) : (
                <CommandGroup heading={`Suggestions (${suggestions.length})`}>
                  {suggestions.map((item) => {
                    const imgUrl = getProductImage(item);
                    const formattedPrice = Number(item.price || 0).toLocaleString();

                    return (
                      <CommandItem
                        key={item.id}
                        value={`${item.name}-${item.id}`}
                        onSelect={() => handleSelectProduct(item)}
                        className="group flex items-center justify-between gap-3 p-2 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="size-10 rounded-md border border-neutral-100 bg-neutral-50 p-0.5 shrink-0 overflow-hidden flex items-center justify-center">
                            <img
                              src={imgUrl}
                              alt={item.name}
                              className="size-full object-contain"
                              loading="lazy"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-neutral-900 group-hover:text-red-600 transition-colors truncate">
                              {item.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-0.5">
                              {item.brand && (
                                <span className="bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded font-medium">
                                  {item.brand}
                                </span>
                              )}
                              {item.category && (
                                <span className="truncate">{item.category}</span>
                              )}
                              {item.compatibleBike && (
                                <>
                                  <span className="text-neutral-300">•</span>
                                  <span className="truncate">{item.compatibleBike}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs sm:text-sm font-semibold text-neutral-900">
                            Rs. {formattedPrice}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDirectNavigate(e, item)}
                            title="View product details"
                            className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <ArrowUpRight className="size-3.5" />
                          </button>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              <div className="pt-1 mt-1">
                <CommandItem
                  value={`search-all-${searchInput}`}
                  onSelect={() => {
                    const trimmed = searchInput.trim();
                    lastSubmittedRef.current = trimmed;
                    onSearchSubmitRef.current(trimmed);
                    setIsDebouncing(false);
                    setIsLoading(false);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between text-xs text-neutral-600 hover:text-red-600 py-2 px-2.5 rounded-lg cursor-pointer"
                >
                  <span className="truncate">
                    Search all results for <strong>&quot;{searchInput}&quot;</strong>
                  </span>
                  <Search className="size-3 text-neutral-400 ml-2 shrink-0" />
                </CommandItem>
              </div>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}

export default SearchCombobox;
