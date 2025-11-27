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
interface ProductUnited {
   
  product: {
    averageRating: number;
    reviewCount: number;
    id: string;
    categoryId: string | null;
    inStock: string | null;
    price: number;
    slug: string;
    title: string;
    description: string;
    manufacturerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    sku: string | null;
    images: {
        id: string;
        productId: string;
        imageUrl: string;
        storageType: string;
        storageKey: string | null;
        order: number | null;
        isFeatured: boolean | null;
        createdAt: Date | null;
    }[]
}
}
export interface CartItem {
 product: ProductUnited['product'];
 quantity: number;

}
export interface ValidatedCartItem {
product: ProductUnited['product'];
 quantity: number;

};

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ProductUnited['product'], quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  updatedCart?: ValidatedCartItem[];
  validationErrors: string[];
  isValidating: boolean;
  validateCart: () => void;
  totalItems: number;
  totalPrice?: number;
  distinctItems: number;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

const isValidCartItem = (item: any): item is CartItem => {
  return (
    item &&
    typeof item === 'object' &&
    item.product &&
    typeof item.product === 'object' &&
    typeof item.product.id === 'string' &&
    typeof item.product.price === 'number' &&
    typeof item.quantity === 'number' &&
    item.quantity > 0
  );
};

// Функция загрузки корзины из localStorage
const loadCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('cart');
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    if (!Array.isArray(parsed)) {
      console.warn('Cart data is not an array, clearing cart');
      localStorage.removeItem('cart');
      return [];
    }
    
    // Фильтруем и преобразуем валидные элементы
    const validItems = parsed
      .filter(isValidCartItem)
      .map((item: CartItem) => ({
        ...item,
        product: {
          ...item.product,
          createdAt: item.product.createdAt ? new Date(item.product.createdAt) : null,
          updatedAt: item.product.updatedAt ? new Date(item.product.updatedAt) : null,
          images: Array.isArray(item.product.images) 
            ? item.product.images.map(img => ({
                ...img,
                createdAt: img.createdAt ? new Date(img.createdAt) : null,
              }))
            : []
        }
      }));
    
    // Если были отфильтрованы некорректные элементы, сохраняем чистую версию
    if (validItems.length !== parsed.length) {
      console.warn(`Filtered out ${parsed.length - validItems.length} invalid cart items`);
    }
    
    return validItems;
  } catch (error) {
    console.error('Failed to load cart from localStorage', error);
    // Очищаем поврежденные данные
    localStorage.removeItem('cart');
    return [];
  }
};

export const CartProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => loadCart());
  const [updatedCart, setUpdatedCart] = useState<ValidatedCartItem[]>();
const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Сохранение в localStorage при изменении корзины
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        removeFromCart(productId);
      } else {
        setCart(prev =>
          prev.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        );
      }
    },
    [removeFromCart]
  );

  const addToCart = useCallback((product: ProductUnited['product'], quantityToAdd: number = 1) => {
    setCart(prev => {
      const exist = prev.find(item => item.product.id === product.id);
      
      if (exist) {
        return prev.map(item =>
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantityToAdd } 
            : item
        );
      }
      
      return [...prev, { product, quantity: quantityToAdd }];
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const isInCart = useCallback((productId: string) => {
    return cart.some(item => item.product.id === productId);
  }, [cart]);

  const getItemQuantity = useCallback((productId: string) => {
    const item = cart.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }, [cart]);

  const totalItems = useMemo(
    () => cart.reduce((sum, { quantity }) => sum + quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => updatedCart?.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0),
    [updatedCart]
  );

  const distinctItems = useMemo(() => cart.length, [cart]);



const validateCart = async () => {
  try {
    setValidationErrors([]);
    setIsValidating(true);
    const response = await fetch('/api/cart/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    });

    if (!response.ok) {
      setValidationErrors(['Ошибка при валидации корзины, пожалуйста, попробуйте снова']);
      return;
    }

    const data = await response.json();

    // Фильтруем null, на всякий случай
    const updatedItems = (data.updatedItems || []).filter(Boolean);

    setUpdatedCart(updatedItems);
    setIsValidating(false);
  } catch (error) {
    setValidationErrors(['Произошла ошибка при валидации корзины, пожалуйста, попробуйте снова']);
    setIsValidating(false);
  }
};


  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      validateCart,
      totalItems,
      updatedCart,
      totalPrice,
      distinctItems,
      isInCart,
      isValidating,
      validationErrors,
      getItemQuantity,
    }),
    [
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      validateCart,
      
      totalItems, 
      updatedCart,
      totalPrice, 
      distinctItems,
      isInCart,
      isValidating,
      validationErrors,
      getItemQuantity,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};