'use client';
import { useCart } from "../context/cartcontext"
import OrderForm from "@/components/forms/order-form";
import CartItemComponent from "../cartprops"

export default function CartPage() {
    const { cart, clearCart, totalPrice  } = useCart();
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

      const getCartItemsString = () => {
        return cart.map(item => `${item.title} (x${item.quantity})`).join(', ');
    };
 
    // Для OrderForm нужен один id - можем создать комбинированный
    const cartOrderId = cart.map(item => item.id).join(',');
    return (  <div>
            {cart.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="bdog md:text-[12px] text-[11px] uppercase">cart is empty</p>
                </div>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {cart.map((item) => (
                        <CartItemComponent key={item.id} item={item} />
                    ))}
                </ul>
            )}
            
            {cart.length > 0 && (
                <div className="absolute bottom-0 lg:w-[480px] w-full pb-[16px]">
                    <div className="flex-col flex gap-[16px] lg:w-[480px] pr-[32px]">
                        <div className="w-full flex flex-row justify-between">
                            <h2 className="text-[12px] uppercase bdog">subtotal</h2>
                            <h2 className="text-[12px] uppercase bdog">$ {total.toFixed(2)} USD</h2>
                        </div>
                        
                        {/* OrderForm для всей корзины */}
                        <OrderForm 
                       items={cart}
                        />
                        
                        <button
                            className="bg-[rgb(35,25,22)] text-[rgb(251,251,239)] w-full h-[48px] bdog text-[12px] uppercase"
                            onClick={clearCart}
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            )}
        </div>)
}