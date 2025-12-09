import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Beaker, 
  Shield, 
  Award, 
  Users, 
  CheckCircle,
  Phone,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const products = [
    {
      name: "Lemari Asam Prosafeaire",
      subtitle: "Multipurpose Fume Hood",
      description: "Lemari asam berkualitas tinggi dengan sistem ventilasi canggih untuk keamanan laboratorium kimia Anda",
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600",
      features: ["Sistem Exhaust Optimal", "Material Tahan Korosi", "Desain Ergonomis"]
    },
    {
      name: "Laminar Air Flow Prosafeaire",
      subtitle: "Clean Bench System",
      description: "Meja kerja steril dengan aliran udara laminar untuk kemurnian sampel laboratorium maksimal",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600",
      features: ["HEPA Filter Grade H14", "UV Sterilization", "Low Noise Operation"]
    },
    {
      name: "Fume Hood Scrubber Prosafeaire",
      subtitle: "Air Purification System",
      description: "Sistem scrubber handal untuk menyaring udara buangan lemari asam dan menjaga lingkungan",
      image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600",
      features: ["Multi-Stage Filtration", "Chemical Neutralizer", "Eco-Friendly"]
    }
  ];

  const stats = [
    { number: "500+", label: "Proyek Selesai" },
    { number: "15+", label: "Tahun Pengalaman" },
    { number: "200+", label: "Klien Puas" },
    { number: "50+", label: "Kota di Indonesia" }
  ];

  return (
    <div className="overflow-hidden pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.2),transparent_50%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block bg-teal-500/20 text-teal-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                PT. Trisena Rekainova Sinergi
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Furniture <span className="text-teal-400">Laboratorium</span> Berkualitas Tinggi
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Produsen Lemari Asam, Laminar Air Flow, dan Fume Hood Scrubber terpercaya 
                untuk laboratorium modern Indonesia. Memenuhi standar Good Laboratory Practice.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl('Catalog')}>
                  <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-lg px-8 h-14">
                    Lihat Katalog
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a href="https://wa.me/6281298229897" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-white/30 text-white hover:bg-white/10">
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Konsultasi Gratis
                  </Button>
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-teal-500/20 rounded-3xl blur-2xl" />
                <img
                  src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800"
                  alt="Lemari Asam Prosafeaire - Fume Hood Laboratorium"
                  className="relative rounded-2xl shadow-2xl w-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Garansi Produk</p>
                    <p className="text-sm text-gray-500">Hingga 5 Tahun</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-teal-600">{stat.number}</p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-gray-50" itemScope itemType="https://schema.org/ItemList">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-teal-600 font-semibold tracking-wider uppercase text-sm">
              Produk Unggulan
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Furniture Laboratorium Prosafeaire
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solusi lengkap untuk kebutuhan fasilitas dasar laboratorium dengan standar internasional
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.article
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                itemScope
                itemType="https://schema.org/Product"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={`${product.name} - Furniture Laboratorium Berkualitas`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    itemProp="image"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs text-teal-600 font-semibold uppercase tracking-wider">
                    {product.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3" itemProp="name">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4" itemProp="description">
                    {product.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-teal-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link 
                    to={createPageUrl('Catalog')}
                    className="inline-flex items-center text-teal-600 font-semibold hover:gap-3 transition-all"
                  >
                    Lihat Detail
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-teal-600 font-semibold tracking-wider uppercase text-sm">
                Mengapa Memilih Kami
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
                Keahlian dalam Desain & Pembuatan Laboratorium
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                PT. Trisena Rekainova Sinergi hadir sebagai solusi terpercaya untuk kebutuhan 
                furniture laboratorium Anda. Dengan pengalaman bertahun-tahun, kami menghadirkan 
                produk berkualitas tinggi yang memenuhi standar Good Laboratory Practice (GLP).
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Beaker, title: "Kualitas Lab Grade", desc: "Material tahan korosi dan kimia untuk penggunaan jangka panjang" },
                  { icon: Shield, title: "Garansi Produk", desc: "Garansi hingga 5 tahun untuk semua produk Prosafeaire" },
                  { icon: Award, title: "Sertifikasi", desc: "Memenuhi standar keselamatan laboratorium internasional" },
                  { icon: Users, title: "Tim Ahli", desc: "Konsultasi gratis dengan tim engineer berpengalaman" }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800"
                alt="Laminar Air Flow - Laboratorium Modern"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-8 -right-8 bg-teal-600 text-white p-8 rounded-2xl hidden lg:block">
                <p className="text-4xl font-bold">15+</p>
                <p className="text-teal-100">Tahun Pengalaman</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Siap Membangun Laboratorium Impian Anda?
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              Konsultasikan kebutuhan lemari asam, laminar air flow, dan furniture laboratorium 
              lainnya dengan tim ahli kami secara gratis.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={createPageUrl('Catalog')}>
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8 h-14">
                  Lihat Katalog Produk
                </Button>
              </Link>
              <a href="tel:+6281298229897">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 h-14">
                  <Phone className="mr-2 w-5 h-5" />
                  +62 812 9822 9897
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}