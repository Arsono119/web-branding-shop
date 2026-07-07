import Link from 'next/link';
import { getBrand, getProducts, getActiveCategories, formatRupiah } from '@/lib/data';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const brand = getBrand();
  const products = getProducts().filter((p) => p.isActive).slice(0, 6);
  const categories = getActiveCategories();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-brand-subtle overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <ScrollReveal>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                {brand.hero.headline}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="mt-6 text-lg text-muted leading-relaxed">
                {brand.hero.subtext}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="mt-8">
                <Link href="/produk">
                  <Button size="lg">{brand.hero.cta}</Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-brand opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-200 opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-foreground text-center mb-8">Kategori</h2>
            </ScrollReveal>
            <div className="flex flex-wrap justify-center gap-4 stagger-children">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/produk?kategori=${cat.slug}`}
                  className="px-6 py-3 rounded-full border border-border bg-surface hover:bg-brand-50 hover:border-brand-200 text-sm font-medium text-foreground transition-all duration-200"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-16 bg-surface-dim">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">Produk Terbaru</h2>
                <Link href="/produk" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                  Lihat Semua →
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-children">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Values */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">Mengapa Pilih Kami?</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-children">
            {brand.about.values.map((value, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-surface-dim border border-border hover:border-brand-200 transition-colors">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-brand flex items-center justify-center text-white text-xl">
                  {['✦', '◆', '●', '★'][i] || '●'}
                </div>
                <h3 className="font-semibold text-foreground text-sm">{value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-white mb-4">Siap Belanja?</h2>
            <p className="text-white/80 mb-8">Temukan produk terbaik kami sekarang.</p>
            <Link href="/produk">
              <Button variant="secondary" size="lg">Lihat Katalog</Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
