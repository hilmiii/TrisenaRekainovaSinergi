import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  LayoutDashboard,
  Package,
  Users,
  LogOut,
  Search,
  Filter,
  Edit,
  Trash2,
  Loader2,
  Bell,
  CheckCircle,
  Clock,
  TruckIcon,
  XCircle,
  DollarSign,
  ShoppingBag,
  Beaker,
  ChevronDown,
  Menu,
  X,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '../components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { ScrollArea } from '../components/ui/scroll-area';

const STATUS_OPTIONS = ['Pengajuan', 'Penawaran', 'Pre-Order', 'Cancel', 'Proses', 'Dikirim'];

const STATUS_COLORS = {
  'Pengajuan': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Penawaran': 'bg-blue-100 text-blue-800 border-blue-200',
  'Pre-Order': 'bg-purple-100 text-purple-800 border-purple-200',
  'Cancel': 'bg-red-100 text-red-800 border-red-200',
  'Proses': 'bg-orange-100 text-orange-800 border-orange-200',
  'Dikirim': 'bg-green-100 text-green-800 border-green-200',
};

const STATUS_ICONS = {
  'Pengajuan': Clock,
  'Penawaran': DollarSign,
  'Pre-Order': ShoppingBag,
  'Cancel': XCircle,
  'Proses': RefreshCw,
  'Dikirim': TruckIcon,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [lastOrderCount, setLastOrderCount] = useState(0);

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          navigate(createPageUrl('AdminLogin'));
          return;
        }
        const userData = await base44.auth.me();
        
        // Check if admin (hardcoded check or is_admin field)
        if (!userData.is_admin && userData.role !== 'admin') {
          navigate(createPageUrl('Home'));
          return;
        }
        
        setUser(userData);
      } catch (e) {
        navigate(createPageUrl('AdminLogin'));
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [navigate]);

  // Fetch orders
  const { data: orders = [], isLoading: ordersLoading, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date'),
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds for "real-time" updates
  });

  // Check for new orders
  useEffect(() => {
    if (orders.length > lastOrderCount && lastOrderCount > 0) {
      const newCount = orders.length - lastOrderCount;
      setNewOrdersCount(newCount);
      
      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification('Pesanan Baru!', {
          body: `Ada ${newCount} pesanan baru masuk`,
          icon: '/favicon.ico'
        });
      }
    }
    setLastOrderCount(orders.length);
  }, [orders.length, lastOrderCount]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders']);
      setEditingOrder(null);
    }
  });

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: (id) => base44.entities.Order.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders']);
      setDeletingOrder(null);
    }
  });

  const handleLogout = async () => {
    await base44.auth.logout(createPageUrl('Home'));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderMutation.mutateAsync({ id: orderId, data: { status: newStatus } });
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: orders.length,
    pengajuan: orders.filter(o => o.status === 'Pengajuan').length,
    proses: orders.filter(o => o.status === 'Proses').length,
    dikirim: orders.filter(o => o.status === 'Dikirim').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <Beaker className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold">Admin Panel</h1>
                <p className="text-gray-400 text-xs">Prosafeaire</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-teal-600/20 text-teal-400">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
              <Package className="w-5 h-5" />
              Pesanan
              {newOrdersCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {newOrdersCount}
                </span>
              )}
            </button>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user?.full_name}</p>
                <p className="text-gray-400 text-xs truncate">{user?.email}</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="w-full border-gray-700 text-gray-400 hover:bg-gray-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h2 className="text-xl font-bold text-gray-900">Dashboard Pesanan</h2>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => {
                  refetch();
                  setNewOrdersCount(0);
                }}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                {newOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {newOrdersCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Pesanan', value: stats.total, icon: Package, color: 'bg-blue-500' },
              { label: 'Pengajuan Baru', value: stats.pengajuan, icon: Clock, color: 'bg-yellow-500' },
              { label: 'Dalam Proses', value: stats.proses, icon: RefreshCw, color: 'bg-orange-500' },
              { label: 'Terkirim', value: stats.dikirim, icon: TruckIcon, color: 'bg-green-500' },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Cari pesanan, pelanggan, produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pesanan ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Belum ada pesanan</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tgl Pesanan</TableHead>
                        <TableHead>Produk</TableHead>
                        <TableHead>Pemesan</TableHead>
                        <TableHead>Perusahaan</TableHead>
                        <TableHead>No. Telp</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => {
                        const StatusIcon = STATUS_ICONS[order.status] || Clock;
                        return (
                          <TableRow key={order.id}>
                            <TableCell className="whitespace-nowrap">
                              {order.created_date ? format(new Date(order.created_date), 'dd/MM/yyyy HH:mm') : '-'}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{order.product_name}</p>
                                <p className="text-xs text-gray-500">#{order.order_number}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{order.customer_name}</p>
                                <p className="text-xs text-gray-500">{order.customer_email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{order.company}</TableCell>
                            <TableCell>{order.customer_phone}</TableCell>
                            <TableCell>
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleStatusChange(order.id, value)}
                              >
                                <SelectTrigger className={`w-36 h-8 ${STATUS_COLORS[order.status]} border`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {STATUS_OPTIONS.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingOrder(order)}
                                >
                                  <Edit className="w-4 h-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeletingOrder(order)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
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

      {/* Edit Order Dialog */}
      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Pesanan</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500 text-sm">No. Pesanan</Label>
                  <p className="font-medium">{editingOrder.order_number}</p>
                </div>
                <div>
                  <Label className="text-gray-500 text-sm">Tanggal</Label>
                  <p className="font-medium">
                    {editingOrder.created_date ? format(new Date(editingOrder.created_date), 'dd MMMM yyyy, HH:mm') : '-'}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Informasi Pemesan</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500 text-sm">Nama</Label>
                    <p className="font-medium">{editingOrder.customer_name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-sm">Email</Label>
                    <p className="font-medium">{editingOrder.customer_email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-sm">Telepon</Label>
                    <p className="font-medium">{editingOrder.customer_phone}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-sm">Jabatan</Label>
                    <p className="font-medium">{editingOrder.position}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-500 text-sm">Perusahaan</Label>
                    <p className="font-medium">{editingOrder.company}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-500 text-sm">Alamat</Label>
                    <p className="font-medium">{editingOrder.address}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Detail Produk</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="font-medium text-lg">{editingOrder.product_name}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Material:</span>
                      <p className="font-medium">{editingOrder.material}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Ukuran:</span>
                      <p className="font-medium">{editingOrder.size}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Warna:</span>
                      <p className="font-medium">{editingOrder.color}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Jumlah:</span>
                    <p className="font-medium">{editingOrder.quantity} unit</p>
                  </div>
                  {editingOrder.additional_notes && (
                    <div>
                      <span className="text-gray-500 text-sm">Catatan:</span>
                      <p className="bg-white p-2 rounded mt-1 text-sm">{editingOrder.additional_notes}</p>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <span className="text-gray-500 text-sm">Estimasi Total:</span>
                    <p className="font-bold text-xl text-teal-600">
                      Rp {editingOrder.total_price?.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label>Status Pesanan</Label>
                <Select
                  value={editingOrder.status}
                  onValueChange={(value) => {
                    setEditingOrder({ ...editingOrder, status: value });
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingOrder(null)}>
              Batal
            </Button>
            <Button
              onClick={() => updateOrderMutation.mutate({ 
                id: editingOrder.id, 
                data: { status: editingOrder.status }
              })}
              disabled={updateOrderMutation.isPending}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {updateOrderMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingOrder} onOpenChange={() => setDeletingOrder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pesanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pesanan #{deletingOrder?.order_number}? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteOrderMutation.mutate(deletingOrder?.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteOrderMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}