'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/dashboard/products', label: 'Produk', icon: '📦' },
  { href: '/admin/dashboard/orders', label: 'Pesanan', icon: '🧾' },
  { href: '/admin/dashboard/content', label: 'Konten', icon: '✏️' },
  { href: '/admin/dashboard/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-dim flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link href="/admin/dashboard" className="font-bold text-lg text-foreground">
            Admin Panel
          </Link>
          <button className="lg:hidden text-muted" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-muted hover:bg-surface-dim hover:text-foreground'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-surface-dim hover:text-foreground transition-colors"
          >
            <span>🏠</span>
            Lihat Website
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('admin-auth');
              signOut({ callbackUrl: '/' });
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-red-50 hover:text-error transition-colors w-full"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-xl border-b border-border flex items-center px-6">
          <button
            className="lg:hidden mr-4 text-muted"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h2 className="text-sm font-medium text-muted">
            {sidebarLinks.find((l) => l.href === pathname)?.label || 'Dashboard'}
          </h2>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
