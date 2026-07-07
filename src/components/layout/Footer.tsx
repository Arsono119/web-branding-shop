import Link from 'next/link';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { BrandInfo } from '@/types/product';

function getBrand(): BrandInfo {
  const filePath = join(process.cwd(), 'src', 'content', 'brand.json');
  if (!existsSync(filePath)) {
    return {} as BrandInfo;
  }
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

export function Footer() {
  const brand = getBrand();

  return (
    <footer className="bg-surface-dim border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="h-8 w-auto" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white font-bold text-sm">
                  {brand.name.charAt(0)}
                </div>
              )}
              <span className="font-bold text-lg text-foreground">{brand.name}</span>
            </div>
            <p className="text-sm text-muted max-w-sm">{brand.tagline}</p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Navigasi</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-muted hover:text-foreground transition-colors">Home</Link>
              <Link href="/produk" className="block text-sm text-muted hover:text-foreground transition-colors">Produk</Link>
              <Link href="/about" className="block text-sm text-muted hover:text-foreground transition-colors">About</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Kontak</h3>
            <div className="space-y-2 text-sm text-muted">
              <p>IG: {brand.contact.ig}</p>
              <p>WA: {brand.contact.wa}</p>
              <p>{brand.contact.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted">&copy; {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
