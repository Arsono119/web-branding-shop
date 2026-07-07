import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Product, Category, BrandInfo, Settings, Order } from '@/types/product';

const CONTENT_DIR = join(process.cwd(), 'src', 'content');

function readJson<T>(filename: string): T {
  const filePath = join(CONTENT_DIR, filename);
  if (!existsSync(filePath)) {
    return [] as unknown as T;
  }
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function writeJson<T>(filename: string, data: T): void {
  const filePath = join(CONTENT_DIR, filename);
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function getProducts(): Product[] {
  return readJson<Product[]>('products.json');
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug && p.isActive);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function writeProducts(products: Product[]): void {
  writeJson('products.json', products);
}

export function getCategories(): Category[] {
  return readJson<Category[]>('categories.json');
}

export function getActiveCategories(): Category[] {
  return getCategories().filter((c) => c.isActive).sort((a, b) => a.order - b.order);
}

export function writeCategories(categories: Category[]): void {
  writeJson('categories.json', categories);
}

export function getBrand(): BrandInfo {
  return readJson<BrandInfo>('brand.json');
}

export function writeBrand(brand: BrandInfo): void {
  writeJson('brand.json', brand);
}

export function getSettings(): Settings {
  return readJson<Settings>('settings.json');
}

export function writeSettings(settings: Settings): void {
  writeJson('settings.json', settings);
}

export function getOrders(): Order[] {
  return readJson<Order[]>('orders.json');
}

export function writeOrders(orders: Order[]): void {
  writeJson('orders.json', orders);
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
