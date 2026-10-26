import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";

export type CartItemType = "retail" | "wholesale";

export interface CartItem {
  id: string;
  productId: string | number;
  type: CartItemType;
  title: string;
  category?: string;
  price: number;
  quantity: number;
  image: string;
  specs?: string;
  color?: string;
  packaging?: string;
  weight?: number;
  arrivalText?: string;
  inStock?: boolean;
}

export interface AddItemInput {
  productId: string | number;
  type: CartItemType;
  title: string;
  category?: string;
  price: number;
  quantity?: number;
  image: string;
  specs?: string;
  color?: string;
  packaging?: string;
  weight?: number;
  arrivalText?: string;
  inStock?: boolean;
}

interface CartState {
  items: CartItem[];
  addItem: (item: AddItemInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: (type?: CartItemType) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (input) => {
        const qty = input.quantity && input.quantity > 0 ? input.quantity : 1;
        const colorKey = input.color ? input.color.toLowerCase().trim() : "default";
        const generatedId = `${input.type}-${input.productId}-${colorKey}`;

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === generatedId);

          if (existingIndex > -1) {
            const updated = [...state.items];
            const current = updated[existingIndex];
            updated[existingIndex] = {
              ...current,
              quantity: current.quantity + qty,
            };
            return { items: updated };
          }

          const newItem: CartItem = {
            id: generatedId,
            productId: input.productId,
            type: input.type,
            title: input.title,
            category: input.category || "Motorcycle Parts",
            price: Number(input.price) || 0,
            quantity: qty,
            image: input.image || "/bike-engine.png",
            specs: input.specs || input.color || "Standard Fit",
            color: input.color,
            packaging: input.packaging || (input.type === "wholesale" ? "Standard Master Carton" : undefined),
            weight: input.weight || (input.type === "wholesale" ? 15 : undefined),
            arrivalText: input.arrivalText || "Arrives Tomorrow (Karachi) / 3-5 Days Nationwide",
            inStock: input.inStock ?? true,
          };

          return { items: [newItem, ...state.items] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, delta) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id === id) {
                const nextQty = item.quantity + delta;
                return nextQty > 0 ? { ...item, quantity: nextQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null),
        }));
      },

      clearCart: (type) => {
        set((state) => ({
          items: type ? state.items.filter((item) => item.type !== type) : [],
        }));
      },
    }),
    {
      name: "sarfraz-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useCart() {
  const store = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const items = isHydrated ? store.items : [];
  const retailItems = items.filter((i) => i.type === "retail");
  const wholesaleItems = items.filter((i) => i.type === "wholesale");

  const retailCount = retailItems.reduce((acc, i) => acc + i.quantity, 0);
  const wholesaleCount = wholesaleItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalCount = retailCount + wholesaleCount;

  const retailSubtotal = retailItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const wholesaleSubtotal = wholesaleItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const wholesaleTotalWeight = wholesaleItems.reduce(
    (acc, i) => acc + (i.weight || 15) * i.quantity,
    0
  );

  return {
    ...store,
    isHydrated,
    items,
    retailItems,
    wholesaleItems,
    retailCount,
    wholesaleCount,
    totalCount,
    retailSubtotal,
    wholesaleSubtotal,
    wholesaleTotalWeight,
  };
}
