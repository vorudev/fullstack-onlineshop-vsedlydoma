'use client'

import { useState } from 'react';
import { addItemsToOrder } from '@/lib/actions/orders';
import type { CreateOrderItemData } from '@/lib/actions/orders';
import SearchBar from '@/components/searchbar';
import Pagination  from "@/components/pagination";
interface AddOrderItemFormProps {
  orderId: string | undefined; 
Products: Array<{
    id: string;
    price: number;
    slug: string;
    sku: string | null;
    title: string;
    description: string;
  }>;
}

export default function AddOrderItemForm({ 
  orderId, 
  Products, 
}: AddOrderItemFormProps) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); 

  const selectedProductData = Products.find(
    p => p.id === selectedProduct
  );

  // Фильтруем товары по поисковому запросу
  const filteredProducts = Products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const newItems: CreateOrderItemData[] = [{
      title: selectedProductData?.title || '',
      productId: formData.get('productId') as string,
      productSku: selectedProductData?.sku || '',
      quantity: parseInt(formData.get('quantity') as string),
      price: parseFloat(formData.get('price') as string)
    }];
    
    const result = await addItemsToOrder(orderId?? '', newItems);
    
    if (result) {
      setMessage('Item added successfully!');
      setSelectedProduct('');
      setQuantity(1);
      setSearchQuery('');
    } else {
      setMessage('Failed to add item');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="border rounded-lg p-6 max-w-md">
      <h2 className="text-xl font-semibold mb-4">Добавить позицию к заказу</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="productId" className="block text-sm font-medium mb-1">
           Товар
          </label>
          
          {/* Поле поиска */}

          
          <select
            id="productId"
            name="productId"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
            className="w-full bg-neutral-950 border rounded px-3 py-2"
          >
            <option value="">Выберите товар</option>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title} - ${product.price}
                </option>
              ))
            ) : (
              <option disabled>Товаров не найдено</option>
            )}
          </select>
       
          
         
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <input
          type="hidden"
          name="price"
          value={selectedProductData?.price || 0}
        />

        {selectedProductData && (
          <div className=" p-3 rounded">
            <p className="text-sm">
              <span className="font-medium">Сумма:</span>
              ${(selectedProductData.price * quantity).toFixed(2)}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !selectedProduct}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Добавление...' : 'Добавить позицию'}
        </button>

        {message && (
          <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}