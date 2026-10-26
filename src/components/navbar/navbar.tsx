"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Equal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useInView, AnimatePresence } from "motion/react";
import CartBadge from "@/components/cart-badge";
import NavbarSearch from "@/components/navbar/navbar-search";
import TopTicker from "@/components/navbar/top-ticker";
import SecondaryNavbar from "@/components/navbar/secondary-navbar";
import Link from "next/link";

export type NavLinkItem = {
  title: string;
  href: string;
  isActive?: boolean;
};

export interface NavLinkProps {
  item: NavLinkItem;
  onClick?: () => void;
}

function NavLink({ item }: NavLinkProps) {
  const { title, href, isActive } = item;

  return (
    <li
      className={cn(
        "group flex items-center transition-all duration-500 ease-in-out w-fit",
        isActive ? "gap-3" : "gap-0 hover:gap-3"
      )}
    >
      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          isActive
            ? "max-w-6 opacity-100"
            : "max-w-0 opacity-0 group-hover:max-w-6 group-hover:opacity-100"
        )}
      >
        <img
          src="/wheel-rim.png"
          alt="icon"
          height={20}
          width={20}
          className="animate-spin object-contain"
        />
      </div>
      <Link
        href={href}
        className="text-foreground text-2xl sm:text-4xl sm:leading-10 leading-8 font-semibold"
      >
        {title}
      </Link>
    </li>
  );
}

export interface NavbarProps {
  navigationData?: NavLinkItem[];
  className?: string;
}

const defaultNavigation: NavLinkItem[] = [
  { title: "Home", href: "/" },
  { title: "Retail Shop", href: "/retail" },
  { title: "Wholesale", href: "/wholesale" },
  { title: "My Account", href: "/customer-portal" },
  { title: "Contact Us", href: "/contact" },
];

export function Navbar({ navigationData = defaultNavigation, className }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const isInView = useInView(headerRef, { once: true, amount: 0.1 });

  const navItems = navigationData.map((item) => ({
    ...item,
    isActive:
      item.isActive !== undefined && navigationData !== defaultNavigation
        ? item.isActive
        : item.href === "/"
        ? pathname === "/" || pathname === "/home"
        : pathname.startsWith(item.href),
  }));

  const handleScroll = () => {
    setSticky(window.scrollY >= 80);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm cursor-pointer"
              />
            )}
          </AnimatePresence>,
          document.body
        )}
      <TopTicker />
      <div className="sticky top-0 z-50 w-full bg-white transition-all shadow-xs">
        <header
          ref={headerRef}
          className={cn(
            "w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all duration-300 ease-in-out h-20 flex items-center",
            className
          )}
        >
          <motion.nav
            initial={{ opacity: 0, y: -32 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -32 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className={cn(
              "relative mx-auto max-w-7xl px-4 xl:px-16 flex items-center justify-between w-full"
            )}
          >
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="Sarfraz Autos Logo"
                className="h-10 sm:h-12 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
              />
              <span className="text-xl sm:text-2xl font-bold tracking-tight uppercase text-neutral-950 group-hover:text-red-600 transition-colors">
                Sarfraz Autos
              </span>
            </Link>
            <NavbarSearch />
            <div className="flex items-center gap-2.5 sm:gap-3">
              <CartBadge />
              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger className="flex items-center justify-center rounded-full sm:h-12 sm:w-12 h-10 w-10 p-2.5 sm:p-4 outline-none cursor-pointer bg-neutral-100 text-neutral-900 border border-neutral-200 hover:bg-neutral-200 transition-colors">
                  <Equal size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={20}
                  className="min-w-xs sm:min-w-sm bg-background py-8 px-6 shadow-lg rounded-3xl border-none -mt-16"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-foreground">Menu</p>
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <hr className="border-border" />
                    <ul className="flex flex-col gap-4 pb-4">
                      {navItems.map((menuItem, index) => (
                        <NavLink key={index} item={menuItem} />
                      ))}
                    </ul>
                    <div className="flex flex-col">
                      <Link
                        href="tel:03331285556"
                        className="text-lg font-normal leading-7 text-muted-foreground w-fit hover:text-primary"
                      >
                        0333-1285556
                      </Link>
                      <span className="text-sm font-medium text-muted-foreground">
                        Shop#23 Taj Mehal Qasim Auto MKT, Karachi
                      </span>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.nav>
        </header>
        <SecondaryNavbar />
      </div>
    </>
  );
}

export default Navbar;

