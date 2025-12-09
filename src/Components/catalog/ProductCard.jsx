import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { ArrowRight, Beaker, Shield, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
      itemScope
      itemType="https://schema.org/Product"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.image_url}
          alt={`${product.name} - Furniture Laboratorium Berkualitas`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          itemProp="image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4">
          <span className="bg-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            Prosafeaire
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 
          className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors"
          itemProp="name"
        >
          {product.name}
        </h3>
        <p 
          className="text-gray-600 text-sm mb-4 line-clamp-2"
          itemProp="description"
        >
          {product.short_description}
        </p>
        
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Beaker className="w-3.5 h-3.5 text-teal-500" />
            Lab Grade
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-teal-500" />
            Garansi
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-teal-500" />
            Sertifikat
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <span className="text-xs text-gray-500">Mulai dari</span>
            <p className="text-lg font-bold text-teal-600" itemProp="price">
              Rp {product.base_price?.toLocaleString('id-ID')}
            </p>
            <meta itemProp="priceCurrency" content="IDR" />
          </div>
          <Link
            to={`/product/${product.id}`} // Langsung ke URL dinamis
            className="flex items-center gap-2 text-teal-600 font-semibold hover:gap-3 transition-all"
          >
            Lihat Detail
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}