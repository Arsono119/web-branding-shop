import { notFound } from 'next/navigation';
import { getProducts, getProductBySlug, formatRupiah, getBrand } from '@/lib/data';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { AddToCartButton } from '@/components/checkout/AddToCartButton';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  const brand = getBrand();

  if (!product) notFound();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const totalStock = Object.values(product.stock).reduce((sum, s) => sum + s, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <ScrollReveal>
          <div className="aspect-square bg-surface-dim rounded-2xl overflow-hidden border border-border">
            <img
              src={product.images[0] || '/images/products/placeholder-1.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </ScrollReveal>

        {/* Info */}
        <div>
          <ScrollReveal>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="brand">{product.category}</Badge>
              {discount > 0 && <Badge variant="error">-{discount}%</Badge>}
              {product.tags.includes('bestseller') && <Badge variant="warning">Bestseller</Badge>}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-brand-600">{formatRupiah(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted line-through">{formatRupiah(product.originalPrice)}</span>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <p className="text-muted leading-relaxed mb-8">{product.description}</p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <AddToCartButton product={product} />
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="mt-8 pt-8 border-t border-border space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted">Stok:</span>
                <span className={totalStock > 0 ? 'text-success font-medium' : 'text-error font-medium'}>
                  {totalStock > 0 ? `${totalStock} tersedia` : 'Habis'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted">Ongkir:</span>
                <span>{brand.shipping.flatRate === 0 ? 'Gratis' : formatRupiah(brand.shipping.flatRate)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted">Pembayaran:</span>
                <span>QR / COD</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
