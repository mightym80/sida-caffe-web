"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus, Coffee, X, ZoomIn } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { toast } from '@/components/toaster';
import { Product } from '@/lib/supabase';

export function ProductCard({ product }: { product: Product }) {
  const { addItem, items, updateQuantity, removeItem } = useCart();
  const [showZoom, setShowZoom] = useState(false);
  
  const cartItem = items.find(i => i.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, image: product.image });
    toast(`${product.name} aggiunto al carrello`, 'success');
  };

  const handleIncrease = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
    }
  };

  return (
    <>
      <div className="bg-surface rounded-xl overflow-hidden border border-border flex">
        {/* Image */}
        <div 
          className="w-24 h-24 flex-shrink-0 relative bg-surface-highlight cursor-pointer"
          onClick={() => product.image && setShowZoom(true)}
        >
          {product.image ? (
            <>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-1 right-1 p-1 bg-black/50 rounded">
                <ZoomIn size={12} className="text-white" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Coffee size={32} className="text-primary/50" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-text-primary text-sm">{product.name}</h3>
            {product.description && (
              <p className="text-xs text-text-secondary mt-1 line-clamp-2">{product.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end mt-2">
            {quantity === 0 ? (
              <button
                onClick={handleAdd}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus size={16} />
                Aggiungi
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-surface-highlight rounded-lg p-1">
                <button
                  onClick={handleDecrease}
                  className="p-1 rounded bg-surface hover:bg-error/20 transition-colors"
                >
                  <Minus size={16} className="text-text-primary" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-text-primary">{quantity}</span>
                <button
                  onClick={handleIncrease}
                  className="p-1 rounded bg-surface hover:bg-primary/20 transition-colors"
                >
                  <Plus size={16} className="text-text-primary" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {showZoom && product.image && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowZoom(false)}
        >
          <button className="absolute top-4 right-4 p-2 bg-surface rounded-full">
            <X size={24} className="text-text-primary" />
          </button>
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
        </div>
      )}
    </>
  );
}
