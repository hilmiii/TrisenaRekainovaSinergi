import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, Shield, Truck, Phone,
  MessageCircle, Beaker, Award, Clock, ImageOff
} from 'lucide-react';

import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/Components/ui/button';
import { Skeleton } from '@/Components/ui/skeleton';
import { Badge } from '@/Components/ui/badge';
import ProductCustomizer from '@/Components/catalog/ProductCustomizer';
import { Helmet } from 'react-helmet-async';

export default function ProductDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  
  const productId = id || searchParams.get('id');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await base44.get(`/products/${productId}`);
      return response.data;
    },
    enabled: !!productId,
    retry: false 
  });

  const handleAddToCart = (cartItem) => {
    window.dispatchEvent(new CustomEvent('addToCart', { detail: cartItem }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <Helmet>
        <title>Memuat Produk... | PT Trisena</title>
        <meta name="description" content="Sedang memuat detail produk dari PT Trisena Rekainova Sinergi." />
      </Helmet>
      {/* ---------------------------- */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4 rounded-md" />
              <Skeleton className="h-6 w-1/2 rounded-md" />
              <Skeleton className="h-32 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <Helmet>
          <title>Produk Tidak Ditemukan | PT Trisena</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="text-center bg-white p-12 rounded-3xl border border-gray-200 shadow-sm max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Beaker className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-8">Produk yang Anda cari mungkin telah dihapus atau URL tidak valid.</p>
          <Link to={createPageUrl('Catalog')}>
            <Button className="w-full h-12 text-lg bg-teal-600 hover:bg-teal-700 rounded-xl">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali ke Katalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedImageUrl = product.image_url?.replace('/src/assets', '') || '';
  
  // Deteksi kategori jasa
  const isService = product.category === 'jasa';

  return (
    <div className="min-h-screen bg-gray-50 pt-20" itemScope itemType="https://schema.org/Product">
      
      <Helmet>
        <title>{product.name} - Spesifikasi & Harga | PT Trisena</title>
        <meta name="description" content={product.short_description || `Beli ${product.name} kualitas terbaik standar ISO di PT Trisena Rekainova Sinergi.`} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.short_description} />
        <meta property="og:image" content={formattedImageUrl} />
      </Helmet>
      {/* ---------------------------- */}

      {/* Breadcrumb */}
      <div className="bg-white border-b shadow-sm sticky top-[64px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to={createPageUrl('Home')} className="text-gray-500 hover:text-teal-600 font-medium transition-colors">Beranda</Link>
            <span className="text-gray-300">/</span>
            <Link to={createPageUrl('Catalog')} className="text-gray-500 hover:text-teal-600 font-medium transition-colors">Katalog</Link>
            <span className="text-gray-300">/</span>
            <span className="text-teal-700 font-semibold truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Product Image Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-xl border border-gray-100 group">
              {formattedImageUrl ? (
                <img
                  src={formattedImageUrl}
                  alt={`${product.name} - PT Trisena Rekainova`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  itemProp="image"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                  <ImageOff className="w-16 h-16 mb-2" />
                  <span className="font-medium">Gambar Tidak Tersedia</span>
                </div>
              )}
              <Badge className="absolute top-6 left-6 bg-teal-600 px-3 py-1 text-sm shadow-md">Prosafeaire</Badge>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Shield, label: isService ? "Profesional" : "Bergaransi" },
                { icon: Truck, label: isService ? "Tepat Waktu" : "Pengiriman Aman" },
                { icon: Award, label: isService ? "Terstandarisasi" : "Lab Grade Quality" }
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 hover:border-teal-200 transition-colors group">
                  <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-100 transition-colors">
                    <item.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div>
              <span className="inline-block bg-teal-50 text-teal-700 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                {product.category?.replace(/_/g, ' ')}
              </span>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight" itemProp="name">
                {product.name}
              </h1>
            </div>

            {!isService && (
              <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <span className="block text-sm font-medium text-gray-500 mb-1">Estimasi Harga Mulai Dari</span>
                <p className="text-4xl font-extrabold text-teal-600 tracking-tight" itemProp="price">
                  {product.base_price 
                    ? new Intl.NumberFormat('id-ID', { 
                        style: 'currency', 
                        currency: 'IDR',
                        maximumFractionDigits: 0
                      }).format(product.base_price)
                    : 'Rp 0'}
                </p>
                <meta itemProp="priceCurrency" content="IDR" />
                <p className="text-sm text-gray-400 mt-2">* Harga final menyesuaikan dengan opsi material & dimensi yang dipilih</p>
              </div>
            )}

            <div className="prose prose-base text-gray-600 leading-relaxed" itemProp="description">
              <p>{product.description}</p>
            </div>

            {/* Features */}
            {product.features?.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-xl">
                  <Award className="w-5 h-5 text-teal-600" /> Keunggulan Fitur
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!isService ? (
              <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-200">
                <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-xl">
                  <Beaker className="w-6 h-6 text-teal-600" />
                  Konfigurasi Pesanan Anda
                </h2>
                <ProductCustomizer product={product} onAddToCart={handleAddToCart} />
              </div>
            ) : (
              <div className="bg-teal-50 rounded-3xl p-8 border border-teal-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Phone className="w-8 h-8 text-teal-600" />
                </div>
                <h2 className="font-bold text-teal-900 mb-3 text-2xl">Konsultasikan Kebutuhan Anda</h2>
                <p className="text-teal-700 mb-8 leading-relaxed">
                  Layanan <b>{product.name}</b> memerlukan analisis mendalam dan pendekatan khusus. Silakan hubungi tim ahli kami untuk mendapatkan survei, konsultasi gratis, dan penawaran yang tepat sasaran.
                </p>
                <a
                  href={`https://wa.me/6281298229897?text=Halo,%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(product.name)}.%20Bisa%20dibantu%20untuk%20informasi%20lebih%20lanjut?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full bg-teal-600 text-white hover:bg-teal-700 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  <Phone className="w-6 h-6" /> Hubungi Kami: 0812-9822-9897
                </a>
              </div>
            )}

            {!isService && (
              <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl p-8 text-white shadow-xl shadow-teal-900/20">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">Butuh Konsultasi Lab?</h2>
                    <p className="text-teal-100 mb-6 leading-relaxed">
                      Tim engineer kami siap membantu Anda menyesuaikan spesifikasi {product.name} agar tepat sasaran dengan standar lab Anda.
                    </p>
                    <a
                      href={`https://wa.me/6281298229897?text=Halo,%20saya%20tertarik%20dengan%20${encodeURIComponent(product.name)}.%20Bisa%20dibantu%20untuk%20konsultasi?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-teal-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                    >
                      <Phone className="w-5 h-5" /> Hubungi via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Info */}
            {!isService && (
              <div className="flex items-center gap-3 text-sm font-medium text-gray-500 bg-gray-100 px-5 py-3 rounded-xl">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>Estimasi perakitan dan pengiriman: 2-4 minggu</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Back Button */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <Link to={createPageUrl('Catalog')}>
            <Button variant="outline" className="gap-2 h-12 px-6 rounded-xl hover:bg-gray-100 border-gray-300">
              <ArrowLeft className="w-5 h-5" />
              Kembali Lihat Katalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}