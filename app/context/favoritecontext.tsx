'use client';
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
export interface FavoriteItem {
   product: ProductUnited['product'];
}


export interface FavoriteContextType {
  favorite: FavoriteItem[];
  addToFavorite: (product: ProductUnited['product']) => void;
  removeFromFavorite: (productId: string) => void;
  clearFavorite: () => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);
const isValidFavoriteItem = (item: any): item is FavoriteItem => {
  return (
    item &&
    typeof item === 'object' &&
    item.product &&
    typeof item.product === 'object' &&
    typeof item.product.id === 'string' &&
    typeof item.product.price === 'number' 
  );
};
const loadFavorite = (): FavoriteItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('favorite');
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    if (!Array.isArray(parsed)) {
      console.warn('Cart data is not an array, clearing cart');
      localStorage.removeItem('cart');
      return [];
    }
    
    // Фильтруем и преобразуем валидные элементы
    const validItems = parsed
      .filter(isValidFavoriteItem)
      .map((item: FavoriteItem) => ({
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

export const FavoriteProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [favorite, setFavorite] = useState<FavoriteItem[]>(() => loadFavorite());

  // Сохранение в localStorage при изменении корзины
  useEffect(() => {
    try {
      localStorage.setItem('favorite', JSON.stringify(favorite));
    } catch (e) {
      console.error('Failed to save favorite to localStorage', e);
    }
  }, [favorite]);

  const removeFromFavorite = useCallback((productId: string) => {
    setFavorite(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        removeFromFavorite(productId);
      } else {
        setFavorite(prev =>
          prev.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        );
      }
    },
    [removeFromFavorite]
  );

  const addToFavorite = useCallback((product: ProductUnited['product'], quantityToAdd: number = 1) => {
    setFavorite(prev => {
      const exist = prev.find(item => item.product.id === product.id);
      
      if (exist) {
        return prev.map(item =>
          item.product.id === product.id 
            ? { ...item, quantity: quantityToAdd } 
            : item
        );
      }
      
      return [...prev, { product, quantity: quantityToAdd }];
    });
  }, []);

  const clearFavorite = useCallback(() => setFavorite([]), []);

  const isInFavorite = useCallback((productId: string) => {
    return favorite.some(item => item.product.id === productId);
  }, [favorite]);

  const getItemQuantity = useCallback((productId: string) => {
    const item = favorite.find(item => item.product.id === productId);
    return item ? 1 : 0;
  }, [favorite]);

  const totalItems = useMemo(
    () => favorite.reduce((sum) => sum + 1, 0),
    [favorite]
  );


  const distinctItems = useMemo(() => favorite.length, [favorite]);

  const value = useMemo(
    () => ({
      favorite,
      addToFavorite,
      removeFromFavorite,
      updateQuantity,
      clearFavorite,
      totalItems,
      distinctItems,
      isInFavorite,
      getItemQuantity,
    }),
    [
      favorite, 
      addToFavorite, 
      removeFromFavorite, 
      updateQuantity, 
      clearFavorite, 
      totalItems, 
      distinctItems,
      isInFavorite,
      getItemQuantity,
    ]
  );

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorite must be used within FavoriteProvider');
  }
  return context;
};