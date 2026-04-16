import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
  LayoutDashboard, Package, LogOut, Search, Filter, Edit,
  Trash2, Loader2, CheckCircle, Clock, TruckIcon, XCircle,
  DollarSign, ShoppingBag, Menu, X, RefreshCw, FileText,
  Printer, ChevronRight, AlertTriangle, Users, RefreshCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { Label } from '@/Components/ui/label';

// ─── Konstanta ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ['Penawaran', 'Pre-Order', 'Proses', 'Dikirim', 'Selesai', 'Cancel'];

const STATUS_META = {
  'Penawaran': { color: 'bg-sky-50 text-sky-700 border-sky-200',     dot: 'bg-sky-400',     Icon: DollarSign  },
  'Pre-Order': { color: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-400', Icon: ShoppingBag },
  'Proses'   : { color: 'bg-amber-50 text-amber-700 border-amber-200',  dot: 'bg-amber-400',   Icon: RefreshCcw  },
  'Dikirim'  : { color: 'bg-blue-50 text-blue-700 border-blue-200',    dot: 'bg-blue-400',    Icon: TruckIcon   },
  'Selesai'  : { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400', Icon: CheckCircle },
  'Cancel'   : { color: 'bg-red-50 text-red-700 border-red-200',       dot: 'bg-red-400',     Icon: XCircle     },
};

const STATUS_ICONS = {
  'Penawaran': DollarSign,
  'Pre-Order': ShoppingBag,
  'Proses': RefreshCw,
  'Dikirim': TruckIcon,
  'Selesai': CheckCircle,
  'Cancel': XCircle,
};

const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);

// ─── Sub-komponen: Badge Status ───────────────────────────────────────────────

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { color: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400', Icon: Clock };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {status}
    </span>
  );
}

// ─── Sub-komponen: Stat Card ──────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`relative bg-white rounded-2xl p-5 border border-gray-100 overflow-hidden`}>
      <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${accent}`} />
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();

  const [user,          setUser]          = useState(null);
  const [authLoading,   setAuthLoading]   = useState(true);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [statusFilter,  setStatusFilter]  = useState('all');
  const [activeTab,     setActiveTab]     = useState('aktif');
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [newOrders,     setNewOrders]     = useState(0);
  const [lastCount,     setLastCount]     = useState(0);

  const [editingOrder,   setEditingOrder]   = useState(null);
  const [deletingOrder,  setDeletingOrder]  = useState(null);
  const [completingOrder,setCompletingOrder]= useState(null);
  const [invoiceData,    setInvoiceData]    = useState(null);
  const [shippingModal,  setShippingModal]  = useState({ isOpen: false, orderGroup: null });
  const [shippingData,   setShippingData]   = useState({ courier: '', tracking_number: '' });

  // Auth check
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return navigate(createPageUrl('Login') || '/login');
        const { data } = await base44.get('/user');
        if (!data.is_admin && data.role !== 'admin') return navigate(createPageUrl('Home') || '/');
        setUser(data);
      } catch { navigate(createPageUrl('Login') || '/login'); }
      finally   { setAuthLoading(false); }
    })();
  }, [navigate]);

  // Notifikasi browser
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
  }, []);

  // Data pesanan
  const { data: rawOrders = [], isLoading: ordersLoading, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn : async () => (await base44.get('/admin/orders')).data,
    enabled : !!user,
    refetchInterval: 30_000,
  });

  const groupedOrders = useMemo(() => {
    const grouped = rawOrders.reduce((acc, order) => {
      if (!acc[order.order_number]) acc[order.order_number] = { ...order, items: [], grand_total: 0 };
      acc[order.order_number].items.push(order);
      acc[order.order_number].grand_total += parseFloat(order.total_price);
      return acc;
    }, {});
    return Object.values(grouped).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [rawOrders]);

  const filteredOrders = useMemo(() => groupedOrders.filter(g => {
    const q = searchQuery.toLowerCase();
    const matchSearch = g.order_number?.toLowerCase().includes(q) || g.customer_name?.toLowerCase().includes(q) || g.company?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || g.status === statusFilter;
    const matchTab    = activeTab === 'aktif' ? !['Selesai','Cancel'].includes(g.status) : ['Selesai','Cancel'].includes(g.status);
    return matchSearch && matchStatus && matchTab;
  }), [groupedOrders, searchQuery, statusFilter, activeTab]);

  // Statistik ringkas
  const stats = useMemo(() => ({
    total  : groupedOrders.filter(g => !['Selesai','Cancel'].includes(g.status)).length,
    proses : groupedOrders.filter(g => g.status === 'Proses').length,
    dikirim: groupedOrders.filter(g => g.status === 'Dikirim').length,
    selesai: groupedOrders.filter(g => g.status === 'Selesai').length,
  }), [groupedOrders]);

  useEffect(() => {
    if (groupedOrders.length > lastCount && lastCount > 0) {
      const n = groupedOrders.length - lastCount;
      setNewOrders(n);
      if (Notification.permission === 'granted')
        new Notification('Pesanan Baru!', { body: `Ada ${n} pesanan baru masuk`, icon: '/favicon.ico' });
    }
    setLastCount(groupedOrders.length);
  }, [groupedOrders.length]);

  // Mutasi
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.put(`/admin/orders/${id}/status`, data).then(r => r.data),
    onSuccess : () => { queryClient.invalidateQueries(['admin-orders']); setEditingOrder(null); setCompletingOrder(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.delete(`/admin/orders/${id}`).then(r => r.data),
    onSuccess : () => { queryClient.invalidateQueries(['admin-orders']); setDeletingOrder(null); },
  });

  const handleStatusChange = (group, newStatus) => {
    if (newStatus === 'Dikirim') {
      setShippingModal({ isOpen: true, orderGroup: group });
      setShippingData({ courier: group.courier || '', tracking_number: group.tracking_number || '' });
      return;
    }
    if (newStatus === 'Selesai') { setCompletingOrder(group); return; }
    updateMutation.mutate({ id: group.id, data: { status: newStatus } });
  };

  const submitShipping = () => {
    if (!shippingData.courier || !shippingData.tracking_number) return alert('Ekspedisi dan Nomor Resi harus diisi!');
    updateMutation.mutate({ id: shippingModal.orderGroup.id, data: { status: 'Dikirim', ...shippingData } });
    setShippingModal({ isOpen: false, orderGroup: null });
  };

  const handleLogout = async () => {
    try { await base44.post('/logout'); } catch {}
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  };

  if (authLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        </div>
        <p className="text-sm text-gray-500">Memuat dashboard…</p>
      </div>
    </div>
  );

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const NAV_ITEMS = [
    { id: 'aktif',   label: 'Pesanan Aktif',     Icon: Package   },
    { id: 'riwayat', label: 'Riwayat & Invoice', Icon: FileText  },
  ];

  const Sidebar = () => (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-60 flex flex-col
      bg-gray-950 border-r border-white/5
      transition-transform duration-300 ease-in-out
      lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <img src="/img/logo.png" alt="Logo" className="h-5 w-auto object-contain" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">Admin Panel</p>
            <p className="text-gray-500 text-xs">Prosafeaire</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${active
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'}
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {id === 'aktif' && newOrders > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{newOrders}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/5 space-y-2">
        <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all">
          <ChevronRight className="w-3.5 h-3.5" /> Ke Website Publik
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>
    </aside>
  );

  // ── Render utama ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen w-full max-w-[100vw]">

        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
          <div className="flex items-center justify-between px-5 py-3 gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-base font-semibold text-gray-900">
                  {activeTab === 'aktif' ? 'Manajemen Pesanan' : 'Riwayat Transaksi'}
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">
                  {filteredOrders.length} data ditampilkan
                </p>
              </div>
            </div>
            <button
              onClick={() => { refetch(); setNewOrders(0); }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm text-gray-600 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-5">

          {/* Stat cards - PERBAIKAN: Berubah jadi grid-cols-1 di mobile agar bertumpuk ke bawah */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Aktif"    value={stats.total}   sub="pesanan berjalan"  accent="bg-teal-500"    />
            <StatCard label="Diproses" value={stats.proses}  sub="sedang dikerjakan" accent="bg-amber-400"   />
            <StatCard label="Dikirim"  value={stats.dikirim} sub="dalam pengiriman"  accent="bg-blue-500"    />
            <StatCard label="Selesai"  value={stats.selesai} sub="total selesai"     accent="bg-emerald-500" />
          </div>

          {/* Tab pills - PERBAIKAN: Tambah flex-wrap agar tidak terpotong jika layar sangat kecil */}
          <div className="flex flex-wrap gap-2">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  activeTab === id
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari nomor pesanan atau pelanggan…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-gray-50 border-gray-200 rounded-xl text-sm w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-44 h-10 bg-gray-50 border-gray-200 rounded-xl text-sm">
                  <Filter className="w-3.5 h-3.5 mr-2 text-gray-400" />
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabel & Cards Rendering */}
          {ordersLoading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Loader2 className="w-5 h-5 animate-spin" /> Memuat data…
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3 bg-white rounded-2xl border border-gray-100">
              <Package className="w-10 h-10 text-gray-200" />
              <p className="text-sm">Tidak ada data ditemukan</p>
            </div>
          ) : (
            <>
              {/* ── VERSI DESKTOP (TABEL) ── */}
              <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-100">
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-5">No. Invoice</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pelanggan</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Grand Total</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider pr-5">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredOrders.map((group, i) => {
                        const StatusIcon = STATUS_ICONS[group.status] || Clock;
                        return (
                          <motion.tr
                            key={group.order_number}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                          >
                            <TableCell className="pl-5 py-4">
                              <p className="font-semibold text-teal-700 text-sm">{group.order_number}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {group.created_at ? format(new Date(group.created_at), 'dd MMM yyyy', { locale: idLocale }) : '—'}
                              </p>
                            </TableCell>

                            <TableCell className="py-4">
                              <p className="font-medium text-gray-800 text-sm">{group.customer_name}</p>
                              <p className="text-xs text-gray-400">{group.company}</p>
                            </TableCell>

                            <TableCell className="text-right py-4">
                              <p className="font-bold text-gray-900 text-sm">{formatRupiah(group.grand_total)}</p>
                            </TableCell>

                            <TableCell className="py-4">
                              {activeTab === 'aktif' ? (
                                <Select value={group.status} onValueChange={(v) => handleStatusChange(group, v)}>
                                  <SelectTrigger className={`w-36 h-8 text-xs font-semibold rounded-full border px-3 ${STATUS_META[group.status]?.color}`}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent position="popper" side="bottom" sideOffset={4} className="z-[9999]">
                                    {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <StatusBadge status={group.status} />
                              )}
                              {group.tracking_number && group.status === 'Dikirim' && (
                                <p className="text-[11px] text-gray-400 mt-1">
                                  Resi: <span className="font-semibold text-gray-700">{group.tracking_number}</span>
                                </p>
                              )}
                            </TableCell>

                            <TableCell className="pr-5 py-4">
                              <div className="flex items-center gap-2">
                                {activeTab === 'aktif' ? (
                                  <>
                                    <button
                                      onClick={() => setEditingOrder(group)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                                    >
                                      <Edit className="w-3 h-3" /> Detail
                                    </button>
                                    <button
                                      onClick={() => setDeletingOrder(group)}
                                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => setInvoiceData(group)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                                  >
                                    <FileText className="w-3 h-3" /> Invoice
                                  </button>
                                )}
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>

              {/* ── VERSI MOBILE (CARDS) ── */}
              <div className="md:hidden space-y-4">
                <AnimatePresence>
                  {filteredOrders.map((group, i) => (
                    <motion.div
                      key={group.order_number}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4"
                    >
                      {/* Invoice & Total */}
                      <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                        <div>
                          <p className="font-bold text-teal-700 text-sm">{group.order_number}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {group.created_at ? format(new Date(group.created_at), 'dd MMM yyyy', { locale: idLocale }) : '—'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-sm">{formatRupiah(group.grand_total)}</p>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Pelanggan</p>
                        <p className="font-medium text-gray-800 text-sm">{group.customer_name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{group.company}</p>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Status Pesanan</p>
                        {activeTab === 'aktif' ? (
                          <Select value={group.status} onValueChange={(v) => handleStatusChange(group, v)}>
                            <SelectTrigger className={`w-full h-10 text-xs font-semibold rounded-xl border px-3 ${STATUS_META[group.status]?.color}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper" side="bottom" sideOffset={4} className="z-[9999]">
                              {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="mt-1">
                            <StatusBadge status={group.status} />
                          </div>
                        )}

                        {group.tracking_number && group.status === 'Dikirim' && (
                          <p className="text-xs text-gray-600 mt-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center justify-between">
                            <span>No. Resi:</span>
                            <span className="font-bold tracking-wide">{group.tracking_number}</span>
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-gray-50 flex gap-2">
                        {activeTab === 'aktif' ? (
                          <>
                            <button
                              onClick={() => setEditingOrder(group)}
                              className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" /> Lihat Detail
                            </button>
                            <button
                              onClick={() => setDeletingOrder(group)}
                              className="flex-none flex justify-center items-center px-4 py-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setInvoiceData(group)}
                            className="w-full flex justify-center items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                          >
                            <FileText className="w-4 h-4" /> Buka Invoice
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

        </main>
      </div>

      {/* ─── Modal: Konfirmasi Selesai ──────────────────────────────────────── */}
      <AlertDialog open={!!completingOrder} onOpenChange={() => setCompletingOrder(null)}>
        <AlertDialogContent className="rounded-2xl w-[90vw] sm:w-full">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-emerald-700">
              <CheckCircle className="w-5 h-5" /> Konfirmasi Penyelesaian
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2 leading-relaxed">
              Apakah pesanan <span className="font-semibold text-gray-900">{completingOrder?.order_number}</span> sudah diterima
              dan diselesaikan dengan baik? Pesanan akan masuk ke tab <span className="font-semibold">Riwayat & Invoice</span> dan
              tidak dapat diubah statusnya lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex-row flex-col gap-2 sm:gap-0 mt-4">
            <AlertDialogCancel className="rounded-xl w-full sm:w-auto mt-0">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => updateMutation.mutate({ id: completingOrder.id, data: { status: 'Selesai' } })}
              className="bg-emerald-600 hover:bg-emerald-700 rounded-xl w-full sm:w-auto"
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Iya, Selesaikan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Modal: Invoice ─────────────────────────────────────────────────── */}
      <Dialog open={!!invoiceData} onOpenChange={() => setInvoiceData(null)}>
        <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-50 print:static print:w-full print:max-w-full print:max-h-none print:overflow-visible print:bg-white print:border-none print:shadow-none p-4 sm:p-6">
          <DialogHeader className="print:hidden"><DialogTitle>Invoice</DialogTitle></DialogHeader>
          {invoiceData && (
            <div className="bg-white rounded-xl p-4 sm:p-10 print:p-0 print:shadow-none print:rounded-none">
              {/* Header invoice */}
              <div className="flex flex-col sm:flex-row justify-between gap-6 border-b-2 border-gray-100 pb-6 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-teal-800 tracking-tight mb-3">INVOICE</h1>
                  <div className="space-y-0.5 text-xs sm:text-sm">
                    <p className="text-gray-500">No. Faktur: <span className="font-semibold text-gray-900">{invoiceData.order_number}</span></p>
                    <p className="text-gray-500">Tanggal: <span className="font-semibold text-gray-900">{format(new Date(invoiceData.created_at), 'dd MMMM yyyy', { locale: idLocale })}</span></p>
                  </div>
                  
                  {/* --- PERBAIKAN: CONDITIONAL BADGE STATUS --- */}
                  {invoiceData.status === 'Cancel' ? (
                    <span className="mt-4 inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
                      <XCircle className="w-3.5 h-3.5" /> DIBATALKAN
                    </span>
                  ) : (
                    <span className="mt-4 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" /> LUNAS & SELESAI
                    </span>
                  )}
                  {/* ------------------------------------------- */}

                </div>
                <div className="sm:text-right mt-2 sm:mt-0">
                  <img src="/img/logo.png" alt="Logo" className="h-8 sm:h-9 w-auto sm:ml-auto mb-2" />
                  <p className="font-bold text-gray-900 text-sm sm:text-base">PT. Trisena Rekainova Sinergi</p>
                  <p className="text-xs text-gray-400 mt-1 sm:max-w-[220px] sm:ml-auto leading-relaxed">
                    Jl. Raya Tapos No. 57, Tapos, Kota Depok, Jawa Barat 16457
                  </p>
                </div>
              </div>

              {/* Pelanggan */}
              <div className="mb-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Ditagihkan Kepada</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">{invoiceData.customer_name}</p>
                <p className="text-sm text-gray-600">{invoiceData.company}</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">{invoiceData.address}</p>
                <p className="text-xs sm:text-sm text-gray-400">{invoiceData.customer_phone} · {invoiceData.customer_email}</p>
              </div>

              {/* Tabel item */}
              <div className="rounded-xl border border-gray-100 overflow-hidden mb-6 overflow-x-auto">
                <Table className="min-w-[400px]">
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Deskripsi</TableHead>
                      <TableHead className="text-center font-semibold text-gray-700 text-xs sm:text-sm">Qty</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700 text-xs sm:text-sm">Harga</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700 text-xs sm:text-sm">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceData.items.map((item, idx) => (
                      <TableRow key={idx} className="border-gray-100">
                        <TableCell className="py-3">
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm">{item.product_name}</p>
                          <p className="text-[10px] sm:text-xs text-gray-400">{item.material} · {item.size}</p>
                        </TableCell>
                        <TableCell className="text-center text-xs sm:text-sm text-gray-600">{item.quantity}</TableCell>
                        <TableCell className="text-right text-xs sm:text-sm text-gray-600">{formatRupiah(item.total_price / item.quantity)}</TableCell>
                        <TableCell className="text-right font-bold text-gray-900 text-xs sm:text-sm">{formatRupiah(item.total_price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Total */}
              <div className="flex justify-end mb-8">
                <div className="w-full sm:w-64 bg-teal-50 rounded-xl p-4 sm:p-5 border border-teal-100">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-3">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatRupiah(invoiceData.grand_total)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-teal-200 pt-3">
                    <span className="font-bold text-gray-900 text-sm sm:text-base">Grand Total</span>
                    <span className="text-lg sm:text-xl font-black text-teal-700">{formatRupiah(invoiceData.grand_total)}</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-[10px] sm:text-xs text-gray-300 border-t border-gray-100 pt-4 sm:pt-6">
                Terima kasih atas kepercayaan Anda bermitra dengan PT. Trisena Rekainova Sinergi.
                Dokumen ini adalah bukti pembayaran digital yang sah.
              </div>
            </div>
          )}
          <DialogFooter className="mt-2 print:hidden flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => window.print()} className="rounded-xl w-full sm:w-auto">
              <Printer className="w-4 h-4 mr-2" /> Cetak
            </Button>
            <Button onClick={() => setInvoiceData(null)} className="bg-gray-900 hover:bg-gray-800 rounded-xl w-full sm:w-auto mt-0">Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Modal: Detail Pesanan ──────────────────────────────────────────── */}
      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Detail Pesanan</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-4 sm:space-y-5 mt-2">
              {/* Info pesanan */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Nomor Pesanan</p>
                  <p className="text-base sm:text-lg font-bold text-teal-700">{editingOrder.order_number}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Tanggal & Waktu</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                    {editingOrder.created_at ? format(new Date(editingOrder.created_at), 'dd MMM yyyy, HH:mm', { locale: idLocale }) : '—'}
                  </p>
                </div>
              </div>

              {/* Data pemesan */}
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2 sm:mb-3">
                  <Users className="w-3.5 h-3.5" /> Data Pemesan
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-gray-100 rounded-xl p-4">
                  {[
                    { label: 'Nama',      value: editingOrder.customer_name  },
                    { label: 'Perusahaan',value: editingOrder.company        },
                    { label: 'Email',     value: editingOrder.customer_email },
                    { label: 'Telepon',   value: editingOrder.customer_phone },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-800 truncate" title={value}>{value || '—'}</p>
                    </div>
                  ))}
                  <div className="col-span-1 sm:col-span-2 md:col-span-4 pt-2 sm:pt-3 border-t border-gray-100">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">Alamat</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-800">{editingOrder.address || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Rincian barang */}
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2 sm:mb-3">
                  <Package className="w-3.5 h-3.5" /> Rincian Barang
                </p>
                <div className="space-y-2.5">
                  {editingOrder.items.map((item, idx) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm">{item.product_name}</p>
                        <span className="inline-flex px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-100 rounded-lg text-xs font-bold w-fit">
                          {formatRupiah(item.total_price)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] sm:text-xs">
                        {[
                          { label: 'Material', value: item.material  },
                          { label: 'Ukuran',   value: item.size      },
                          { label: 'Warna',    value: item.color     },
                          { label: 'Jumlah',   value: `${item.quantity} Unit` },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-gray-50 rounded-lg px-2.5 py-2">
                            <p className="text-gray-400 mb-0.5">{label}</p>
                            <p className="font-semibold text-gray-800">{value || '—'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 sm:mt-4 px-4 py-3 bg-teal-50 border border-teal-100 rounded-xl">
                   <span className="font-semibold text-teal-900 text-xs sm:text-sm">Total Pembayaran</span>
                   <span className="text-lg sm:text-2xl font-black text-teal-700">{formatRupiah(editingOrder.grand_total)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4 sm:mt-5 border-t pt-3 sm:pt-4">
            <Button variant="outline" onClick={() => setEditingOrder(null)} className="rounded-xl w-full sm:w-auto">Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Modal: Hapus ──────────────────────────────────────────────────── */}
      <AlertDialog open={!!deletingOrder} onOpenChange={() => setDeletingOrder(null)}>
        <AlertDialogContent className="rounded-2xl w-[90vw] sm:w-full">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" /> Hapus Pesanan?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 leading-relaxed mt-2">
              Apakah Anda yakin ingin menghapus pesanan{' '}
              <span className="font-semibold text-gray-900">{deletingOrder?.order_number}</span>?
              Tindakan ini akan menghapus <span className="font-semibold">{deletingOrder?.items?.length} item</span> secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex-row flex-col gap-2 sm:gap-0 mt-4">
            <AlertDialogCancel className="rounded-xl w-full sm:w-auto mt-0">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deletingOrder?.id)}
              className="bg-red-600 hover:bg-red-700 rounded-xl w-full sm:w-auto"
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Modal: Input Resi ──────────────────────────────────────────────── */}
      <Dialog open={shippingModal.isOpen} onOpenChange={(open) => !open && setShippingModal({ isOpen: false, orderGroup: null })}>
        <DialogContent className="rounded-2xl w-[95vw] sm:w-[425px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
              <TruckIcon className="w-4 h-4 text-teal-600" /> Input Resi Pengiriman
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 mt-2">
            <div>
              <Label className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Layanan Ekspedisi</Label>
              <Input
                value={shippingData.courier}
                onChange={(e) => setShippingData({ ...shippingData, courier: e.target.value })}
                placeholder="Contoh: JNE, Deliveree, Sicepat…"
                className="mt-1.5 sm:mt-2 rounded-xl text-sm h-10"
              />
            </div>
            <div>
              <Label className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Resi</Label>
              <Input
                value={shippingData.tracking_number}
                onChange={(e) => setShippingData({ ...shippingData, tracking_number: e.target.value })}
                placeholder="Masukkan nomor resi…"
                className="mt-1.5 sm:mt-2 rounded-xl font-mono text-sm h-10"
              />
            </div>
          </div>
          <DialogFooter className="mt-4 flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShippingModal({ isOpen: false, orderGroup: null })} className="rounded-xl w-full sm:w-auto">Batal</Button>
            <Button onClick={submitShipping} disabled={updateMutation.isPending} className="bg-teal-600 hover:bg-teal-700 rounded-xl w-full sm:w-auto">
              {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TruckIcon className="w-4 h-4 mr-2" />}
              Simpan & Kirim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}