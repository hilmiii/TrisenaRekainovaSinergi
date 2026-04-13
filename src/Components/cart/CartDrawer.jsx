import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/Components/ui/sheet';
import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
// Tambahkan ImageOff di import lucide-react
import { Trash2, ShoppingBag, ArrowRight, ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fungsi bantuan agar format Rupiah seragam dan rapi
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number || 0);
};

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity }) {
  const totalPrice = cartItems.reduce((sum, item) => {
    const priceToUse = item.unit_price || item.product.base_price || 0;
    return sum + (priceToUse * item.quantity);
  }, 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="w-5 h-5 text-teal-600" />
            Keranjang Pesanan
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Keranjang Kosong
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Pilih furniture laboratorium Prosafeaire untuk kebutuhan lab Anda
            </p>
            <Button onClick={onClose} variant="outline">
              Lihat Katalog
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <AnimatePresence>
                {cartItems.map((item, index) => {
                  const currentPrice = item.unit_price || item.product.base_price || 0;
                  
                  // PERBAIKAN GAMBAR: Bersihkan URL dari /src/assets
                  const imgUrl = item.product.image_url?.replace('/src/assets', '') || '';

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="py-4 border-b border-gray-100"
                    >
                      <div className="flex gap-4">
                        {/* Render Gambar atau Fallback */}
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg bg-gray-50 border border-gray-100"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                            <ImageOff className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-medium">No Image</span>
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {item.product.name}
                          </h4>
                          <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                            <p>Material: {item.material}</p>
                            <p>Ukuran: {item.size}</p>
                            <p>Warna: {item.color}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                                className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                              >
                                -
                              </button>
                              <span className="text-sm font-medium w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                                className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => onRemoveItem(index)}
                              className="text-red-500 hover:text-red-600 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-teal-600">
                            {formatRupiah(currentPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                          Catatan: {item.notes}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimasi Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                * Harga final akan dikonfirmasi setelah konsultasi dengan tim kami
              </p>
              <Link to={createPageUrl('Checkout')} onClick={onClose} className="block">
                <Button className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-lg font-semibold">
                  Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}