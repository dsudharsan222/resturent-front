import { create } from 'zustand';

const CART_STORAGE_KEY = 'sv_caterers_cart';

const loadSavedCart = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Failed to load cart from storage', err);
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save cart to storage', err);
  }
};

export const useCartStore = create((set, get) => ({
  items: loadSavedCart(),
  isOpen: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.id === product.id);
      let updatedItems;

      if (existingIndex > -1) {
        updatedItems = state.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const parsedPrice = parseFloat(product.price) || 0;
        updatedItems = [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: parsedPrice,
            image: product.image || product.image_url,
            type: product.type || 'veg',
            category: typeof product.category === 'object' ? product.category.name : product.category,
            quantity: Math.max(1, quantity),
          },
        ];
      }

      saveCart(updatedItems);
      return { items: updatedItems, isOpen: true };
    });
  },

  updateQuantity: (id, quantity) => {
    set((state) => {
      let updatedItems;
      if (quantity <= 0) {
        updatedItems = state.items.filter((item) => item.id !== id);
      } else {
        updatedItems = state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
      }
      saveCart(updatedItems);
      return { items: updatedItems };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const updatedItems = state.items.filter((item) => item.id !== id);
      saveCart(updatedItems);
      return { items: updatedItems };
    });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getTax: () => {
    // 5% GST
    return get().getSubtotal() * 0.05;
  },

  getTotal: () => {
    return get().getSubtotal() + get().getTax();
  },
}));

export default useCartStore;
