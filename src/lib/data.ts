import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Product, Category, BrandInfo, Settings, Order } from '@/types/product';
import { writeGitHubFile } from './github';

const CONTENT_DIR = join(process.cwd(), 'src', 'content');
const isVercel = !!process.env.VERCEL;

function readJson<T>(filename: string): T {
  const filePath = join(CONTENT_DIR, filename);
  if (!existsSync(filePath)) return [] as unknown as T;
  return JSON.parse(readFileSync(filePath, 'utf-8')) as T;
}

function writeJsonLocal(filename: string, data: unknown): void {
  const filePath = join(CONTENT_DIR, filename);
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function writeJson(filename: string, data: unknown): Promise<void> {
  if (isVercel && process.env.GITHUB_TOKEN) {
    await writeGitHubFile(filename, JSON.stringify(data, null, 2));
  } else {
    writeJsonLocal(filename, data);
  }
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

export async function writeProducts(products: Product[]): Promise<void> {
  await writeJson('products.json', products);
}

export function getCategories(): Category[] {
  return readJson<Category[]>('categories.json');
}

export function getActiveCategories(): Category[] {
  return getCategories().filter((c) => c.isActive).sort((a, b) => a.order - b.order);
}

export async function writeCategories(categories: Category[]): Promise<void> {
  await writeJson('categories.json', categories);
}

export function getBrand(): BrandInfo {
  return readJson<BrandInfo>('brand.json');
}

export async function writeBrand(brand: BrandInfo): Promise<void> {
  await writeJson('brand.json', brand);
}

export function getSettings(): Settings {
  return readJson<Settings>('settings.json');
}

export async function writeSettings(settings: Settings): Promise<void> {
  await writeJson('settings.json', settings);
}

export function getOrders(): Order[] {
  return readJson<Order[]>('orders.json');
}

export async function writeOrders(orders: Order[]): Promise<void> {
  await writeJson('orders.json', orders);
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
