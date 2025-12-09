import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useParams } from 'react-router-dom'; // <--- Perbaikan di sini (tambahkan useParams)
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle, 
  Shield, 
  Truck, 
  Phone,
  MessageCircle,
  Beaker,
  Award,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import ProductCustomizer from '@/components/catalog/ProductCustomizer';

export default function ProductDetail() {
  const { id } = useParams(); // Sekarang ini akan berfungsi

  // Fallback jika ID tidak ada (misal diakses via query string lama)
  const queryParams = new URLSearchParams(window.location.search);
  const productId = id || queryParams.get('id');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      // Pastikan filter menggunakan ID yang benar
      const products = await base44.entities.Product.filter({ id: productId });
      return products[0];
    },
    enabled: !!productId
  });

  const handleAddToCart = (cartItem) => {
    window.dispatchEvent(new CustomEvent('addToCart', { detail: cartItem }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produk tidak ditemukan</h1>
          <Link to={createPageUrl('Catalog')}>
            <Button>Kembali ke Katalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20" itemScope itemType="https://schema.org/Product">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to={createPageUrl('Home')} className="text-gray-500 hover:text-teal-600">
              Beranda
            </Link>
            <span className="text-gray-300">/</span>
            <Link to={createPageUrl('Catalog')} className="text-gray-500 hover:text-teal-600">
              Katalog
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              <img
                src={product.image_url}
                alt={`${product.name} - Furniture Laboratorium Prosafeaire`}
                className="w-full h-full object-cover"
                itemProp="image"
              />
              <Badge className="absolute top-4 left-4 bg-teal-600">
                Prosafeaire
              </Badge>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Shield, label: "Garansi 5 Tahun" },
                { icon: Truck, label: "Pengiriman Aman" },
                { icon: Award, label: "Lab Grade Quality" }
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <item.icon className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info & Customizer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">
                {product.category?.replace(/_/g, ' ')}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2" itemProp="name">
                {product.name}
              </h1>
            </div>

            <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <span className="text-sm text-gray-500">Harga mulai dari</span>
              <p className="text-3xl font-bold text-teal-600" itemProp="price">
                Rp {product.base_price?.toLocaleString('id-ID')}
              </p>
              <meta itemProp="priceCurrency" content="IDR" />
              <span className="text-sm text-gray-500">* Harga dapat bervariasi sesuai spesifikasi</span>
            </div>

            <div className="prose prose-sm max-w-none" itemProp="description">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Fitur Utama:</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Customizer */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Beaker className="w-5 h-5 text-teal-600" />
                Konfigurasi Produk
              </h3>
              <ProductCustomizer product={product} onAddToCart={handleAddToCart} />
            </div>

            {/* WhatsApp Contact */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Butuh Konsultasi?
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Hubungi tim kami untuk konsultasi gratis tentang spesifikasi {product.name} 
                    yang sesuai dengan kebutuhan laboratorium Anda.
                  </p>
                  <a
                    href={`https://wa.me/6281298229897?text=Halo,%20saya%20tertarik%20dengan%20${encodeURIComponent(product.name)}.%20Bisa%20dibantu%20untuk%20konsultasi?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +62 812 9822 9897
                  </a>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="w-5 h-5 text-teal-500" />
              <span>Estimasi pengerjaan 2-4 minggu (tergantung spesifikasi)</span>
            </div>
          </motion.div>
        </div>

        {/* Back Button */}
        <div className="mt-12">
          <Link to={createPageUrl('Catalog')}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Katalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}