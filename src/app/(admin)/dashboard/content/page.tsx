'use client';

import { useState, useEffect } from 'react';
import { BrandInfo } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { Toast } from '@/components/ui/Toast';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function AdminContentPage() {
  const [brand, setBrand] = useState<BrandInfo | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/brand').then((r) => r.json()).then(setBrand).catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!brand) return;
    await fetch('/api/brand', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brand),
    });
    setToast('Konten berhasil disimpan!');
  };

  if (!brand) return <div className="text-muted py-8 text-center">Memuat...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Konten Website</h1>
        <Button onClick={handleSave}>Simpan Semua</Button>
      </div>

      <Card>
        <h2 className="font-semibold text-foreground mb-4">Brand Info</h2>
        <div className="space-y-4">
          <Input label="Nama Brand" value={brand.name} onChange={(e) => setBrand({ ...brand, name: e.target.value })} />
          <Input label="Tagline" value={brand.tagline} onChange={(e) => setBrand({ ...brand, tagline: e.target.value })} />
          <ImageUpload label="Logo" value={brand.logo} onChange={(url) => setBrand({ ...brand, logo: url })} placeholder="/images/logo.png" />
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-foreground mb-4">Hero / Landing</h2>
        <div className="space-y-4">
          <Input label="Headline" value={brand.hero.headline} onChange={(e) => setBrand({ ...brand, hero: { ...brand.hero, headline: e.target.value } })} />
          <Textarea label="Subtext" value={brand.hero.subtext} onChange={(e) => setBrand({ ...brand, hero: { ...brand.hero, subtext: e.target.value } })} rows={3} />
          <Input label="CTA Button Text" value={brand.hero.cta} onChange={(e) => setBrand({ ...brand, hero: { ...brand.hero, cta: e.target.value } })} />
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-foreground mb-4">About / Brand Story</h2>
        <div className="space-y-4">
          <Textarea label="Cerita Brand" value={brand.about.story} onChange={(e) => setBrand({ ...brand, about: { ...brand.about, story: e.target.value } })} rows={5} />
          <Input label="Nilai Brand (koma)" value={brand.about.values.join(', ')} onChange={(e) => setBrand({ ...brand, about: { ...brand.about, values: e.target.value.split(',').map((v) => v.trim()) } })} />
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-foreground mb-4">Pembayaran</h2>
        <div className="space-y-4">
          <ImageUpload label="QR / Gambar Pembayaran" value={brand.payment.qrImage} onChange={(url) => setBrand({ ...brand, payment: { ...brand.payment, qrImage: url } })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Bank" value={brand.payment.bank} onChange={(e) => setBrand({ ...brand, payment: { ...brand.payment, bank: e.target.value } })} />
            <Input label="No. VA / Rekening" value={brand.payment.vaNumber} onChange={(e) => setBrand({ ...brand, payment: { ...brand.payment, vaNumber: e.target.value } })} />
          </div>
          <Input label="Atas Nama" value={brand.payment.accountName} onChange={(e) => setBrand({ ...brand, payment: { ...brand.payment, accountName: e.target.value } })} />
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-foreground mb-4">Pengiriman</h2>
        <div className="space-y-4">
          <Input label="Ongkir Flat Rate (Rp)" type="number" value={String(brand.shipping.flatRate)} onChange={(e) => setBrand({ ...brand, shipping: { ...brand.shipping, flatRate: parseInt(e.target.value) || 0 } })} />
          <Input label="Gratis Ongkir Min. Belanja (Rp)" type="number" value={String(brand.shipping.freeShippingMin)} onChange={(e) => setBrand({ ...brand, shipping: { ...brand.shipping, freeShippingMin: parseInt(e.target.value) || 0 } })} />
          <Input label="Catatan COD" value={brand.shipping.codNote} onChange={(e) => setBrand({ ...brand, shipping: { ...brand.shipping, codNote: e.target.value } })} />
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-foreground mb-4">Kontak</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Instagram" value={brand.contact.ig} onChange={(e) => setBrand({ ...brand, contact: { ...brand.contact, ig: e.target.value } })} />
            <Input label="WhatsApp" value={brand.contact.wa} onChange={(e) => setBrand({ ...brand, contact: { ...brand.contact, wa: e.target.value } })} />
          </div>
          <Input label="Email" value={brand.contact.email} onChange={(e) => setBrand({ ...brand, contact: { ...brand.contact, email: e.target.value } })} />
          <Input label="Alamat" value={brand.contact.address} onChange={(e) => setBrand({ ...brand, contact: { ...brand.contact, address: e.target.value } })} />
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-foreground mb-4">SEO</h2>
        <div className="space-y-4">
          <Input label="Title" value={brand.seo.title} onChange={(e) => setBrand({ ...brand, seo: { ...brand.seo, title: e.target.value } })} />
          <Textarea label="Description" value={brand.seo.description} onChange={(e) => setBrand({ ...brand, seo: { ...brand.seo, description: e.target.value } })} rows={2} />
          <ImageUpload label="OG Image (Social Share)" value={brand.seo.ogImage} onChange={(url) => setBrand({ ...brand, seo: { ...brand.seo, ogImage: url } })} />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">Simpan Semua Perubahan</Button>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
