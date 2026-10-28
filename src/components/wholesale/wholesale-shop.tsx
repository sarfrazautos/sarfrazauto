"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Store,
  LogIn,
  ArrowRight,
  Clock,
  CheckCircle2,
  PhoneCall,
  LayoutDashboard,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-client";
import WholesaleHero from "./wholesale-hero";
import WholesaleCatalog from "./wholesale-catalog";
import { normalizeCategory } from "@/lib/category-mapper";
import { WHATSAPP_RAW, WHATSAPP_DISPLAY } from "@/lib/constants";

function WholesaleShopContent() {
  const { data: session, isPending } = useSession();
  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search") || searchParams.get("q") || "";
  const brandParam = searchParams.get("brand");
  const categoryParam = searchParams.get("category");
  const bikeParam = searchParams.get("bike") || searchParams.get("model");

  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All Brands");
  const [activeBike, setActiveBike] = useState("All Bikes");
  const [currentPage, setCurrentPage] = useState(1);

  const [dealerStatus, setDealerStatus] = useState<any>(null);
  const [checkingDealer, setCheckingDealer] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/customer/dealer-status")
        .then((res) => res.json())
        .then((data) => {
          setDealerStatus(data);
          setCheckingDealer(false);
        })
        .catch(() => {
          setCheckingDealer(false);
        });
    } else if (!isPending) {
      setCheckingDealer(false);
    }
  }, [session, isPending]);

  useEffect(() => {
    if (brandParam) {
      const lower = brandParam.toLowerCase();
      const mapped =
        lower === "honda"
          ? "Honda"
          : lower === "yamaha"
          ? "Yamaha"
          : lower === "suzuki"
          ? "Suzuki"
          : lower === "united"
          ? "United"
          : lower === "crown"
          ? "Crown"
          : lower === "super-star"
          ? "Super Star"
          : lower === "unique"
          ? "Unique"
          : lower === "all" || lower === "all brands"
          ? "All Brands"
          : brandParam;
      setActiveBrand(mapped);
      setCurrentPage(1);
    }
    if (bikeParam) {
      const lowerBike = bikeParam.toLowerCase();
      const mappedBike =
        lowerBike.includes("70")
          ? "70cc"
          : lowerBike.includes("100")
          ? "100cc"
          : lowerBike.includes("110")
          ? "110cc"
          : lowerBike.includes("125")
          ? "125cc"
          : lowerBike.includes("150")
          ? "150cc"
          : lowerBike.includes("all models") || lowerBike.includes("universal")
          ? "All Models"
          : bikeParam;
      setActiveBike(mappedBike);
      setCurrentPage(1);
    }
    if (categoryParam) {
      const lowerCat = categoryParam.toLowerCase();
      if (lowerCat === "cd70" || lowerCat === "cd-70") {
        setActiveBike("70cc");
        setActiveCategory("All");
      } else if (lowerCat === "cg125" || lowerCat === "cg-125") {
        setActiveBike("125cc");
        setActiveCategory("All");
      } else {
        const mappedCat = normalizeCategory(categoryParam);
        setActiveCategory(mappedCat);
      }
      setCurrentPage(1);
    }
    setSearchQuery(searchParam);
  }, [searchParam, brandParam, categoryParam, bikeParam]);

  const handleSearchSubmit = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleBrandChange = (brand: string) => {
    setActiveBrand(brand);
    setCurrentPage(1);
  };

  const handleBikeChange = (bike: string) => {
    setActiveBike(bike);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setActiveBrand("All Brands");
    setActiveBike("All Bikes");
    setCurrentPage(1);
  };

  if (isPending || checkingDealer) {
    return <div className="min-h-screen bg-white" />;
  }

  if (!session?.user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 sm:py-32 text-center">
        <div className="size-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-xs">
          <Store className="size-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-3">
          Wholesale Dealer Access Required
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-md mx-auto mb-8">
          Master carton catalogs, bulk dispatch pricing, and trade schemes are exclusive to registered dealership partners.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup?redirect=/wholesale" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-11 px-8 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm cursor-pointer shadow-xs gap-2">
              <Store className="size-4" />
              <span>Register Dealer Account</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/login?redirect=/wholesale" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto h-11 px-7 rounded-xl border-neutral-300 text-neutral-800 hover:bg-neutral-50 text-sm cursor-pointer gap-2">
              <LogIn className="size-4" />
              <span>Dealer Login</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (dealerStatus && !dealerStatus.isApproved) {
    const isRejected = dealerStatus.status?.toLowerCase() === "rejected";

    return (
      <div className="max-w-2xl mx-auto px-4 py-24 sm:py-32 text-center">
        <div
          className={`size-16 rounded-3xl flex items-center justify-center mx-auto mb-6 border shadow-xs ${
            isRejected
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-amber-50 text-amber-600 border-amber-200"
          }`}
        >
          {isRejected ? <XCircle className="size-8" /> : <Clock className="size-8 animate-pulse" />}
        </div>

        <Badge
          variant="outline"
          className={`mb-3 px-3 py-1 text-xs font-semibold ${
            isRejected
              ? "bg-red-50 text-red-700 border-red-300"
              : "bg-amber-50 text-amber-700 border-amber-300"
          }`}
        >
          {isRejected ? "Application Declined" : "Pending Admin Approval (Within 24 Hours)"}
        </Badge>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-3">
          {isRejected ? "Dealer Access Not Approved" : "Dealer Application Under Review"}
        </h1>

        <p className="text-sm text-neutral-600 leading-relaxed max-w-lg mx-auto mb-6">
          {isRejected ? (
            "Your wholesale application could not be verified at this time. Please contact Sarfraz Autos admin to review credentials."
          ) : (
            <>
              Your wholesale application for{" "}
              <strong className="text-neutral-900">
                {dealerStatus.shopName || session.user.name}
              </strong>{" "}
              has been received. The Sarfraz Autos admin team verifies workshop credentials within{" "}
              <strong>24 hours</strong>.
            </>
          )}
        </p>

        {!isRejected && (
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-left space-y-2 text-xs text-neutral-600 max-w-md mx-auto mb-8">
            <div className="flex items-center gap-2 text-neutral-900 font-semibold">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>Application Submitted Successfully</span>
            </div>
            <p className="pl-6 text-neutral-500 leading-relaxed">
              Once approved by admin, you will gain full access to wholesale bulk pricing, master cartons, and trade schemes.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/customer-portal" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto h-11 px-6 rounded-xl border-neutral-300 text-neutral-800 text-sm cursor-pointer gap-2"
            >
              <LayoutDashboard className="size-4" />
              <span>Go to Dealer Portal</span>
            </Button>
          </Link>

          <a
            href={`https://wa.me/${WHATSAPP_RAW}?text=Hello%20Sarfraz%20Autos,%20I%20have%20registered%20as%20a%20wholesale%20dealer%20(${encodeURIComponent(
              session.user.email
            )})%20and%20requesting%20early%20approval.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm cursor-pointer gap-2">
              <PhoneCall className="size-4" />
              <span>WhatsApp Admin ({WHATSAPP_DISPLAY})</span>
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <WholesaleHero
        searchQuery={searchQuery}
        onSearchSubmit={handleSearchSubmit}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        activeBrand={activeBrand}
        onBrandChange={handleBrandChange}
        activeBike={activeBike}
        onBikeChange={handleBikeChange}
        onClearFilters={handleClearFilters}
      />
      <WholesaleCatalog
        searchQuery={searchQuery}
        activeCategory={activeCategory}
        activeBrand={activeBrand}
        activeBike={activeBike}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onClearFilters={handleClearFilters}
      />
    </>
  );
}

export function WholesaleShop() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <WholesaleShopContent />
    </Suspense>
  );
}

export default WholesaleShop;
