'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { BrandInfo } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CheckoutPage() {
  const [brand, setBrand] = useState<BrandInfo | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cod'>('qr');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    fetch('/api/brand')
      .then((r) => r.json())
      .then(setBrand)
      .catch(() => {});
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  if (!brand) return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-muted">Memuat...</div>;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= brand.shipping.freeShippingMin ? 0 : brand.shipping.flatRate;
  const grandTotal = subtotal + shipping;

  const handlePlaceOrder = () => {
    if (!customerName || !phone || !address) return;

    const newOrder = {
      id: `ORD-${Date.now()}`,
      customerName,
      phone,
      address,
      notes,
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: subtotal,
      shippingCost: shipping,
      grandTotal,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch(() => {});

    setOrderId(newOrder.id);
    setOrderPlaced(true);
    localStorage.removeItem('cart');
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ScrollReveal>
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success flex items-center justify-center text-white text-3xl">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Pesanan Diterima!</h1>
          <p className="text-muted mb-2">{brand.shipping.codNote}</p>
          <p className="text-sm text-muted mb-8">
            ID Pesanan: <span className="font-mono font-medium text-foreground">{orderId}</span>
          </p>

          {paymentMethod === 'qr' && (
            <div className="bg-surface-dim rounded-2xl border border-border p-6 mb-8">
              <h3 className="font-semibold text-foreground mb-4">Scan QR untuk Pembayaran</h3>
              {brand.payment.qrImage ? (
                <img src={brand.payment.qrImage} alt="QR Payment" className="w-48 h-48 mx-auto" />
              ) : (
                <QRCodeSVG
                  value={`https://api.whatsapp.com/send?phone=${brand.contact.wa}&text=Halo, saya ingin konfirmasi pesanan ${orderId} sebesar ${formatRupiah(grandTotal)}`}
                  size={192}
                  className="mx-auto"
                />
              )}
              <p className="text-sm text-muted mt-4">
                Transfer ke {brand.payment.bank} - {brand.payment.vaNumber}
              </p>
              <p className="text-sm text-muted">a.n. {brand.payment.accountName}</p>
              <p className="font-bold text-brand-600 mt-2">{formatRupiah(grandTotal)}</p>
            </div>
          )}

          {paymentMethod === 'cod' && (
            <div className="bg-surface-dim rounded-2xl border border-border p-6 mb-8">
              <h3 className="font-semibold text-foreground mb-2">Bayar di Tempat (COD)</h3>
              <p className="text-sm text-muted">Bayar {formatRupiah(grandTotal)} saat barang diterima.</p>
            </div>
          )}

          <Button variant="secondary" onClick={() => { window.location.href = '/'; }}>
            Kembali ke Home
          </Button>
        </ScrollReveal>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-muted text-lg mb-4">Keranjang kosong.</p>
        <Button onClick={() => (window.location.href = '/produk')}>Belanja Sekarang</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ScrollReveal>
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ScrollReveal>
            <div className="bg-surface rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-4">Data Diri</h2>
              <div className="space-y-4">
                <Input label="Nama Lengkap" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="John Doe" />
                <Input label="Nomor WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08123456789" />
                <Textarea label="Alamat Lengkap" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Jl. Contoh No. 123, Kota..." rows={3} />
                <Textarea label="Catatan (opsional)" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan untuk pesanan..." rows={2} />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="bg-surface rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-4">Metode Pembayaran</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentMethod('qr')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'qr' ? 'border-brand-500 bg-brand-50' : 'border-border hover:border-brand-200'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📱</div>
                    <div className="font-medium text-foreground text-sm">QR / Transfer</div>
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'cod' ? 'border-brand-500 bg-brand-50' : 'border-border hover:border-brand-200'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">💵</div>
                    <div className="font-medium text-foreground text-sm">COD</div>
                  </div>
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div>
          <ScrollReveal delay={200}>
            <div className="bg-surface rounded-2xl border border-border p-6 sticky top-24">
              <h2 className="font-semibold text-foreground mb-4">Ringkasan Pesanan</h2>
              <div className="space-y-3 mb-4">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted">
                      {item.name} ({item.size}) x{item.quantity}
                    </span>
                    <span className="font-medium">{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Ongkir</span>
                  <span>{shipping === 0 ? 'Gratis' : formatRupiah(shipping)}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-success">Ongkir gratis! Belanja min. {formatRupiah(brand.shipping.freeShippingMin)}</p>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-brand-600">{formatRupiah(grandTotal)}</span>
                </div>
              </div>
              <Button onClick={handlePlaceOrder} size="lg" className="w-full mt-6" disabled={!customerName || !phone || !address}>
                Bayar Sekarang
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
