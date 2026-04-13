import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2, MapPin, LogOut, Loader2, Package, ShieldCheck, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // State untuk mode edit
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '', phone: '', company: '', address: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          navigate(createPageUrl('Login'));
          return;
        }

        const response = await base44.get('/user');
        setUser(response.data);
        // Isi form edit dengan data saat ini
        setEditForm({
          name: response.data.name || '',
          phone: response.data.phone || '',
          company: response.data.company || '',
          address: response.data.address || ''
        });
      } catch (error) {
        localStorage.removeItem('auth_token');
        navigate(createPageUrl('Login'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

 const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await base44.post('/logout'); 
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem('auth_token'); 
      
      // TAMBAHAN: Pastikan keranjang guest dibersihkan saat logout dari halaman Profil
      localStorage.removeItem('trisena_cart_guest');
      
      window.location.href = '/'; 
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await base44.put('/user/profile', editForm);
      setUser(response.data.user); // Update state user dengan data baru
      setIsEditing(false); // Tutup mode edit
    } catch (error) {
      alert("Gagal menyimpan profil. Silakan coba lagi.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const isProfileIncomplete = !user?.phone || !user?.company || !user?.address;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profil Saya</h1>
          <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut} className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200">
            {isLoggingOut ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
            Keluar Akun
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Kartu Profil Singkat */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                <span className="text-3xl font-bold text-teal-600">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{user?.role === 'admin' ? 'Administrator' : 'Pelanggan'}</p>
              
              <div className="inline-flex items-center justify-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200">
                <ShieldCheck className="w-4 h-4" /> Akun Terverifikasi
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-2">
              <Link to={createPageUrl('Catalog')} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-colors font-medium">
                <Package className="w-5 h-5" /> Mulai Belanja
              </Link>
            </div>
          </motion.div>

          {/* Kartu Detail Informasi */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative">
              
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-lg font-bold text-gray-900">Informasi Kontak & Perusahaan</h3>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="text-teal-600 border-teal-200 hover:bg-teal-50">
                    <Edit2 className="w-4 h-4 mr-2" /> Edit Profil
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                    <X className="w-4 h-4 mr-2" /> Batal
                  </Button>
                )}
              </div>
              
              {!isEditing ? (
                // MODE TAMPILAN (READ ONLY)
                <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><User className="w-4 h-4" /> Nama Lengkap</label>
                    <p className="font-semibold text-gray-900">{user?.name || '-'}</p>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><Mail className="w-4 h-4" /> Alamat Email</label>
                    <p className="font-semibold text-gray-900">{user?.email || '-'}</p>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><Phone className="w-4 h-4" /> No. Telepon / WhatsApp</label>
                    <p className="font-semibold text-gray-900">{user?.phone || 'Belum diisi'}</p>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><Building2 className="w-4 h-4" /> Nama Instansi / Perusahaan</label>
                    <p className="font-semibold text-gray-900">{user?.company || 'Belum diisi'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><MapPin className="w-4 h-4" /> Alamat Lengkap</label>
                    <p className="font-semibold text-gray-900">{user?.address || 'Belum diisi'}</p>
                  </div>
                </div>
              ) : (
                // MODE EDIT (FORM)
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                      <Input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email (Tidak bisa diubah)</label>
                      <Input value={user?.email} disabled className="mt-1 bg-gray-100" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">No. Telepon / WhatsApp *</label>
                      <Input value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} placeholder="Contoh: 08123456789" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nama Instansi *</label>
                      <Input value={editForm.company} onChange={(e) => setEditForm({...editForm, company: e.target.value})} placeholder="Nama kampus/perusahaan" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Alamat Lengkap Pengiriman *</label>
                    <Input value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} placeholder="Detail alamat pengiriman" className="mt-1" />
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-teal-600 hover:bg-teal-700">
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Simpan Perubahan
                    </Button>
                  </div>
                </div>
              )}

              {/* Peringatan Profil Belum Lengkap */}
              {isProfileIncomplete && !isEditing && (
                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800 font-medium">
                    ⚠️ Beberapa informasi profil Anda belum lengkap. Silakan lengkapi profil Anda agar dapat melakukan pemesanan (Checkout).
                  </p>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}