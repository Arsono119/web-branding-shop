export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  stock: Record<string, number>;
  category: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  order: number;
}

export interface BrandInfo {
  name: string;
  tagline: string;
  logo: string;
  favicon: string;
  hero: {
    headline: string;
    subtext: string;
    cta: string;
  };
  about: {
    story: string;
    values: string[];
  };
  payment: {
    qrImage: string;
    vaNumber: string;
    bank: string;
    accountName: string;
  };
  shipping: {
    flatRate: number;
    codNote: string;
    freeShippingMin: number;
  };
  contact: {
    ig: string;
    wa: string;
    email: string;
    address: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
}

export interface Settings {
  maintenanceMode: boolean;
  currency: string;
  currencySymbol: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'qr' | 'cod';

export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  notes: string;
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}
