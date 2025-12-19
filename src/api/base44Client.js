import lemariAsamImg from '@/assets/img/lemariAsam.jpg';
import laminarAirFlowImg from '@/assets/img/laminarAirFlow.jpg';
import fumeHoodImg from '@/assets/img/fumeHood.jpg';

// Mock Data Produk
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Lemari Asam Prosafeaire",
    description: "Lemari asam (Fume Hood) berkualitas tinggi standar ISO.",
    short_description: "Fume Hood pelindung operator dari uap berbahaya.",
    image_url: lemariAsamImg,
    base_price: 25000000,
    category: "fume_hood",
    materials: ["Multiplex 18mm", "Stainless Steel 304", "Polypropylene"],
    sizes: ["1200 x 800 x 2400 mm", "1500 x 800 x 2400 mm", "1800 x 800 x 2400 mm"],
    colors: ["Light Grey", "White", "Blue"],
    features: ["Chemical Resistant", "Explosion Proof Lamp", "Digital Controller"]
  },
  {
    id: "2",
    name: "Laminar Air Flow",
    description: "Meja kerja steril untuk inokulasi mikrobiologi.",
    short_description: "Clean bench sterile work area.",
    image_url: laminarAirFlowImg,
    base_price: 18500000,
    category: "laminar_flow",
    materials: ["Steel Powder Coating", "Stainless Steel 304"],
    sizes: ["1200 mm", "1500 mm"],
    colors: ["White"],
    features: ["HEPA Filter H14", "UV Lamp", "Air Velocity Display"]
  },
  {
    id: "3",
    name: "Fume Hood Scrubber Prosafeaire",
    description: "Sistem penyaring udara buangan lemari asam untuk menjaga kualitas udara lingkungan.",
    short_description: "Air Purification System.",
    image_url: fumeHoodImg,
    base_price: 20500000,
    category: "fume_hood",
    materials: ["Steel Powder Coating", "Stainless Steel 304"],
    sizes: ["1200 mm", "1500 mm"],
    colors: ["White"],
    features: ["HEPA Filter H14", "UV Lamp", "Air Velocity Display"]
  },
];

// Helper untuk simulasi delay network
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const base44 = {
  auth: {
    isAuthenticated: async () => {
      // Cek localStorage token dummy
      return !!localStorage.getItem('base44_token');
    },
    me: async () => {
      const userStr = localStorage.getItem('base44_user');
      if (!userStr) throw new Error("Not authenticated");
      return JSON.parse(userStr);
    },
    login: async (email, password) => {
      // Mock login: create dummy user/token
      await delay(800);
      const user = {
        id: "usr_123",
        email: "admin@trisena.id",
        full_name: "Admin Trisena",
        role: "admin", 
        is_admin: true,
        phone: "08123456789",
        company: "PT. Internal",
        position: "Staff",
        address: "Jakarta"
      };
      localStorage.setItem('base44_token', 'mock_token_xyz');
      localStorage.setItem('base44_user', JSON.stringify(user));
      return user;
    },
    logout: async (redirectUrl) => {
      localStorage.removeItem('base44_token');
      localStorage.removeItem('base44_user');
      if (redirectUrl) window.location.href = redirectUrl;
      else window.location.reload();
    },
    
    // --- PERBAIKAN DI SINI ---
    redirectToLogin: (returnUrl) => {
      // Kita ubah mock ini menjadi ADMIN agar bisa masuk Dashboard
      const user = {
        id: "admin_001",
        full_name: "Admin Trisena",
        email: "admin@trisena.id",
        role: "admin",              // Diubah jadi 'admin'
        is_admin: true,             // Diubah jadi true
        phone: "08123456789",
        company: "PT. Trisena",
        position: "Administrator",
        address: "Jakarta"
      };
      
      localStorage.setItem('base44_token', 'mock_admin_token');
      localStorage.setItem('base44_user', JSON.stringify(user));
      
      // Reload halaman agar useEffect di AdminLogin mendeteksi user baru
      window.location.reload();
    },
    // -------------------------

    updateMe: async (data) => {
      await delay(500);
      const currentUser = JSON.parse(localStorage.getItem('base44_user') || '{}');
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem('base44_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
  },
  entities: {
    Product: {
      list: async () => {
        await delay(500);
        return MOCK_PRODUCTS;
      },
      filter: async ({ id }) => {
        await delay(300);
        return MOCK_PRODUCTS.filter(p => p.id === id);
      }
    },
    Order: {
      list: async (sort) => {
        await delay(500);
        const orders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        return orders.reverse(); // simple sort desc
      },
      create: async (orderData) => {
        await delay(800);
        const newOrder = { 
          id: Math.random().toString(36).substr(2, 9),
          created_date: new Date().toISOString(),
          ...orderData 
        };
        const orders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        orders.push(newOrder);
        localStorage.setItem('mock_orders', JSON.stringify(orders));
        return newOrder;
      },
      update: async (id, data) => {
        const orders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        const index = orders.findIndex(o => o.id === id);
        if (index !== -1) {
          orders[index] = { ...orders[index], ...data };
          localStorage.setItem('mock_orders', JSON.stringify(orders));
        }
      },
      delete: async (id) => {
        let orders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        orders = orders.filter(o => o.id !== id);
        localStorage.setItem('mock_orders', JSON.stringify(orders));
      }
    }
  }
};