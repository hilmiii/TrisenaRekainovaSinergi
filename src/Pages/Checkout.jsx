import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '../api/base44Client';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShoppingBag,
  User,
  MapPin,
  Building2,
  FileText,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Button } from '../Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';

export default function Checkout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          // Save current URL for redirect after login
          localStorage.setItem('redirect_after_login', 'Checkout');
          base44.auth.redirectToLogin(window.location.href);
          return;
        }
        const userData = await base44.auth.me();
        setUser(userData);
        
        // Check if user has completed profile
        if (!userData.company || !userData.address || !userData.phone) {
          localStorage.setItem('redirect_after_login', 'Checkout');
          navigate(createPageUrl('CompleteProfile'));
          return;
        }
      } catch (e) {
        localStorage.setItem('redirect_after_login', 'Checkout');
        base44.auth.redirectToLogin(window.location.href);
        return;
      }
      
      // Load cart
      const savedCart = localStorage.getItem('trisena_cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        if (items.length === 0) {
          navigate(createPageUrl('Catalog'));
          return;
        }
        setCartItems(items);
      } else {
        navigate(createPageUrl('Catalog'));
        return;
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + (item.product.base_price * item.quantity);
  }, 0);

  const handleProcessOrder = async () => {
    setIsSubmitting(true);
    
    try {
      // Generate order number
      const orderNum = `TRS-${Date.now().toString(36).toUpperCase()}`;
      
      // Create orders for each cart item
      for (const item of cartItems) {
        await base44.entities.Order.create({
          order_number: orderNum,
          customer_name: user.full_name,
          customer_email: user.email,
          customer_phone: user.phone,
          company: user.company,
          position: user.position,
          address: user.address,
          product_name: item.product.name,
          material: item.material,
          size: item.size,
          color: item.color,
          additional_notes: item.notes,
          quantity: item.quantity,
          total_price: item.product.base_price * item.quantity,
          status: 'Pengajuan'
        });
      }
      
      // Clear cart
      localStorage.removeItem('trisena_cart');
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
      
      setOrderNumber(orderNum);
      setOrderSuccess(true);
    } catch (error) {
      console.error('Error creating order:', error);
    }
    
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h1>
            <p className="text-gray-600 mb-6">
              Nomor Pesanan Anda: <span className="font-bold text-teal-600">{orderNumber}</span>
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-amber-800 mb-2">⚠️ Informasi Penting</h3>
              <p className="text-amber-700 text-sm mb-4">
                Sebelum melakukan pembayaran, kami <strong>sangat menyarankan</strong> untuk 
                berkonsultasi terlebih dahulu dengan tim kami melalui WhatsApp untuk:
              </p>
              <ul className="text-amber-700 text-sm space-y-1 list-disc list-inside mb-4">
                <li>Konfirmasi spesifikasi detail produk</li>
                <li>Mendapatkan penawaran harga final</li>
                <li>Diskusi customisasi tambahan</li>
                <li>Informasi timeline pengerjaan</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Informasi Pembayaran</h3>
              <div className="text-left space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Bank Transfer</p>
                  <p className="font-semibold">Bank BCA</p>
                  <p className="font-mono text-lg">123-456-7890</p>
                  <p className="text-sm text-gray-600">a.n. PT. Trisena Rekainova Sinergi</p>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-500">Estimasi Total</p>
                  <p className="text-2xl font-bold text-teal-600">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-500">* Harga final akan dikonfirmasi setelah konsultasi</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/6281298229897?text=Halo,%20saya%20baru%20saja%20membuat%20pesanan%20dengan%20nomor%20${orderNumber}.%20Saya%20ingin%20berkonsultasi%20lebih%20lanjut.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-green-500 hover:bg-green-600 w-full sm:w-auto">
                  Konsultasi via WhatsApp
                </Button>
              </a>
              <Link to={createPageUrl('Home')}>
                <Button variant="outline" className="w-full sm:w-auto">
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={createPageUrl('Catalog')} className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Katalog
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout Pesanan</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customer Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  Informasi Pemesan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nama Lengkap</p>
                    <p className="font-medium">{user?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">No. Telepon</p>
                    <p className="font-medium">{user?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Jabatan</p>
                    <p className="font-medium">{user?.position}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  Informasi Perusahaan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Perusahaan</p>
                  <p className="font-medium">{user?.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Alamat Pengiriman</p>
                  <p className="font-medium">{user?.address}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-teal-600" />
                  Detail Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                        <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                          <p>Material: {item.material}</p>
                          <p>Ukuran: {item.size}</p>
                          <p>Warna: {item.color}</p>
                          <p>Jumlah: {item.quantity} unit</p>
                        </div>
                        {item.notes && (
                          <p className="text-sm text-gray-500 mt-2 bg-white p-2 rounded">
                            <FileText className="w-3 h-3 inline mr-1" />
                            {item.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-teal-600">
                          Rp {(item.product.base_price * item.quantity).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-28">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        Rp {(item.product.base_price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimasi Total</span>
                    <span className="text-2xl font-bold text-teal-600">
                      Rp {totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    * Harga final akan dikonfirmasi setelah konsultasi
                  </p>
                </div>

                <Button
                  onClick={handleProcessOrder}
                  disabled={isSubmitting}
                  className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Proses Pesanan'
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Dengan menekan tombol di atas, Anda menyetujui syarat dan ketentuan
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}