import { getBrand } from '@/lib/data';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

export default function AboutPage() {
  const brand = getBrand();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <ScrollReveal>
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Tentang {brand.name}</h1>
          <p className="text-muted max-w-2xl mx-auto text-lg">{brand.tagline}</p>
        </div>
      </ScrollReveal>

      {/* Story */}
      <ScrollReveal>
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-surface-dim rounded-2xl border border-border p-8 md:p-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Cerita Kami</h2>
            <p className="text-muted leading-relaxed whitespace-pre-line">{brand.about.story}</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Values */}
      <ScrollReveal>
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Nilai Kami</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
            {brand.about.values.map((value, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl bg-gradient-brand-subtle border border-border hover:border-brand-200 transition-colors"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-2xl">
                  {['✦', '◆', '●', '★'][i % 4]}
                </div>
                <h3 className="font-semibold text-foreground">{value}</h3>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Contact */}
      <ScrollReveal>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Hubungi Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-dim rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3">Instagram</h3>
              <p className="text-brand-600">{brand.contact.ig}</p>
            </div>
            <div className="bg-surface-dim rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3">WhatsApp</h3>
              <p className="text-brand-600">{brand.contact.wa}</p>
            </div>
            <div className="bg-surface-dim rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3">Email</h3>
              <p className="text-brand-600">{brand.contact.email}</p>
            </div>
            <div className="bg-surface-dim rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3">Alamat</h3>
              <p className="text-muted">{brand.contact.address}</p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
