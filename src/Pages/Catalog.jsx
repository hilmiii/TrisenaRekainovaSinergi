import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';
import { motion } from 'framer-motion';
import { Search, Filter, Beaker } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Skeleton } from '@/Components/ui/skeleton';
import ProductCard from '@/Components/catalog/ProductCard';
import { Helmet } from 'react-helmet-async';

export default function Catalog() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await base44.get('/products');
      return response.data;
    },
  });

  const categories = [
    { value: 'all', label: 'Semua Produk' },
    { value: 'fume_hood', label: 'Lemari Asam' },
    { value: 'laminar_flow', label: 'Laminar Air Flow' },
    { value: 'scrubber', label: 'Fume Hood Scrubber' },
    { value: 'jasa', label: 'Jasa & Layanan' }, 
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
    {/* --- TAMBAHAN SEO --- */}
    <Helmet>
      <title>Katalog Produk Laboratorium - PT Trisena</title>
      <meta name="description" content="Jelajahi berbagai produk andalan kami seperti Fume Hood Prosafeaire, Laminar Air Flow, dan perlengkapan safety laboratorium lainnya." />
    </Helmet>
      {/* Hero Banner */}
      {/* Hero Banner */}
      <section className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Beaker className="w-4 h-4" />
              Katalog Produk Prosafeaire
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Furniture Laboratorium <span className="text-teal-400">Berkualitas</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Temukan koleksi lengkap Lemari Asam, Laminar Air Flow, Fume Hood Scrubber, 
              dan berbagai furniture laboratorium lainnya dengan standar nasional.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modern Search & Filter */}
      <section className="py-6 bg-white border-b sticky top-[64px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5">
            {/* Search Bar */}
            <div className="relative w-full max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari alat laboratorium (misal: Lemari Asam)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-2xl transition-all shadow-sm w-full"
              />
            </div>
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedCategory === cat.value
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-500/30 -translate-y-0.5'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Tidak ada produk ditemukan</h3>
              <p className="text-slate-500">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}