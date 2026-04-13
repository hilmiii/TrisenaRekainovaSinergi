import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  LayoutDashboard, Package, Users, LogOut, Search, Filter, Edit, 
  Trash2, Loader2, Bell, CheckCircle, Clock, TruckIcon, XCircle, 
  DollarSign, ShoppingBag, Beaker, Menu, X, RefreshCw, FileText, Printer
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { Label } from '@/Components/ui/label';

const STATUS_OPTIONS = ['Penawaran', 'Pre-Order', 'Proses', 'Dikirim', 'Selesai', 'Cancel'];

const STATUS_COLORS = {
  'Penawaran': 'bg-blue-100 text-blue-800 border-blue-200',
  'Pre-Order': 'bg-purple-100 text-purple-800 border-purple-200',
  'Proses': 'bg-orange-100 text-orange-800 border-orange-200',
  'Dikirim': 'bg-green-100 text-green-800 border-green-200',
  'Selesai': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Cancel': 'bg-red-100 text-red-800 border-red-200',
};

const STATUS_ICONS = {
  'Penawaran': DollarSign,
  'Pre-Order': ShoppingBag,
  'Proses': RefreshCw,
  'Dikirim': TruckIcon,
  'Selesai': CheckCircle,
  'Cancel': XCircle,
};

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number || 0);
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [activeTab, setActiveTab] = useState('aktif'); 

  const [editingOrder, setEditingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [shippingModal, setShippingModal] = useState({ isOpen: false, orderGroup: null });
  const [shippingData, setShippingData] = useState({ courier: '', tracking_number: '' });
  const [completingOrder, setCompletingOrder] = useState(null); 
  const [invoiceData, setInvoiceData] = useState(null); 
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [lastOrderCount, setLastOrderCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return navigate(createPageUrl('Login') || '/login');
        
        const response = await base44.get('/user');
        if (!response.data.is_admin && response.data.role !== 'admin') {
          return navigate(createPageUrl('Home') || '/');
        }
        setUser(response.data);
      } catch (e) {
        navigate(createPageUrl('Login') || '/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: rawOrders = [], isLoading: ordersLoading, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await base44.get('/admin/orders');
      return response.data;
    },
    enabled: !!user,
    refetchInterval: 30000, 
  });

  const groupedOrders = useMemo(() => {
    const grouped = rawOrders.reduce((acc, order) => {
      if (!acc[order.order_number]) {
        acc[order.order_number] = { ...order, items: [], grand_total: 0 };
      }
      acc[order.order_number].items.push(order);
      acc[order.order_number].grand_total += parseFloat(order.total_price);
      return acc;
    }, {});
    return Object.values(grouped).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [rawOrders]);

  const filteredOrders = groupedOrders.filter(group => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      group.order_number?.toLowerCase().includes(searchLower) ||
      group.customer_name?.toLowerCase().includes(searchLower) ||
      group.company?.toLowerCase().includes(searchLower);
      
    const matchesStatus = statusFilter === 'all' || group.status === statusFilter;
    
    const matchesTab = activeTab === 'aktif' 
      ? !['Selesai', 'Cancel'].includes(group.status) 
      : ['Selesai', 'Cancel'].includes(group.status);

    return matchesSearch && matchesStatus && matchesTab;
  });

  useEffect(() => {
    if (groupedOrders.length > lastOrderCount && lastOrderCount > 0) {
      const newCount = groupedOrders.length - lastOrderCount;
      setNewOrdersCount(newCount);
      if (Notification.permission === 'granted') {
        new Notification('Pesanan Baru!', { body: `Ada ${newCount} pesanan baru masuk`, icon: '/favicon.ico' });
      }
    }
    setLastOrderCount(groupedOrders.length);
  }, [groupedOrders.length, lastOrderCount]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
  }, []);

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await base44.put(`/admin/orders/${id}/status`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders']);
      setEditingOrder(null);
      setCompletingOrder(null);
    }
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id) => {
      const response = await base44.delete(`/admin/orders/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders']);
      setDeletingOrder(null);
    }
  });

  const handleLogout = async () => {
    try { await base44.post('/logout'); } catch (e) {}
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  };

  const handleStatusChange = async (group, newStatus) => {
    if (newStatus === 'Dikirim') {
      setShippingModal({ isOpen: true, orderGroup: group });
      setShippingData({ courier: group.courier || '', tracking_number: group.tracking_number || '' });
      return; 
    }
    if (newStatus === 'Selesai') {
      setCompletingOrder(group);
      return;
    }
    await updateOrderMutation.mutateAsync({ id: group.id, data: { status: newStatus } });
  };

  const submitShippingInfo = async () => {
    if (!shippingData.courier || !shippingData.tracking_number) return alert("Ekspedisi dan Nomor Resi harus diisi!");
    await updateOrderMutation.mutateAsync({ 
      id: shippingModal.orderGroup.id, 
      data: { status: 'Dikirim', courier: shippingData.courier, tracking_number: shippingData.tracking_number } 
    });
    setShippingModal({ isOpen: false, orderGroup: null });
  };

  if (isLoading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <img src="/img/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
              <div><h1 className="text-white font-bold">Admin Panel</h1><p className="text-gray-400 text-xs">Prosafeaire</p></div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors"><LayoutDashboard className="w-5 h-5" /> Dashboard</button>
            <button onClick={() => setActiveTab('aktif')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'aktif' ? 'bg-teal-600/20 text-teal-400' : 'text-gray-400 hover:bg-gray-800'}`}>
              <Package className="w-5 h-5" /> Pesanan Aktif
              {newOrdersCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{newOrdersCount}</span>}
            </button>
            <button onClick={() => setActiveTab('riwayat')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'riwayat' ? 'bg-teal-600/20 text-teal-400' : 'text-gray-400 hover:bg-gray-800'}`}>
              <FileText className="w-5 h-5" /> Riwayat & Invoice
            </button>
          </nav>
          <div className="p-4 border-t border-gray-800">
            <Button onClick={handleLogout} variant="outline" className="w-full border-gray-700 text-gray-400 hover:bg-gray-800"><LogOut className="w-4 h-4 mr-2" /> Keluar</Button>
          </div>
        </div>
      </aside>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <main className="flex-1 lg:ml-64">
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h2 className="text-xl font-bold text-gray-900">{activeTab === 'aktif' ? 'Manajemen Pesanan' : 'Riwayat Transaksi'}</h2>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="hidden sm:flex text-sm text-gray-500 hover:text-teal-600 mr-4">Ke Website Publik</Link>
              <Button onClick={() => { refetch(); setNewOrdersCount(0); }} variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button onClick={() => setActiveTab('aktif')} className={`pb-3 px-2 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'aktif' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              Pesanan Aktif
            </button>
            <button onClick={() => setActiveTab('riwayat')} className={`pb-3 px-2 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'riwayat' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              Riwayat & Invoice Selesai
            </button>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input placeholder="Cari No. Pesanan atau Pelanggan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Filter Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    {STATUS_OPTIONS.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{activeTab === 'aktif' ? 'Daftar Pesanan Aktif' : 'Riwayat Selesai'}</CardTitle></CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12"><Package className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Data tidak ditemukan</p></div>
              ) : (
                <div className="overflow-x-auto min-h-[250px] pb-24">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No. Invoice</TableHead>
                        <TableHead>Pelanggan</TableHead>
                        <TableHead className="text-right">Grand Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((group) => {
                        const StatusIcon = STATUS_ICONS[group.status] || Clock;
                        return (
                          <TableRow key={group.order_number}>
                            <TableCell>
                              <p className="font-bold text-teal-700">{group.order_number}</p>
                              <p className="text-xs text-gray-500">{format(new Date(group.created_at), 'dd/MM/yyyy')}</p>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{group.customer_name}</p>
                              <p className="text-xs text-gray-500">{group.company}</p>
                            </TableCell>
                            <TableCell className="text-right font-bold text-gray-900">
                              {formatRupiah(group.grand_total)}
                            </TableCell>
                            <TableCell>
                              {activeTab === 'aktif' ? (
                                <Select value={group.status} onValueChange={(value) => handleStatusChange(group, value)}>
                                  <SelectTrigger className={`w-36 h-8 ${STATUS_COLORS[group.status]} border`}>
                                    <StatusIcon className="w-3 h-3 mr-1" /><SelectValue />
                                  </SelectTrigger>
                                  <SelectContent position="popper" side="bottom" sideOffset={4} className="z-[9999]">
                                    {STATUS_OPTIONS.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[group.status]}`}>
                                  <StatusIcon className="w-3 h-3 mr-1" /> {group.status}
                                </span>
                              )}
                              
                              {group.tracking_number && group.status === 'Dikirim' && (
                                <div className="mt-2 text-xs border-t border-gray-200 pt-1 w-36 text-gray-600">
                                  Resi: <span className="font-bold text-gray-900">{group.tracking_number}</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {activeTab === 'aktif' ? (
                                  <>
                                    <Button variant="outline" size="sm" onClick={() => setEditingOrder(group)} className="text-blue-600 border-blue-200">
                                      <Edit className="w-4 h-4 mr-2" /> Detail
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => setDeletingOrder(group)}>
                                      <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </>
                                ) : (
                                  <Button variant="default" size="sm" onClick={() => setInvoiceData(group)} className="bg-teal-600 hover:bg-teal-700">
                                    <FileText className="w-4 h-4 mr-2" /> Lihat Invoice
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={!!completingOrder} onOpenChange={() => setCompletingOrder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-emerald-700">
              <CheckCircle className="w-6 h-6" /> Konfirmasi Penyelesaian
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2">
              Apakah pesanan <b>{completingOrder?.order_number}</b> sudah diterima dan diselesaikan dengan baik oleh pelanggan? 
              <br/><br/>
              Setelah pesanan diselesaikan, pesanan ini akan masuk ke tab <b>Riwayat & Invoice</b> dan tidak dapat diubah statusnya lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => updateOrderMutation.mutate({ id: completingOrder.id, data: { status: 'Selesai' }})} className="bg-emerald-600 hover:bg-emerald-700">
              {updateOrderMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Iya, Selesaikan Pesanan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!invoiceData} onOpenChange={() => setInvoiceData(null)}>
        {/* KELAS AJAIB TAILWIND KHUSUS PRINT: static, no translate, w-full, overflow-visible, dsb. */}
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-50 print:static print:translate-x-0 print:translate-y-0 print:w-full print:max-w-full print:h-auto print:max-h-none print:overflow-visible print:border-none print:shadow-none print:bg-white print:p-0">
          <DialogHeader className="hidden print:hidden"><DialogTitle>Invoice</DialogTitle></DialogHeader>
          {invoiceData && (
            <div className="bg-white p-8 md:p-12 shadow-sm rounded-xl">
              <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-gray-200 pb-8 mb-8">
                <div>
                  <h1 className="text-4xl font-black text-teal-800 tracking-tight mb-2">INVOICE</h1>
                  <p className="text-gray-500 font-medium">No. Faktur: <span className="text-gray-900">{invoiceData.order_number}</span></p>
                  <p className="text-gray-500 font-medium">Tanggal: <span className="text-gray-900">{format(new Date(invoiceData.created_at), 'dd MMMM yyyy')}</span></p>
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
                    <span className="font-medium">{formatRupiah(invoiceData.grand_total)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
                    <span className="text-lg font-bold text-gray-900">GRAND TOTAL</span>
                    <span className="text-2xl font-black text-teal-700">{formatRupiah(invoiceData.grand_total)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-12 text-center text-gray-400 text-sm border-t pt-6">
                <p>Terima kasih atas kepercayaan Anda bermitra dengan PT. Trisena Rekainova Sinergi.</p>
                <p className="mt-1">Dokumen ini adalah bukti pembayaran digital yang sah.</p>
              </div>
            </div>
          )}
          {/* SEMBUNYIKAN TOMBOL KETIKA MENCETAK (print:hidden) */}
          <DialogFooter className="mt-4 px-6 sm:px-0 print:hidden">
            <Button variant="outline" onClick={() => window.print()} className="bg-white"><Printer className="w-4 h-4 mr-2"/> Cetak Invoice</Button>
            <Button onClick={() => setInvoiceData(null)} className="bg-gray-800 hover:bg-gray-900">Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sisa kode modal Edit dan Delete biarkan seperti biasa... */}
      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Detail Lengkap Pesanan</DialogTitle></DialogHeader>
          {editingOrder && (
            <div className="space-y-6">
              <div className="flex justify-between items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div><p className="text-xs text-gray-500 mb-1">Nomor Pesanan</p><p className="text-xl font-bold text-teal-700">{editingOrder.order_number}</p></div>
                <div className="text-right"><p className="text-xs text-gray-500 mb-1">Tanggal & Waktu</p><p className="font-medium text-gray-900">{editingOrder.created_at ? format(new Date(editingOrder.created_at), 'dd MMMM yyyy, HH:mm') : '-'}</p></div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Users className="w-5 h-5 text-teal-600"/> Data Pemesan</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-gray-100 rounded-xl">
                  <div><Label className="text-gray-500 text-xs">Nama Lengkap</Label><p className="font-medium text-sm">{editingOrder.customer_name}</p></div>
                  <div><Label className="text-gray-500 text-xs">Perusahaan</Label><p className="font-medium text-sm">{editingOrder.company}</p></div>
                  <div><Label className="text-gray-500 text-xs">Email</Label><p className="font-medium text-sm truncate" title={editingOrder.customer_email}>{editingOrder.customer_email}</p></div>
                  <div><Label className="text-gray-500 text-xs">No. Telepon</Label><p className="font-medium text-sm">{editingOrder.customer_phone}</p></div>
                  <div className="col-span-2 md:col-span-4 pt-2 border-t"><Label className="text-gray-500 text-xs">Alamat Pengiriman</Label><p className="font-medium text-sm">{editingOrder.address}</p></div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Package className="w-5 h-5 text-teal-600"/> Rincian Barang</h4>
                <div className="space-y-3">
                  {editingOrder.items.map((item, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                         <p className="font-bold text-gray-900 text-base">{item.product_name}</p>
                         <p className="font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-lg border border-teal-100">{formatRupiah(item.total_price)}</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4 text-sm mb-3">
                         <div><span className="text-gray-500 text-xs block">Material</span><span className="font-medium">{item.material}</span></div>
                         <div><span className="text-gray-500 text-xs block">Ukuran</span><span className="font-medium">{item.size}</span></div>
                         <div><span className="text-gray-500 text-xs block">Warna</span><span className="font-medium">{item.color}</span></div>
                         <div><span className="text-gray-500 text-xs block">Jumlah</span><span className="font-medium">{item.quantity} Unit</span></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 p-5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-100">
                   <span className="font-bold text-teal-900 text-lg">Total Pembayaran</span>
                   <span className="text-3xl font-black text-teal-700 tracking-tight">{formatRupiah(editingOrder.grand_total)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-6 border-t pt-4">
            <Button variant="outline" onClick={() => setEditingOrder(null)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingOrder} onOpenChange={() => setDeletingOrder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Faktur Pesanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus seluruh pesanan <b>{deletingOrder?.order_number}</b>? Tindakan ini akan menghapus <b>{deletingOrder?.items?.length} barang</b> di dalamnya secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteOrderMutation.mutate(deletingOrder?.id)} 
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteOrderMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />} 
              Hapus Pesanan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={shippingModal.isOpen} onOpenChange={(open) => !open && setShippingModal({ isOpen: false, orderGroup: null })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Input Resi Pengiriman</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Layanan Ekspedisi</Label><Input value={shippingData.courier} onChange={(e) => setShippingData({...shippingData, courier: e.target.value})} placeholder="Contoh: JNE, Deliveree..." className="mt-1"/></div>
            <div><Label>Nomor Resi</Label><Input value={shippingData.tracking_number} onChange={(e) => setShippingData({...shippingData, tracking_number: e.target.value})} placeholder="Masukkan nomor resi..." className="mt-1 font-mono"/></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShippingModal({ isOpen: false, orderGroup: null })}>Batal</Button>
            <Button onClick={submitShippingInfo} disabled={updateOrderMutation.isPending} className="bg-teal-600 hover:bg-teal-700">{updateOrderMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TruckIcon className="w-4 h-4 mr-2" />} Simpan Resi & Kirim</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}