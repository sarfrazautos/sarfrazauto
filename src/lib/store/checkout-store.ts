import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";

export interface CheckoutCustomerInfo {
  deliveryMethod: "delivery" | "pickup";
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  apartment: string;
  notes?: string;
}

interface CheckoutState {
  info: CheckoutCustomerInfo;
  setInfo: (updates: Partial<CheckoutCustomerInfo>) => void;
  resetInfo: () => void;
}

const initialInfo: CheckoutCustomerInfo = {
  deliveryMethod: "delivery",
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  apartment: "",
  notes: "",
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      info: initialInfo,
      setInfo: (updates) =>
        set((state) => ({
          info: { ...state.info, ...updates },
        })),
      resetInfo: () => set({ info: initialInfo }),
    }),
    {
      name: "sarfraz-checkout-info",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useCheckoutInfo() {
  const store = useCheckoutStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    ...store,
    isHydrated,
    info: isHydrated ? store.info : initialInfo,
  };
}
