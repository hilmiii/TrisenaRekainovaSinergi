import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await base44.post('/forgot-password', { email });
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengirim link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Login
        </Link>
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          <div className="mb-6 text-center">
            <div className="mx-auto w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Lupa Password?</h2>
            <p className="text-sm text-gray-500 mt-2">Masukkan email yang terdaftar, kami akan mengirimkan link untuk mereset password Anda.</p>
          </div>

          {isSuccess ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">Link reset password telah dikirim ke <b>{email}</b>. Silakan periksa kotak masuk atau folder spam Anda.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" />
              </div>
              <Button type="submit" disabled={isLoading || !email} className="w-full bg-teal-600 hover:bg-teal-700">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kirim Link Reset'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}