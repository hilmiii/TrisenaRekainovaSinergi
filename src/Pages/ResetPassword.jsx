import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { KeyRound, Loader2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Mengambil token dan email dari URL (dikirim dari email)
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      return setError('Password konfirmasi tidak cocok.');
    }

    setIsLoading(true);
    setError('');

    try {
      await base44.post('/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      
      alert('Password berhasil diubah! Silakan login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Token mungkin kadaluarsa.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return <div className="text-center mt-20 text-red-600">Link tidak valid atau rusak.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          <div className="mb-6 text-center">
            <div className="mx-auto w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Buat Password Baru</h2>
            <p className="text-sm text-gray-500 mt-2">Silakan buat password baru untuk akun <b>{email}</b></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
              <Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ulangi Password Baru</label>
              <Input type="password" required minLength={8} value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
            </div>
            <Button type="submit" disabled={isLoading || !password} className="w-full bg-teal-600 hover:bg-teal-700 mt-4">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Password Baru'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}