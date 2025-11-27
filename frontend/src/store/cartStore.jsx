import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cartItems: [],
  setCartItems: (items) => set({ cartItems: items }),
  addLocal: (item) => set((state) => ({ cartItems: [...state.cartItems, item] })),

  removeLocal: (data) =>
    set((state) => ({
      cartItems: state.cartItems.filter(
        (x) => !(x.productId === data.productId && x.color.colorName === data.color && x.size === data.size)
      ),
    })),

  updateQtyLocal: (id, qty) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) => (item.id === id ? { ...item, quantity: qty } : item)),
    })),
}));
