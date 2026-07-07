'use client';

import { useState, useEffect } from 'react';
import { Settings, Category } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then(setSettings).catch(() => {});
    fetch('/api/categories').then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  const handleSaveSettings = async () => {
    if (!settings) return;
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setToast('Settings berhasil disimpan!');
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      slug: newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      isActive: true,
      order: categories.length + 1,
    };
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat),
    });
    setCategories([...categories, newCat]);
    setNewCategoryName('');
    setShowCategoryModal(false);
    setToast('Kategori berhasil ditambahkan!');
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return;
    await fetch('/api/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setCategories(categories.filter((c) => c.id !== id));
    setToast('Kategori berhasil dihapus!');
  };

  const toggleCategoryActive = async (id: string, current: boolean) => {
    await fetch('/api/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !current }),
    });
    setCategories(categories.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  if (!settings) return <div className="text-muted py-8 text-center">Memuat...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <Card>
        <h2 className="font-semibold text-foreground mb-4">General</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Maintenance Mode</p>
            <p className="text-sm text-muted">Aktifkan untuk menampilkan halaman maintenance</p>
          </div>
          <button onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
            className={`relative w-12 h-6 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-success' : 'bg-border'}`}>
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Kategori</h2>
          <Button size="sm" onClick={() => setShowCategoryModal(true)}>+ Tambah</Button>
        </div>
        {categories.length === 0 ? (
          <p className="text-sm text-muted">Belum ada kategori.</p>
        ) : categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{cat.name}</span>
              <Badge variant={cat.isActive ? 'success' : 'default'}>{cat.isActive ? 'Aktif' : 'Nonaktif'}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => toggleCategoryActive(cat.id, cat.isActive)}>
                {cat.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDeleteCategory(cat.id)}>Hapus</Button>
            </div>
          </div>
        ))}
      </Card>

      <Card>
        <h2 className="font-semibold text-foreground mb-4">Admin Credentials</h2>
        <p className="text-sm text-muted mb-2">Username dan password admin diatur melalui environment variables:</p>
        <div className="bg-surface-dim rounded-lg p-4 font-mono text-sm">
          <p>ADMIN_USERNAME=admin</p>
          <p>ADMIN_PASSWORD=your_password</p>
          <p>NEXTAUTH_SECRET=your_secret</p>
        </div>
        <p className="text-xs text-muted mt-2">Ubah values di file <code className="bg-surface-dim px-1 rounded">.env.local</code> untuk production.</p>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} size="lg">Simpan Settings</Button>
      </div>

      <Modal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)} title="Tambah Kategori">
        <div className="space-y-4">
          <Input label="Nama Kategori" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Kaos" />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>Batal</Button>
            <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>Tambah</Button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
