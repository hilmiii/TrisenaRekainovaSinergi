import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  Beaker, 
  Award, 
  Users, 
  Target, 
  CheckCircle, 
  Phone,
  Building2,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function About() {
  const values = [
    {
      icon: Award,
      title: "Kualitas Terjamin",
      description: "Semua produk furniture laboratorium kami menggunakan material berkualitas tinggi dengan standar internasional"
    },
    {
      icon: Lightbulb,
      title: "Inovasi Berkelanjutan",
      description: "Terus mengembangkan teknologi dan desain untuk memenuhi kebutuhan laboratorium modern"
    },
    {
      icon: Users,
      title: "Fokus Pelanggan",
      description: "Memberikan layanan terbaik dan solusi customized sesuai kebutuhan spesifik setiap klien"
    },
    {
      icon: Target,
      title: "Komitmen Keselamatan",
      description: "Memprioritaskan keselamatan operator dan lingkungan dalam setiap produk yang kami buat"
    }
  ];

  const expertise = [
    "Desain Laboratorium - Good Laboratory Practice (GLP)",
    "Lemari Asam Prosafeaire Multipurpose Fume Hood",
    "Laminar Air Flow Prosafeaire Clean Bench",
    "Fume Hood Scrubber Prosafeaire",
    "Furnitur Laboratorium Prosafeaire FurniLab",
    "Meja Laboratorium dengan Material Tahan Korosi",
    "Kabinet Penyimpanan Bahan Kimia",
    "Relokasi Laboratorium TRS LabMover",
    "Perawatan Rutin Laboratorium TRS LabCare"
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block bg-teal-500/20 text-teal-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Tentang Kami
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              PT. Trisena Rekainova Sinergi
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Inspiring Solutions for Innovative Laboratories - Produsen furniture laboratorium 
              terpercaya di Indonesia sejak 2008
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Description */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Solusi Terpercaya untuk Laboratorium Modern
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  PT. Trisena Rekainova Sinergi adalah perusahaan yang bergerak di bidang 
                  pembuatan furniture laboratorium berkualitas tinggi. Dengan merek dagang 
                  <strong> Prosafeaire</strong>, kami telah melayani ratusan laboratorium 
                  di seluruh Indonesia.
                </p>
                <p>
                  Produk unggulan kami meliputi <strong>Lemari Asam (Fume Hood)</strong>, 
                  <strong> Laminar Air Flow</strong>, dan <strong>Fume Hood Scrubber</strong> 
                  yang dirancang untuk memenuhi standar Good Laboratory Practice (GLP) 
                  internasional.
                </p>
                <p>
                  Kami tidak hanya memproduksi furniture laboratorium, tetapi juga menyediakan 
                  layanan desain laboratorium, relokasi laboratorium, dan perawatan rutin 
                  untuk memastikan laboratorium Anda selalu dalam kondisi optimal.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-teal-50 rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-teal-600">500+</p>
                <p className="text-gray-600 mt-2">Proyek Selesai</p>
              </div>
              <div className="bg-teal-50 rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-teal-600">15+</p>
                <p className="text-gray-600 mt-2">Tahun Pengalaman</p>
              </div>
              <div className="bg-teal-50 rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-teal-600">200+</p>
                <p className="text-gray-600 mt-2">Klien Puas</p>
              </div>
              <div className="bg-teal-50 rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-teal-600">50+</p>
                <p className="text-gray-600 mt-2">Kota di Indonesia</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-teal-600 font-semibold tracking-wider uppercase text-sm">
              Keahlian Kami
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">
              Produk & Layanan Laboratorium
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {expertise.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm"
              >
                <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-teal-600 font-semibold tracking-wider uppercase text-sm">
              Nilai-Nilai Kami
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">
              Komitmen Terhadap Kualitas
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Mari Wujudkan Laboratorium Impian Anda
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              Konsultasikan kebutuhan lemari asam, laminar air flow, dan furniture 
              laboratorium lainnya dengan tim ahli kami.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={createPageUrl('Catalog')}>
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                  Lihat Katalog Produk
                </Button>
              </Link>
              <Link to={createPageUrl('Contact')}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Phone className="w-5 h-5 mr-2" />
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}