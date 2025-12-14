import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Beaker, MapPin, Phone, Mail, MessageCircle, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white" itemScope itemType="https://schema.org/Organization">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center">
                <Beaker className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold" itemProp="name">PT. Trisena Rekainova Sinergi</h3>
                <p className="text-sm text-gray-400">Inspiring Solutions for Innovative Laboratories</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed" itemProp="description">
              Kami adalah produsen furniture laboratorium berkualitas tinggi. 
              Produk unggulan kami meliputi Lemari Asam Prosafeaire, Laminar Air Flow Prosafeaire, 
              dan Fume Hood Scrubber Prosafeaire untuk memenuhi standar Good Laboratory Practice.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-cyan-600 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-cyan-600 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-cyan-600 rounded-full flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Produk Laboratorium</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to={createPageUrl('Catalog')} className="hover:text-cyan-400 transition-colors">
                  Lemari Asam Prosafeaire
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Catalog')} className="hover:text-cyan-400 transition-colors">
                  Laminar Air Flow Prosafeaire
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Catalog')} className="hover:text-cyan-400 transition-colors">
                  Fume Hood Scrubber Prosafeaire
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Catalog')} className="hover:text-cyan-400 transition-colors">
                  Furnitur Lab Prosafeaire
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Catalog')} className="hover:text-cyan-400 transition-colors">
                  Meja Laboratorium
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Hubungi Kami</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span itemProp="streetAddress">
                  Jalan Raya Tapos No. 57, Tapos<br />
                  Kota Depok, Jawa Barat, Indonesia
                </span>
              </li>
              <li>
                <a href="tel:+6281298229897" className="flex items-center gap-3 hover:text-cyan-400 transition-colors">
                  <Phone className="w-5 h-5 text-cyan-400" />
                  <span itemProp="telephone">+62 812 9822 9897</span>
                </a>
              </li>
              <li>
                <a href="mailto:marketing@lemari-asam.id" className="flex items-center gap-3 hover:text-cyan-400 transition-colors">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  <span itemProp="email">marketing@lemari-asam.id</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/6281298229897" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-cyan-400 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-cyan-400" />
                  WhatsApp: +62 812 9822 9897
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} PT. Trisena Rekainova Sinergi. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <span>Lemari Asam</span>
              <span>Laminar Air Flow</span>
              <span>Fume Hood Scrubber</span>
              <span>Furniture Laboratorium</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}