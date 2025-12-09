import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { 
  Beaker, 
  User, 
  Building2, 
  Briefcase, 
  MapPin, 
  Phone,
  ArrowRight,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    company: '',
    position: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          navigate(createPageUrl('Login'));
          return;
        }
        const userData = await base44.auth.me();
        setUser(userData);
        setFormData({
          phone: userData.phone || '',
          company: userData.company || '',
          position: userData.position || '',
          address: userData.address || ''
        });
      } catch (e) {
        navigate(createPageUrl('Login'));
      }
      setIsLoading(false);
    };
    loadUser();
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi';
    if (!formData.company.trim()) newErrors.company = 'Nama perusahaan wajib diisi';
    if (!formData.position.trim()) newErrors.position = 'Jabatan wajib diisi';
    if (!formData.address.trim()) newErrors.address = 'Alamat wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await base44.auth.updateMe(formData);
      const redirectTo = localStorage.getItem('redirect_after_login') || 'Checkout';
      localStorage.removeItem('redirect_after_login');
      navigate(createPageUrl(redirectTo));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Beaker className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Lengkapi Profil Anda
            </h1>
            <p className="text-gray-600">
              Informasi ini diperlukan untuk memproses pesanan furniture laboratorium Anda
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" />
                Informasi Profil
              </CardTitle>
              <CardDescription>
                Masuk sebagai: <span className="font-medium">{user?.email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Nomor Telepon / WhatsApp
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    Nama Perusahaan / Institusi
                  </Label>
                  <Input
                    id="company"
                    placeholder="PT. Contoh Perusahaan"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className={errors.company ? 'border-red-500' : ''}
                  />
                  {errors.company && (
                    <p className="text-red-500 text-sm">{errors.company}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    Jabatan
                  </Label>
                  <Input
                    id="position"
                    placeholder="Manager Laboratorium"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className={errors.position ? 'border-red-500' : ''}
                  />
                  {errors.position && (
                    <p className="text-red-500 text-sm">{errors.position}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Alamat Lengkap
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Jalan, No., RT/RW, Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`min-h-[100px] ${errors.address ? 'border-red-500' : ''}`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-lg font-semibold"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      Simpan & Lanjutkan
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}