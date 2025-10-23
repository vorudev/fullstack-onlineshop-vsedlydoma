"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode
} from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  distinctItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};

interface Props {
  children: ReactNode;
}


function loadCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse cart from localStorage', e);
    return [];
  }
}

export const CartProvider: React.FC<Props> = ({ children }) => {

  const [cart, setCart] = useState<CartItem[]>(() => loadCart());


  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);


  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity < 1) {
        removeFromCart(id);
      } else {
        setCart(prev =>
          prev.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      }
    },
    [removeFromCart]
  );

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === item.id);
      if (exist) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []); 


  const totalItems = useMemo(
    () => cart.reduce((sum, { quantity }) => sum + quantity, 0),
    [cart]
  );
  const totalPrice = useMemo(
    () => cart.reduce((sum, { price, quantity }) => sum + price * quantity, 0),
    [cart]
  );
  const distinctItems = useMemo(() => cart.length, [cart]);


  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice, 
      distinctItems
    }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, distinctItems]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};