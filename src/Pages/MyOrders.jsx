import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Package, CheckCircle, Truck, XCircle, Loader2, ArrowLeft, RefreshCw, DollarSign, ShoppingBag, FileText, Printer } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number || 0);
};

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('aktif');
  const [invoiceData, setInvoiceData] = useState(null);

  const fetchMyOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return navigate(createPageUrl('Login') || '/login');

      const response = await base44.get('/my-orders');
      
      const grouped = response.data.reduce((acc, order) => {
        if (!acc[order.order_number]) {
          acc[order.order_number] = { ...order, total_amount: 0, items: [] };
        }
        acc[order.order_number].items.push(order);
        acc[order.order_number].total_amount += parseFloat(order.total_price);
        return acc;
      }, {});

      setOrders(Object.values(grouped).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMyOrders(); }, [navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Penawaran': return <span className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><DollarSign className="w-3 h-3"/> Penawaran</span>;
      case 'Pre-Order': return <span className="bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><ShoppingBag className="w-3 h-3"/> Pre-Order</span>;
      case 'Proses': return <span className="bg-orange-100 text-orange-800 border border-orange-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><RefreshCw className="w-3 h-3"/> Diproses</span>;
      case 'Dikirim': return <span className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Truck className="w-3 h-3"/> Dikirim</span>;
      case 'Selesai': return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/> Selesai</span>;
      case 'Cancel': return <span className="bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> Dibatalkan</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(group => {
    return activeTab === 'aktif' 
      ? !['Selesai', 'Cancel'].includes(group.status) 
      : ['Selesai', 'Cancel'].includes(group.status);
  });

  if (isLoading) return <div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-2">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="w-8 h-8 text-teal-600" />
              Pesanan Saya
            </h1>
          </div>
          <Button onClick={fetchMyOrders} variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" /> Segarkan</Button>
        </div>

        <div className="flex gap-6 mb-8 border-b border-gray-200">
          <button onClick={() => setActiveTab('aktif')} className={`pb-3 font-semibold transition-colors border-b-2 ${activeTab === 'aktif' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500'}`}>
            Sedang Berjalan
          </button>
          <button onClick={() => setActiveTab('riwayat')} className={`pb-3 font-semibold transition-colors border-b-2 ${activeTab === 'riwayat' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500'}`}>
            Riwayat Pembelian
          </button>
        </div>

        {filteredOrders.length === 0 ? (
          <Card className="text-center py-16 bg-white/50 border-dashed">
            <CardContent>
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada pesanan</h3>
              <p className="text-gray-500 mb-6">Anda belum memiliki pesanan di daftar ini.</p>
              {activeTab === 'aktif' && (
                <Link to={createPageUrl('Catalog')}><Button className="bg-teal-600 hover:bg-teal-700">Mulai Belanja</Button></Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((group) => (
              <Card key={group.order_number} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-white border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Nomor Pesanan</p>
                    <p className="text-lg font-bold text-teal-700">{group.order_number}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(group.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'})}
                    </p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-3">
                    {getStatusBadge(group.status)}
                    
                    {group.status === 'Selesai' ? (
                      <Button size="sm" variant="outline" onClick={() => setInvoiceData(group)} className="text-teal-700 border-teal-200 hover:bg-teal-50 mt-1">
                        <FileText className="w-4 h-4 mr-2" /> Lihat Invoice
                      </Button>
                    ) : (
                      <a href={`https://wa.me/6281298229897?text=Halo,%20saya%20ingin%20bertanya%20mengenai%20pesanan%20saya%20nomor%20${group.order_number}`} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:text-teal-800 font-medium underline underline-offset-2">
                        Hubungi Admin
                      </a>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-0 bg-gray-50/30">
                  <div className="divide-y divide-gray-100">
                    {group.items.map((item, idx) => (
                      <div key={idx} className="p-6 flex flex-col gap-4 border-b last:border-b-0">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-base">{item.product_name}</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                              <p>Material: <span className="font-medium text-gray-900">{item.material}</span></p>
                              <p>Ukuran: <span className="font-medium text-gray-900">{item.size}</span></p>
                              <p>Jumlah: <span className="font-medium text-gray-900">{item.quantity} unit</span></p>
                            </div>
                          </div>
                          
                          <div className="sm:text-right flex flex-col justify-center">
                            <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                            <p className="font-bold text-gray-900">{formatRupiah(item.total_price)}</p>
                          </div>
                        </div>

                        {item.tracking_number && group.status === 'Dikirim' && (
                          <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 mt-2 flex items-center justify-between">
                            <div>
                              <p className="text-xs text-teal-600 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Truck className="w-3 h-3" /> Informasi Pengiriman
                              </p>
                              <p className="text-gray-800 text-sm">Dikirim menggunakan <span className="font-bold">{item.courier}</span></p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 mb-1">Nomor Resi</p>
                              <p className="text-lg font-mono font-bold text-gray-900 tracking-widest">{item.tracking_number}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-white p-6 border-t flex justify-between items-center shadow-sm">
                    <span className="font-semibold text-gray-700">Total Pembayaran</span>
                    <span className="text-xl font-extrabold text-teal-700">
                      {formatRupiah(group.total_amount)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!invoiceData} onOpenChange={() => setInvoiceData(null)}>
        {/* KELAS AJAIB TAILWIND KHUSUS PRINT */}
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-50 border-0 p-0 sm:p-6 print:static print:translate-x-0 print:translate-y-0 print:w-full print:max-w-full print:h-auto print:max-h-none print:overflow-visible print:border-none print:shadow-none print:bg-white print:p-0">
          <DialogHeader className="hidden print:hidden"><DialogTitle>Invoice</DialogTitle></DialogHeader>
          {invoiceData && (
            <div className="bg-white p-8 md:p-12 shadow-sm rounded-xl">
              <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-gray-200 pb-8 mb-8">
                <div>
                  <h1 className="text-4xl font-black text-teal-800 tracking-tight mb-2">INVOICE</h1>
                  <p className="text-gray-500 font-medium">No. Faktur: <span className="text-gray-900">{invoiceData.order_number}</span></p>
                  <p className="text-gray-500 font-medium">Tanggal: <span className="text-gray-900">{new Date(invoiceData.created_at).toLocaleDateString('id-ID')}</span></p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold border border-emerald-200">
                    <CheckCircle className="w-4 h-4" /> LUNAS & SELESAI
                  </div>
                </div>
                <div className="text-left md:text-right mt-6 md:mt-0">
                  <img src="/img/logo.png" alt="PT. Trisena Rekainova Sinergi" className="h-10 w-auto md:ml-auto mb-2" />
                  <h3 className="font-bold text-gray-900 text-lg">PT. Trisena Rekainova Sinergi</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-[250px] ml-auto">Jl. Raya Tapos No. 57, Tapos, Kota Depok, Jawa Barat 16457</p>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ditagihkan Kepada:</h4>
                <p className="text-lg font-bold text-gray-900">{invoiceData.customer_name}</p>
                <p className="text-gray-600 font-medium">{invoiceData.company}</p>
                <p className="text-sm text-gray-500 mt-1 max-w-sm">{invoiceData.address}</p>
                <p className="text-sm text-gray-500">{invoiceData.customer_phone} | {invoiceData.customer_email}</p>
              </div>

              <div className="overflow-x-auto mb-8 border rounded-xl">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-bold text-gray-900">Deskripsi Barang/Jasa</TableHead>
                      <TableHead className="text-center font-bold text-gray-900">Qty</TableHead>
                      <TableHead className="text-right font-bold text-gray-900">Harga Satuan</TableHead>
                      <TableHead className="text-right font-bold text-gray-900">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceData.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <p className="font-bold text-gray-900">{item.product_name}</p>
                          <p className="text-xs text-gray-500">{item.material} | {item.size}</p>
                        </TableCell>
                        <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                        <TableCell className="text-right text-gray-600">{formatRupiah(item.total_price / item.quantity)}</TableCell>
                        <TableCell className="text-right font-bold text-gray-900">{formatRupiah(item.total_price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <div className="w-full md:w-1/2 bg-gray-50 rounded-xl p-6 print:bg-transparent print:border print:border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatRupiah(invoiceData.total_amount || invoiceData.grand_total)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
                    <span className="text-lg font-bold text-gray-900">GRAND TOTAL</span>
                    <span className="text-2xl font-black text-teal-700">{formatRupiah(invoiceData.total_amount || invoiceData.grand_total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center text-gray-400 text-sm border-t pt-6">
                <p>Terima kasih atas kepercayaan Anda bermitra dengan PT. Trisena Rekainova Sinergi.</p>
                <p className="mt-1">Dokumen ini adalah bukti pembayaran digital yang sah.</p>
              </div>
            </div>
          )}
          {/* SEMBUNYIKAN TOMBOL KETIKA MENCETAK */}
          <DialogFooter className="mt-4 px-6 sm:px-0 print:hidden">
            <Button variant="outline" onClick={() => window.print()} className="bg-white"><Printer className="w-4 h-4 mr-2"/> Cetak / Simpan PDF</Button>
            <Button onClick={() => setInvoiceData(null)} className="bg-gray-800 hover:bg-gray-900">Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}