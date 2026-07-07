'use client';

import Link from 'next/link';
import { Product } from '@/types/product';
import { formatRupiah } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/produk/${product.slug}`} className="group block">
      <div className="bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-200 hover:scale-[1.02]">
        <div className="aspect-square bg-surface-dim overflow-hidden relative">
          <img
            src={product.images[0] || '/images/products/placeholder-1.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discount > 0 && (
            <div className="absolute top-3 left-3">
              <Badge variant="error">-{discount}%</Badge>
            </div>
          )}
          {product.tags.includes('bestseller') && (
            <div className="absolute top-3 right-3">
              <Badge variant="brand">Bestseller</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-brand-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-brand-600">{formatRupiah(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted line-through">{formatRupiah(product.originalPrice)}</span>
            )}
          </div>
          <p className="text-xs text-muted mt-2 line-clamp-2">{product.description}</p>
        </div>
      </div>
    </Link>
  );
}
