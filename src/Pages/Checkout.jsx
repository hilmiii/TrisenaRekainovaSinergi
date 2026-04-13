import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
// PERBAIKAN: Menambahkan icon CreditCard
import { ArrowLeft, ShoppingBag, User, Building2, FileText, CheckCircle, Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

// Helper format Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number || 0);
};

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
      let currentUser = null;

      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          localStorage.setItem('redirect_after_login', 'Checkout');
          navigate(createPageUrl('Login') || '/login');
          return;
        }

        const response = await base44.get('/user');
        currentUser = response.data;
        setUser(currentUser);
      } catch (e) {
        localStorage.removeItem('auth_token');
        localStorage.setItem('redirect_after_login', 'Checkout');
        navigate(createPageUrl('Login') || '/login');
        return;
      }
      
      const cartKey = currentUser ? `trisena_cart_${currentUser.id}` : 'trisena_cart_guest';
      const savedCart = localStorage.getItem(cartKey);
      
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
    const priceToUse = item.unit_price || item.product.base_price || 0;
    return sum + (priceToUse * item.quantity);
  }, 0);

  const handleProcessOrder = async () => {
    setIsSubmitting(true);
    
    try {
      const orderNum = `TRS-${Date.now().toString(36).toUpperCase()}`;
      
      const formattedItems = cartItems.map(item => {
        const exactPrice = item.unit_price || item.product.base_price || 0;
        return {
          product_name: item.product.name,
          material: item.material,
          size: item.size,
          color: item.color,
          additional_notes: item.notes,
          quantity: item.quantity,
          total_price: exactPrice * item.quantity 
        };
      });

      await base44.post('/orders', {
        order_number: orderNum,
        customer_name: user?.name || user?.full_name || 'Customer',
        customer_email: user?.email || '',
        customer_phone: user?.phone || '-',
        company: user?.company || '-',
        position: user?.position || '-',
        address: user?.address || '-',
        items: formattedItems 
      });
      
      const cartKey = user ? `trisena_cart_${user.id}` : 'trisena_cart_guest';
      localStorage.removeItem(cartKey);
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
      
      setOrderNumber(orderNum);
      setOrderSuccess(true);
    } catch (error) {
      alert('Terjadi kesalahan saat memproses pesanan Anda. Pastikan API terhubung.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  // --- LAYAR SUKSES CHECKOUT ---
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl p-8 text-center mt-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h1>
            <p className="text-gray-600 mb-6">
              Nomor Pesanan Anda: <span className="font-bold text-teal-600">{orderNumber}</span>
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-semibold text-amber-800 mb-2">⚠️ Langkah Selanjutnya</h3>
              <p className="text-amber-700 text-sm mb-4">Sebelum melakukan pembayaran, Anda <strong>wajib</strong> mengonfirmasi pesanan ini kepada tim kami melalui WhatsApp untuk:</p>
              <ul className="text-amber-700 text-sm space-y-1 list-disc list-inside mb-4">
                <li>Konfirmasi spesifikasi detail produk</li>
                <li>Mendapatkan konfirmasi harga final (termasuk ongkir & instalasi)</li>
                <li>Informasi timeline pengerjaan</li>
              </ul>
            </div>

            {/* --- KOTAK INFO PEMBAYARAN BARU --- */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Informasi Pembayaran
              </h3>
              <p className="text-blue-800 text-sm mb-4">
                Setelah berkonsultasi dan menyetujui harga final, pembayaran <b>Uang Muka (DP) sebesar 50%</b> dapat ditransfer ke rekening resmi kami:
              </p>
              <div className="bg-white p-5 rounded-lg border border-blue-200 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bank BCA (KCP Mayor Oking)</p>
                  <p className="text-2xl sm:text-3xl font-mono font-black text-gray-900 tracking-widest mb-1">683 126 3790</p>
                  <p className="text-sm font-bold text-teal-700">a.n PT TRISENA REKAINOVA SINERGI</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Informasi Estimasi</h3>
              <div className="text-left space-y-3">
                <div className="border-t pt-3 flex justify-between items-center">
                  <p className="text-sm text-gray-500">Estimasi Total Awal</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {formatRupiah(totalPrice)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 text-right">* Belum termasuk biaya pengiriman / instalasi tambahan</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`https://wa.me/6281298229897?text=Halo,%20saya%20baru%20saja%20membuat%20pesanan%20dengan%20nomor%20${orderNumber}.%20Saya%20ingin%20mengonfirmasi%20pesanan%20saya.`} target="_blank" rel="noopener noreferrer">
                <Button className="bg-green-500 hover:bg-green-600 w-full sm:w-auto">Konfirmasi via WhatsApp</Button>
              </a>
              <Link to={createPageUrl('Home')}>
                <Button variant="outline" className="w-full sm:w-auto">Kembali ke Beranda</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- LAYAR FORM CHECKOUT ---
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={createPageUrl('Catalog')} className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-8">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout Pesanan</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-teal-600" /> Informasi Akun</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-500">Nama Lengkap</p><p className="font-medium">{user?.name || user?.full_name || '-'}</p></div>
                  <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{user?.email || '-'}</p></div>
                  <div><p className="text-sm text-gray-500">No. Telepon</p><p className="font-medium">{user?.phone || '-'}</p></div>
                  <div><p className="text-sm text-gray-500">Jabatan</p><p className="font-medium">{user?.position || '-'}</p></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5 text-teal-600" /> Informasi Perusahaan & Pengiriman</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><p className="text-sm text-gray-500">Perusahaan</p><p className="font-medium">{user?.company || '-'}</p></div>
                <div><p className="text-sm text-gray-500">Alamat Pengiriman</p><p className="font-medium">{user?.address || '-'}</p></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-teal-600" /> Detail Pesanan</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item, index) => {
                    const imgUrl = item.product.image_url?.replace('/src/assets', '') || '';
                    const currentPrice = item.unit_price || item.product.base_price || 0; 
                    return (
                      <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        {imgUrl ? <img src={imgUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" /> : <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">No Image</div>}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                          <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                            <p>Material: {item.material}</p>
                            <p>Ukuran: {item.size}</p>
                            <p>Warna: {item.color}</p>
                            <p>Jumlah: <span className="font-semibold">{item.quantity} unit</span></p>
                          </div>
                          {item.notes && <p className="text-sm text-gray-500 mt-2 bg-white p-2 rounded border border-gray-100"><FileText className="w-3 h-3 inline mr-1" /> {item.notes}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-teal-600">
                            {formatRupiah(currentPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-28 shadow-lg shadow-teal-900/5">
              <CardHeader><CardTitle>Ringkasan Pesanan</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item, index) => {
                     const currentPrice = item.unit_price || item.product.base_price || 0; 
                     return (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600 pr-4">{item.product.name} x{item.quantity}</span>
                        <span className="font-medium whitespace-nowrap">
                          {formatRupiah(currentPrice * item.quantity)}
                        </span>
                      </div>
                     );
                  })}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-600 font-medium">Estimasi Total</span>
                    <span className="text-2xl font-extrabold text-teal-600">
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-right">* Harga final akan dikonfirmasi</p>
                </div>

                {(!user?.phone || !user?.company || !user?.address) ? (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-red-600 font-medium mb-3">Lengkapi Profil Anda (No. Telp, Instansi, Alamat) untuk melanjutkan pesanan.</p>
                    <Link to={createPageUrl('Profile')}><Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-100">Lengkapi Profil Sekarang</Button></Link>
                  </div>
                ) : (
                  <>
                    <Button onClick={handleProcessOrder} disabled={isSubmitting} className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-lg font-bold rounded-xl mt-4 transition-all hover:shadow-lg hover:shadow-teal-600/20">
                      {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Memproses...</> : 'Proses Pesanan Sekarang'}
                    </Button>
                    <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">Dengan menekan tombol di atas, data pesanan Anda akan dikirimkan ke tim PT. Trisena Rekainova Sinergi.</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}