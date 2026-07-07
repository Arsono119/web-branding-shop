'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types/product';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function DashboardPage() {
  const [products, setProducts] = useState<{ length: number }[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [brandName, setBrandName] = useState('');

  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then(setProducts).catch(() => {});
    fetch('/api/orders').then((r) => r.json()).then(setOrders).catch(() => {});
    fetch('/api/brand').then((r) => r.json()).then((b) => setBrandName(b.name || '')).catch(() => {});
  }, []);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const totalRevenue = orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.grandTotal, 0);
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-muted">Total Produk</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalProducts}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Total Pesanan</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalOrders}</p>
          {pendingOrders > 0 && <p className="text-xs text-warning mt-1">{pendingOrders} pending</p>}
        </Card>
        <Card>
          <p className="text-sm text-muted">Revenue</p>
          <p className="text-2xl font-bold text-brand-600 mt-1">{formatRupiah(totalRevenue)}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Brand</p>
          <p className="text-2xl font-bold text-foreground mt-1">{brandName}</p>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold text-foreground mb-4">Pesanan Terbaru</h2>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted">Belum ada pesanan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted font-medium">ID</th>
                  <th className="text-left py-2 text-muted font-medium">Pelanggan</th>
                  <th className="text-left py-2 text-muted font-medium">Total</th>
                  <th className="text-left py-2 text-muted font-medium">Status</th>
                  <th className="text-left py-2 text-muted font-medium">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="py-2 font-mono text-xs">{order.id}</td>
                    <td className="py-2">{order.customerName}</td>
                    <td className="py-2 font-medium">{formatRupiah(order.grandTotal)}</td>
                    <td className="py-2">
                      <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'error' : order.status === 'pending' ? 'warning' : 'default'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-2 text-muted">{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
