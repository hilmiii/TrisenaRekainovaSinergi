import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    if (formData.password !== formData.password_confirmation) {
      setErrorMsg('Konfirmasi password tidak cocok!');
      setIsLoading(false);
      return;
    }

    try {
      const response = await base44.post('/register', formData);
      localStorage.setItem('auth_token', response.data.token);
      const redirectUrl = localStorage.getItem('redirect_after_login') || 'Home';
      navigate(createPageUrl(redirectUrl));
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Registrasi gagal. Email mungkin sudah terdaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Daftar Akun Baru</h2>
          <p className="text-gray-500 mt-2">Mulai lengkapi fasilitas laboratorium Anda</p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              name="name" type="text" placeholder="Nama Lengkap" required
              className="pl-12 h-14 bg-gray-50 rounded-xl"
              value={formData.name} onChange={handleChange}
            />
          </div>
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              name="email" type="email" placeholder="Alamat Email" required
              className="pl-12 h-14 bg-gray-50 rounded-xl"
              value={formData.email} onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              name="password" type="password" placeholder="Password (Min. 6 Karakter)" required
              className="pl-12 h-14 bg-gray-50 rounded-xl"
              value={formData.password} onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              name="password_confirmation" type="password" placeholder="Konfirmasi Password" required
              className="pl-12 h-14 bg-gray-50 rounded-xl"
              value={formData.password_confirmation} onChange={handleChange}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-lg rounded-xl mt-4">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buat Akun'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link to={createPageUrl('Login')} className="font-semibold text-teal-600 hover:text-teal-500">
            Masuk di sini
          </Link>
        </p>
      </motion.div>
    </div>
  );
}