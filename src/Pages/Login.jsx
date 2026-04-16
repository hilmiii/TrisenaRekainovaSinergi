import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

// ─── Komponen Animasi Abstrak ────────────────────────────────────────────────
function AbstractCanvas() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const timeRef   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Konfigurasi bentuk ──────────────────────────────────────────────────
    const TEAL = {
      veryLight : 'rgba(224,245,238,',
      light     : 'rgba(93,202,165,',
      mid       : 'rgba(29,158,117,',
      dark      : 'rgba(15,110,86,',
      veryDark  : 'rgba(4,52,44,',
    };

    // Cincin orbit
    const rings = [
      { radiusFactor: 0.28, speed: 0.0004, dashLen: 6,  gapLen: 10, color: TEAL.mid,   width: 0.8, phase: 0 },
      { radiusFactor: 0.40, speed: -0.0003, dashLen: 4, gapLen: 14, color: TEAL.light, width: 0.6, phase: 1 },
      { radiusFactor: 0.55, speed: 0.00025, dashLen: 3, gapLen: 18, color: TEAL.veryLight, width: 0.5, phase: 2 },
      { radiusFactor: 0.70, speed: -0.0002, dashLen: 2, gapLen: 22, color: TEAL.light, width: 0.4, phase: 3 },
    ];

    // Partikel
    const PARTICLE_COUNT = 28;
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      angleFactor : Math.random(),       // posisi awal di orbit
      orbitIdx    : i % rings.length,    // ikut ring mana
      r           : 1.5 + Math.random() * 2,
      pulseOffset : Math.random() * Math.PI * 2,
      pulseSpeed  : 0.6 + Math.random() * 0.8,
    }));

    // Garis salib berputar
    const crosses = [
      { speed: 0.0003,  alpha: 0.12 },
      { speed: -0.0002, alpha: 0.08 },
    ];

    // Persegi berputar di tengah
    const squares = [
      { size: 0.12, speed: 0.0005,  alpha: 0.22 },
      { size: 0.18, speed: -0.0003, alpha: 0.12 },
    ];

    // ── Loop render ─────────────────────────────────────────────────────────
    const draw = (ts) => {
      const dt = ts - timeRef.current;
      timeRef.current = ts;
      const t = ts * 0.001; // detik

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      ctx.clearRect(0, 0, W, H);

      // Latar belakang
      ctx.fillStyle = '#04342C';
      ctx.fillRect(0, 0, W, H);

      // ── Cincin orbit ────────────────────────────────────────────────────
      rings.forEach((ring, i) => {
        const angle  = ring.phase + t * ring.speed * 1000;
        const radius = Math.min(W, H) * ring.radiusFactor;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color + '0.35)';
        ctx.lineWidth   = ring.width;
        ctx.setLineDash([ring.dashLen, ring.gapLen]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      });

      // ── Garis salib berputar ────────────────────────────────────────────
      crosses.forEach((cross) => {
        const angle  = t * cross.speed * 1000;
        const len    = Math.min(W, H) * 0.75;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.strokeStyle = `rgba(29,158,117,${cross.alpha})`;
        ctx.lineWidth   = 0.5;

        [-len / 2, len / 2].forEach(() => {});
        ctx.beginPath(); ctx.moveTo(-len / 2, 0); ctx.lineTo(len / 2, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -len / 2); ctx.lineTo(0, len / 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-len / 2, -len / 2); ctx.lineTo(len / 2, len / 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(len / 2, -len / 2); ctx.lineTo(-len / 2, len / 2); ctx.stroke();
        ctx.restore();
      });

      // ── Persegi berputar ────────────────────────────────────────────────
      squares.forEach((sq) => {
        const angle = t * sq.speed * 1000;
        const s     = Math.min(W, H) * sq.size;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.strokeStyle = `rgba(93,202,165,${sq.alpha})`;
        ctx.lineWidth   = 0.7;
        ctx.strokeRect(-s, -s, s * 2, s * 2);
        ctx.restore();
      });

      // ── Kurva bezier bergerak ────────────────────────────────────────────
      const bPhase = t * 0.15;
      ctx.save();
      ctx.strokeStyle = 'rgba(93,202,165,0.2)';
      ctx.lineWidth   = 0.6;
      ctx.beginPath();
      ctx.moveTo(cx, cy - Math.min(W, H) * 0.38);
      ctx.bezierCurveTo(
        cx + Math.cos(bPhase) * W * 0.3, cy + Math.sin(bPhase) * H * 0.2,
        cx - Math.cos(bPhase) * W * 0.2, cy - Math.sin(bPhase) * H * 0.15,
        cx, cy + Math.min(W, H) * 0.38
      );
      ctx.stroke();

      ctx.strokeStyle = 'rgba(159,225,203,0.15)';
      ctx.beginPath();
      ctx.moveTo(cx - W * 0.38, cy);
      ctx.bezierCurveTo(
        cx + Math.sin(bPhase) * W * 0.2, cy + Math.cos(bPhase) * H * 0.25,
        cx - Math.sin(bPhase) * W * 0.15, cy - Math.cos(bPhase) * H * 0.2,
        cx + W * 0.38, cy
      );
      ctx.stroke();
      ctx.restore();

      // ── Titik pusat ──────────────────────────────────────────────────────
      const corePulse = 0.7 + 0.3 * Math.sin(t * 2);
      ctx.beginPath();
      ctx.arc(cx, cy, 5 * corePulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(93,202,165,0.8)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#9FE1CB';
      ctx.fill();

      // ── Partikel ─────────────────────────────────────────────────────────
      particles.forEach((p) => {
        const ring   = rings[p.orbitIdx];
        const radius = Math.min(W, H) * ring.radiusFactor;
        const angle  = p.angleFactor * Math.PI * 2 + ring.phase + t * ring.speed * 1000;

        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;

        const pulse  = 0.5 + 0.5 * Math.sin(t * p.pulseSpeed + p.pulseOffset);
        const alpha  = 0.25 + 0.45 * pulse;
        const radius2 = p.r * (0.7 + 0.3 * pulse);

        ctx.beginPath();
        ctx.arc(px, py, radius2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(93,202,165,${alpha})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}

// ─── Komponen Utama Login ────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading]   = useState(false);
  const [errorMsg, setErrorMsg]     = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      localStorage.setItem('auth_token', response.data.token);

      const redirectUrl = localStorage.getItem('redirect_after_login') || 'Home';
      localStorage.removeItem('redirect_after_login');
      navigate(createPageUrl(redirectUrl));
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Email atau Password salah.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">

      {/* ── Panel Kiri – Animasi Abstrak (tersembunyi di mobile) ─────────── */}
      <div className="hidden md:flex flex-col items-center justify-center relative flex-1 overflow-hidden bg-[#04342C]">

        {/* Canvas animasi */}
        <AbstractCanvas />

        {/* Konten branding di atas canvas */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 0.68, 0, 1.2] }}
          className="relative z-10 flex flex-col items-center text-center px-12"
        >
          {/* Logo */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border"
            style={{
              background : 'rgba(29,158,117,0.2)',
              borderColor: 'rgba(93,202,165,0.3)',
            }}
          >
            <img
              src="/img/logo.png"
              alt="Logo PT. Trisena Rekainova Sinergi"
              className="h-10 w-auto object-contain"
            />
          </motion.div>

          <h1 className="text-2xl font-medium leading-snug" style={{ color: '#9FE1CB' }}>
            Trisena Rekainova<br />Sinergi
          </h1>
          <p className="text-sm mt-2 tracking-widest" style={{ color: 'rgba(159,225,203,0.45)' }}>
            Produsen Lemari Asam, Laminar Air Flow, dan Fume Hood Scrubber terpercaya untuk laboratorium modern Indonesia.
          </p>
        </motion.div>
      </div>

      {/* ── Panel Kanan – Form Login ─────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-12 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
        >
          {/* Header – logo hanya muncul di mobile */}
          <div className="text-center mb-8">
            <div className="md:hidden flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center">
                <img
                  src="/img/logo.png"
                  alt="Logo PT. Trisena Rekainova Sinergi"
                  className="h-9 w-auto object-contain"
                />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Selamat Datang</h2>
            <p className="text-gray-500 mt-2 text-sm">Masuk untuk melanjutkan pesanan Anda</p>
          </div>

          {/* Error message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-5 flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 p-3.5 rounded-xl text-sm"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                <circle cx="8" cy="8" r="6.5" />
                <path d="M8 5v3.5M8 11v.4" strokeLinecap="round" />
              </svg>
              {errorMsg}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45, ease: [0.22, 0.68, 0, 1.2] }}
            >
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="nama@email.com"
                  required
                  className="pl-11 h-12 bg-gray-50 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 0.68, 0, 1.2] }}
            >
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  required
                  className="pl-11 pr-11 h-12 bg-gray-50 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4" />
                    : <Eye    className="h-4 w-4" />
                  }
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Lupa Password?
                </Link>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.45, ease: [0.22, 0.68, 0, 1.2] }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-base rounded-xl mt-2 transition-all"
              >
                {isLoading
                  ? <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  : 'Masuk'
                }
              </Button>
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-7 text-center text-sm text-gray-500"
          >
            Belum punya akun?{' '}
            <Link
              to={createPageUrl('Register')}
              className="font-semibold text-teal-600 hover:text-teal-500 transition-colors"
            >
              Daftar sekarang
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}