import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Lock, Mail, Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Lakukan Login Standar
      const response = await base44.post('/login', formData);
      localStorage.setItem('auth_token', response.data.token);

      // 2. Ambil Data Profil untuk mengecek Role
      const userRes = await base44.get('/user');
      const user = userRes.data;

      // 3. Verifikasi Keamanan: Apakah dia benar-benar Admin?
      if (user.role === 'admin' || user.is_admin) {
        navigate('/admin/dashboard'); // Jika ya, masuk ke Dashboard
      } else {
        // Jika akun biasa mencoba masuk lewat jalur ini, tendang keluar!
        await base44.post('/logout');
        localStorage.removeItem('auth_token');
        setError('Akses Ditolak: Kredensial tidak memiliki hak akses Administrator.');
      }
    } catch (err) {
      setError('Email atau password salah.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-700">
            <ShieldAlert className="w-8 h-8 text-teal-500" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Portal Administrator
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Sistem Informasi PT. Trisena Rekainova
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">Otentikasi Terpusat</CardTitle>
            <CardDescription className="text-gray-400">Masukkan kredensial khusus admin Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 bg-red-900/50 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300">Email Administrator</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="admin@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Kata Sandi</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Masuk ke Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}