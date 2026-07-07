'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(
      (item: { productId: string; size: string; color: string }) =>
        item.productId === product.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    setToast('Ditambahkan ke keranjang!');
  };

  return (
    <div className="space-y-4">
      {/* Sizes */}
      {product.sizes.length > 0 && (
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Ukuran</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedSize === size
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-border text-muted hover:border-brand-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {product.colors.length > 0 && (
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Warna</label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedColor === color
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-border text-muted hover:border-brand-200'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Jumlah</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-surface-dim transition-colors"
          >
            -
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-surface-dim transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <Button onClick={handleAddToCart} size="lg" className="w-full">
        Tambah ke Keranjang
      </Button>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
