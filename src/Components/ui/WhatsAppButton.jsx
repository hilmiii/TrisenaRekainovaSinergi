import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({ floating = false }) {
  const waNumber = "6281298229897";
  const waLink = `https://wa.me/${waNumber}?text=Halo,%20saya%20tertarik%20dengan%20produk%20furniture%20laboratorium%20Prosafeaire`;
  
  if (floating) {
    return (
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
        aria-label="Chat WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Hubungi Kami
        </span>
      </a>
    );
  }
  
  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
    >
      <MessageCircle className="w-5 h-5" />
      Konsultasi via WhatsApp
    </a>
  );
}