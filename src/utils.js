// src/utils.js

export const createPageUrl = (pageName) => {
  // Mapping nama halaman ke URL path
  const routes = {
    'Home': '/',
    'Catalog': '/catalog',
    'About': '/about',
    'Contact': '/contact',
    'Checkout': '/checkout',
    'Cart': '/cart', // Jika nanti ada halaman cart terpisah
    'Login': '/admin/login', // Mengarah ke admin login untuk saat ini
    'AdminLogin': '/admin/login',
    'AdminDashboard': '/admin/dashboard',
    'CompleteProfile': '/complete-profile'
  };

  // Handle dynamic routes (e.g., "ProductDetail?id=123")
  if (pageName.includes('?')) {
    const [base, query] = pageName.split('?');
    const path = routes[base] || `/${base.toLowerCase()}`;
    return `${path}?${query}`;
  }

  return routes[pageName] || `/${pageName.toLowerCase()}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};