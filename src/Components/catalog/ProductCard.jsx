import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Beaker, Shield, Award, ImageOff } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper Format Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number || 0);
};

export default function ProductCard({ product, index }) {
  const formattedImageUrl = product.image_url?.replace('/src/assets', '') || '';
  const [imgError, setImgError] = useState(false);
  
  // Deteksi apakah ini produk fisik atau jasa
  const isService = product.category === 'jasa';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 border border-slate-200 flex flex-col h-full"
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-slate-100">
        {!imgError ? (
          <img
            src={formattedImageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <ImageOff className="w-10 h-10" />
            <span className="text-xs font-medium">Gambar Tidak Tersedia</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4">
          <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            Prosafeaire
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-grow">
          {product.short_description || product.description}
        </p>
        
        {/* Label keunggulan (Bisa disesuaikan jika jasa) */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            <Beaker className="w-3.5 h-3.5 text-teal-500" /> {isService ? 'Profesional' : 'Lab Grade'}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            <Shield className="w-3.5 h-3.5 text-teal-500" /> {isService ? 'Terpercaya' : 'Garansi'}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            <Award className="w-3.5 h-3.5 text-teal-500" /> Tersertifikasi
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
          <div>
            <span className="block text-xs font-medium text-slate-400 mb-0.5">
              {isService ? 'Sistem Harga' : 'Estimasi Harga'}
            </span>
            <p className={`font-extrabold ${isService ? 'text-teal-600 text-sm mt-1' : 'text-teal-600 text-lg'}`}>
              {isService ? 'Berdasarkan Konsultasi' : formatRupiah(product.base_price)}
            </p>
          </div>
          <Link
            to={`/product/${product.slug || product.id}`}
            className="flex items-center gap-2 bg-teal-50 hover:bg-teal-600 text-teal-600 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group/btn"
          >
            Detail
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}