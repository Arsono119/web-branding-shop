'use client';

import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetch('/api/orders').then((r) => r.json()).then(setOrders).catch(() => {});
  }, []);

  const filtered = filterStatus ? orders.filter((o) => o.status === filterStatus) : orders;
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });
    setOrders(orders.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    setToast('Status pesanan diupdate!');
  };

  const getBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'brand';
      case 'shipped': return 'default';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Pesanan</h1>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-10 px-4 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <Card><p className="text-muted text-center py-8">Belum ada pesanan.</p></Card>
      ) : sorted.map((order) => (
        <Card key={order.id} className="cursor-pointer hover:border-brand-200" onClick={() => { setSelectedOrder(order); setShowModal(true); }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted">{order.id}</span>
                <Badge variant={getBadgeVariant(order.status)}>{order.status}</Badge>
              </div>
              <p className="font-medium text-foreground mt-1">{order.customerName}</p>
              <p className="text-sm text-muted">{order.items.length} item</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-brand-600">{formatRupiah(order.grandTotal)}</p>
              <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
            </div>
          </div>
        </Card>
      ))}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Pesanan ${selectedOrder?.id || ''}`} size="lg">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted">Pelanggan</p><p className="font-medium">{selectedOrder.customerName}</p></div>
              <div><p className="text-muted">WhatsApp</p><p className="font-medium">{selectedOrder.phone}</p></div>
              <div className="col-span-2"><p className="text-muted">Alamat</p><p className="font-medium">{selectedOrder.address}</p></div>
              {selectedOrder.notes && <div className="col-span-2"><p className="text-muted">Catatan</p><p className="font-medium">{selectedOrder.notes}</p></div>}
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground mb-2">Items</p>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span className="text-muted">{item.productName} ({item.size}/{item.color}) x{item.quantity}</span>
                  <span>{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-brand-600">{formatRupiah(selectedOrder.grandTotal)}</span>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => (
                  <Button key={status} variant={selectedOrder.status === status ? 'primary' : 'secondary'} size="sm"
                    onClick={() => updateStatus(selectedOrder.id, status)} disabled={selectedOrder.status === status}>
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
