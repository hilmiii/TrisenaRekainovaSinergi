import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Jika sudah login, langsung arahkan ke Home
  useEffect(() => {
    if (localStorage.getItem('auth_token')) {
      navigate(createPageUrl('Home'));
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await base44.post('/login', { email, password });
      
      // Simpan token ke localStorage
      localStorage.setItem('auth_token', response.data.token);
      
      // Jika user diarahkan ke sini dari halaman Checkout, kembalikan ke Checkout
      const redirectUrl = localStorage.getItem('redirect_after_login') || 'Home';
      localStorage.removeItem('redirect_after_login'); // Bersihkan state
      
      navigate(createPageUrl(redirectUrl));
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Email atau Password salah.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          {/* --- PERUBAHAN LOGO DI SINI --- */}
          {/* Menghapus kotak teal dan menggantinya dengan tag img */}
          <img 
            src="/img/logo.png" 
            alt="Logo PT. Trisena Rekainova Sinergi" 
            className="h-16 w-auto mx-auto mb-4 object-contain" 
          />
          {/* --------------------------------- */}
          
          <h2 className="text-3xl font-extrabold text-gray-900">Selamat Datang</h2>
          <p className="text-gray-500 mt-2">Masuk untuk melanjutkan pesanan Anda</p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              type="email" placeholder="Alamat Email" required
              className="pl-12 h-14 bg-gray-50 rounded-xl"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="password" placeholder="Password" required
                className="pl-12 h-14 bg-gray-50 rounded-xl"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {/* TAMBAHAN: Link Lupa Password di bawah input password */}
            <div className="flex justify-end mt-2">
              <Link to="/forgot-password" className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
                Lupa Password?
              </Link>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-lg rounded-xl mt-6">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Masuk'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link to={createPageUrl('Register')} className="font-semibold text-teal-600 hover:text-teal-500">
            Daftar sekarang
          </Link>
        </p>
      </motion.div>
    </div>
  );
}