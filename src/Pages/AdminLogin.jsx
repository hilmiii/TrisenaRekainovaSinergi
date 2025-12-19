import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '../api/base44Client';
import { motion } from 'framer-motion';
import { Beaker, Lock, ArrowRight, Loader2, Shield } from 'lucide-react';
import { Button } from '../Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../Components/ui/card';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          if (userData.is_admin || userData.role === 'admin') {
            navigate(createPageUrl('AdminDashboard'));
          }
        }
      } catch (e) {
        // Not authenticated
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = () => {
    setIsLoading(true);
    base44.auth.redirectToLogin(window.location.origin + createPageUrl('AdminDashboard'));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.3),transparent_50%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-teal-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Admin Panel
            </CardTitle>
            <CardDescription>
              PT. Trisena Rekainova Sinergi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-600 text-sm">
              Silakan login dengan akun admin untuk mengakses dashboard pengelolaan pesanan
            </p>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Login Admin
                </>
              )}
            </Button>

            <div className="border-t pt-6">
              <p className="text-center text-sm text-gray-500 mb-4">
                Akses terbatas hanya untuk admin yang terdaftar
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(createPageUrl('Home'))}
              >
                Kembali ke Website
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} PT. Trisena Rekainova Sinergi
        </p>
      </motion.div>
    </div>
  );
}