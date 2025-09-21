'use client';

import { useState, useMemo } from 'react';
import { products } from '@/data/products';
import { Product } from '@/types/product';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export default function Home() {
  const [cartMap, setCartMap] = useState<Map<string, number>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);

  const productIndex = useMemo(() => {
    const m = new Map(products.map(p => [p.id, p]));
    return m;
  }, []);

  const addOne = (id: string) => setCartMap(prev => {
    const next = new Map(prev);
    next.set(id, (next.get(id) ?? 0) + 1);
    return next;
  });

  const removeOne = (id: string) => setCartMap(prev => {
    const next = new Map(prev);
    const q = (next.get(id) ?? 0) - 1;
    q <= 0 ? next.delete(id) : next.set(id, q);
    return next;
  });

  const cart = useMemo(() => {
    const items: { product: Product; quantity: number }[] = [];
    cartMap.forEach((qty, id) => {
      const p = productIndex.get(id);
      if (p) items.push({ product: p, quantity: qty });
    });
    return items;
  }, [cartMap, productIndex]);

  const total = useMemo(() => 
    cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    [cart]
  );

  const generateReceipt = async () => {
    if (cart.length === 0) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate receipt');
      }

      const data = await response.json();
      
      // Show success message or redirect to QR code page
      alert(`Receipt generated! Order ID: ${data.orderId}\nShort URL: ${data.shortUrl}`);
      
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Failed to generate receipt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {isGenerating && <LoadingScreen message="Generating your receipt..." />}
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Electronic Receipt Demo</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map(product => {
                const quantity = cartMap.get(product.id) ?? 0;
                return (
                  <div key={product.id} className="bg-white rounded-lg shadow p-4">
                    <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded mb-3 flex items-center justify-center">
                      <span className="text-4xl">
                        {product.id === '1' && '☕'}
                        {product.id === '2' && '🧁'}
                        {product.id === '3' && '🥪'}
                        {product.id === '4' && '🧃'}
                        {product.id === '5' && '🍪'}
                        {product.id === '6' && '🍵'}
                      </span>
                    </div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-600 text-sm">{product.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeOne(product.id)}
                          disabled={quantity === 0}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => addOne(product.id)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 h-fit">
            <h2 className="text-xl font-semibold mb-4">Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center mb-3 pb-3 border-b">
                    <div>
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">${item.product.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-3 mt-3 border-t">
                  <div className="flex justify-between font-semibold text-lg mb-4">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <button
                    onClick={generateReceipt}
                    disabled={isGenerating}
                    className="w-full bg-green-500 text-white py-3 rounded font-semibold hover:bg-green-600 disabled:bg-gray-400"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Receipt'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
