'use client';

import { useState, useEffect } from 'react';
import { Product, Category } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { ImageUpload } from '@/components/ui/ImageUpload';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function generateSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('');

  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formSizes, setFormSizes] = useState('S,M,L,XL');
  const [formColors, setFormColors] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formStock, setFormStock] = useState('10');

  const loadData = () => {
    fetch('/api/products').then((r) => r.json()).then(setProducts).catch(() => {});
    fetch('/api/categories').then((r) => r.json()).then(setCategories).catch(() => {});
  };

  useEffect(() => { loadData(); }, []);

  const activeCategories = categories.filter((c) => c.isActive).sort((a, b) => a.order - b.order);
  const filtered = filterCategory
    ? products.filter((p) => p.category.toLowerCase() === filterCategory.toLowerCase())
    : products;

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName(''); setFormPrice(''); setFormOriginalPrice(''); setFormDescription('');
    setFormCategory(activeCategories[0]?.slug || ''); setFormSizes('S,M,L,XL');
    setFormColors(''); setFormTags(''); setFormImages([]); setFormStock('10');
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name); setFormPrice(String(product.price));
    setFormOriginalPrice(product.originalPrice ? String(product.originalPrice) : '');
    setFormDescription(product.description); setFormCategory(product.category.toLowerCase());
    setFormSizes(product.sizes.join(',')); setFormColors(product.colors.join(','));
    setFormTags(product.tags.join(','));
    setFormImages([...product.images]);
    setFormStock(String(Object.values(product.stock)[0] || 10));
    setShowModal(true);
  };

  const handleSave = async () => {
    const slug = generateSlug(formName);
    const stock: Record<string, number> = {};
    formSizes.split(',').map((s) => s.trim()).filter(Boolean).forEach((s) => {
      stock[s] = parseInt(formStock) || 0;
    });

    const payload = {
      ...(editingProduct ? { id: editingProduct.id } : { id: generateId('prod'), isActive: true, createdAt: new Date().toISOString() }),
      name: formName, slug, price: parseInt(formPrice) || 0,
      originalPrice: formOriginalPrice ? parseInt(formOriginalPrice) : undefined,
      description: formDescription, category: formCategory,
      sizes: formSizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: formColors.split(',').map((c) => c.trim()).filter(Boolean),
      tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
      images: formImages.filter(Boolean),
      stock,
    };

    await fetch('/api/products', {
      method: editingProduct ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setToast(editingProduct ? 'Produk berhasil diupdate!' : 'Produk berhasil ditambahkan!');
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setToast('Produk berhasil dihapus!');
    loadData();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !current }),
    });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Produk</h1>
        <Button onClick={openCreateModal}>+ Tambah Produk</Button>
      </div>

      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
        className="h-10 px-4 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
        <option value="">Semua Kategori</option>
        {activeCategories.map((cat) => (<option key={cat.id} value={cat.slug}>{cat.name}</option>))}
      </select>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card><p className="text-muted text-center py-8">Belum ada produk.</p></Card>
        ) : filtered.map((product) => (
          <Card key={product.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img src={product.images[0] || '/images/products/placeholder-1.jpg'} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{product.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-semibold text-brand-600">{formatRupiah(product.price)}</span>
                <Badge variant={product.isActive ? 'success' : 'default'}>{product.isActive ? 'Aktif' : 'Nonaktif'}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => toggleActive(product.id, product.isActive)}>
                {product.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => openEditModal(product)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>Hapus</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingProduct ? 'Edit Produk' : 'Tambah Produk'} size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input label="Nama Produk" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Kaos Premium Hitam" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Harga (Rp)" type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
            <Input label="Harga Coret (Rp)" type="number" value={formOriginalPrice} onChange={(e) => setFormOriginalPrice(e.target.value)} />
          </div>
          <Textarea label="Deskripsi" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Kategori</label>
              <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-foreground text-sm">
                {activeCategories.map((cat) => (<option key={cat.id} value={cat.slug}>{cat.name}</option>))}
              </select>
            </div>
            <Input label="Stok per Size" type="number" value={formStock} onChange={(e) => setFormStock(e.target.value)} />
          </div>
          <Input label="Sizes (koma)" value={formSizes} onChange={(e) => setFormSizes(e.target.value)} placeholder="S,M,L,XL" />
          <Input label="Warna (koma)" value={formColors} onChange={(e) => setFormColors(e.target.value)} placeholder="Hitam,Putih" />
          <Input label="Tags (koma)" value={formTags} onChange={(e) => setFormTags(e.target.value)} placeholder="bestseller,premium" />

          {/* Multiple Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Gambar Produk</label>
            <div className="space-y-3">
              {formImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <ImageUpload
                    value={img}
                    onChange={(url) => {
                      const updated = [...formImages];
                      updated[idx] = url;
                      setFormImages(updated);
                    }}
                  />
                </div>
              ))}
              {formImages.length < 6 && (
                <button
                  onClick={() => setFormImages([...formImages, ''])}
                  className="w-full py-3 border-2 border-dashed border-brand-300 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
                >
                  + Tambah Gambar
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button onClick={handleSave} disabled={!formName || !formPrice}>{editingProduct ? 'Update' : 'Simpan'}</Button>
        </div>
      </Modal>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
