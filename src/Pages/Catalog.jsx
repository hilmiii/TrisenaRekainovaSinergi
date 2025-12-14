import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';
import { motion } from 'framer-motion';
import { Search, Filter, Beaker } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Skeleton } from '@/Components/ui/skeleton';
import ProductCard from '@/Components/catalog/ProductCard';

export default function Catalog() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  const categories = [
    { value: 'all', label: 'Semua Produk' },
    { value: 'fume_hood', label: 'Lemari Asam' },
    { value: 'laminar_flow', label: 'Laminar Air Flow' },
    { value: 'scrubber', label: 'Fume Hood Scrubber' },
    { value: 'furniture', label: 'Furnitur Lab' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Beaker className="w-4 h-4" />
              Katalog Produk Prosafeaire
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Furniture Laboratorium <span className="text-teal-400">Berkualitas</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Temukan koleksi lengkap Lemari Asam, Laminar Air Flow, Fume Hood Scrubber, 
              dan berbagai furniture laboratorium lainnya dengan standar internasional.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-white border-b sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari lemari asam, laminar air flow..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 border-gray-200"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-[4/3]" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Tidak ada produk ditemukan
              </h3>
              <p className="text-gray-500">
                Coba ubah kata kunci pencarian atau filter kategori
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Furniture Laboratorium Prosafeaire - Solusi Lengkap untuk Lab Modern
            </h2>
            <p className="text-gray-600 mb-4">
              PT. Trisena Rekainova Sinergi menyediakan berbagai jenis furniture laboratorium 
              berkualitas tinggi dengan merek Prosafeaire. Produk kami meliputi:
            </p>
            <ul className="text-gray-600 space-y-2 mb-4">
              <li>
                <strong>Lemari Asam Prosafeaire (Fume Hood)</strong> - Lemari asam multipurpose 
                dengan sistem ventilasi canggih untuk menjaga keamanan operator laboratorium
              </li>
              <li>
                <strong>Laminar Air Flow Prosafeaire</strong> - Meja kerja steril dengan 
                aliran udara laminar dan filter HEPA untuk kemurnian sampel maksimal
              </li>
              <li>
                <strong>Fume Hood Scrubber Prosafeaire</strong> - Sistem penyaring udara 
                buangan lemari asam untuk menjaga kualitas udara lingkungan
              </li>
            </ul>
            <p className="text-gray-600">
              Semua produk furniture laboratorium kami dirancang untuk memenuhi standar 
              Good Laboratory Practice (GLP) dan dilengkapi dengan garansi serta layanan 
              purna jual terbaik.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}