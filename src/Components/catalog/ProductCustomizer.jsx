import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Info } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';

// ==========================================
// 1. KAMUS HARGA (Sesuai Price List PDF)
// ==========================================
const PRICING_DATA = {
  "Fume Hood": {
    "Standard (HPL)": {
      "4ft (FHP120C-HPL)": 47000000,
      "5ft (FHP150C-HPL)": 58000000,
      "6ft (FHP180C-HPL)": 84000000,
      "8ft (FHP240C-HPL)": 92000000,
    },
    "Medium (SCR)": {
      "4ft (FHP120C-SCR)": 50000000,
      "5ft (FHP150C-SCR)": 62000000,
      "6ft (FHP180C-SCR)": 89000000,
      "8ft (FHP240C-SCR)": 98000000,
    },
    "Premium (PRH)": {
      "4ft (FHP120C-PRH)": 59000000,
      "5ft (FHP150C-PRH)": 70000000,
      "6ft (FHP180C-PRH)": 106000000,
      "8ft (FHP240C-PRH)": 114000000,
    }
  },
  "Laminar Air Flow": {
    "Standard": {
      "LVP120H": 47000000,
    }
  },
  "Wet Scrubber": {
    "Without Blower": {
      "600 x 600 x 1500 mm (FHS601)": 24000000,
      // PERBAIKAN: Ukuran diubah menjadi 850 x 850 sesuai gambar terbaru
      "850 x 850 x 1500 mm (FHS601)": 26000000, 
    }
  }
};

export default function ProductCustomizer({ product, onAddToCart }) {
  const [productType, setProductType] = useState(null);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(product.base_price || 0);

// 2. DETEKSI JENIS PRODUK & SET PILIHAN
  useEffect(() => {
    if (!product || !product.name) return;

    const nameLower = product.name.toLowerCase();
    let type = null;

    // PERBAIKAN: Cek 'scrubber' DULU sebelum 'fume hood'
    // Karena Scrubber juga memiliki kata "Fume Hood" di namanya
    if (nameLower.includes('scrubber')) {
      type = "Wet Scrubber";
    } else if (nameLower.includes('fume hood') || nameLower.includes('lemari asam')) {
      type = "Fume Hood";
    } else if (nameLower.includes('laminar')) {
      type = "Laminar Air Flow";
    }

    if (type && PRICING_DATA[type]) {
      setProductType(type);
      const materials = Object.keys(PRICING_DATA[type]);
      setAvailableMaterials(materials);
      
      const initialMaterial = materials[0];
      setSelectedMaterial(initialMaterial);
      
      const sizes = Object.keys(PRICING_DATA[type][initialMaterial]);
      setAvailableSizes(sizes);
      setSelectedSize(sizes[0]);
    } else {
      setProductType('Other'); // Jika produk lain di luar price list
      setUnitPrice(product.base_price || 0);
    }
  }, [product]);

  // 3. UPDATE UKURAN & HARGA SAAT MATERIAL BERUBAH
  useEffect(() => {
    if (productType !== 'Other' && productType && selectedMaterial) {
      const sizes = Object.keys(PRICING_DATA[productType][selectedMaterial] || {});
      setAvailableSizes(sizes);
      if (!sizes.includes(selectedSize)) {
        setSelectedSize(sizes[0]);
      }
    }
  }, [selectedMaterial, productType]);

  // 4. KALKULASI HARGA REAL-TIME
  useEffect(() => {
    if (productType !== 'Other' && productType && selectedMaterial && selectedSize) {
      const exactPrice = PRICING_DATA[productType][selectedMaterial][selectedSize];
      setUnitPrice(exactPrice || product.base_price || 0);
    }
  }, [selectedMaterial, selectedSize, productType]);

  const handleSubmit = () => {
    const cartItem = {
      product: product,
      material: productType !== 'Other' ? selectedMaterial : '-',
      size: productType !== 'Other' ? selectedSize : '-',
      color: 'Standard', // Default
      quantity: quantity,
      unit_price: unitPrice,
      total_price: unitPrice * quantity,
      notes: ''
    };
    onAddToCart(cartItem);
    
    // Tampilkan feedback visual
    alert(`Berhasil menambahkan ${quantity} unit ${product.name} ke keranjang!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Jika produk dikenali di Price List */}
      {productType !== 'Other' && (
        <div className="space-y-5">
          {/* Pemilihan Spesifikasi / Material */}
          <div>
            <Label className="text-gray-600 mb-2 block">Tipe / Material Spesifikasi</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableMaterials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`py-3 px-4 border rounded-xl text-sm font-semibold transition-all ${
                    selectedMaterial === mat
                      ? 'border-teal-600 bg-teal-50 text-teal-800 shadow-sm ring-1 ring-teal-600'
                      : 'border-gray-200 text-gray-600 hover:border-teal-300 hover:bg-gray-50'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Pemilihan Ukuran */}
          <div>
            <Label className="text-gray-600 mb-2 block">Ukuran / Dimensi</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-3 px-4 border rounded-xl text-sm font-semibold transition-all ${
                    selectedSize === sz
                      ? 'border-teal-600 bg-teal-50 text-teal-800 shadow-sm ring-1 ring-teal-600'
                      : 'border-gray-200 text-gray-600 hover:border-teal-300 hover:bg-gray-50'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pengatur Jumlah (Quantity) */}
      <div className="pt-2 border-t border-gray-100">
        <Label className="text-gray-600 mb-2 block">Jumlah Pesanan</Label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3 hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="w-14 text-center font-bold text-gray-900 text-lg">
              {quantity}
            </div>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-3 hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <span className="text-sm text-gray-500 font-medium">Unit</span>
        </div>
      </div>

      {/* Rangkuman Harga Real-Time */}
      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 font-medium text-sm">Harga Satuan</span>
          <span className="font-semibold text-gray-900">Rp {unitPrice.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <span className="text-gray-800 font-bold">Total Harga</span>
          <span className="text-2xl font-extrabold text-teal-700">
            Rp {(unitPrice * quantity).toLocaleString('id-ID')}
          </span>
        </div>
        <div className="mt-3 text-xs text-gray-500 flex gap-2">
          <Info className="w-4 h-4 flex-shrink-0 text-blue-500" />
          <p>Harga Franco Jakarta. Belum termasuk biaya instalasi pipa ducting (jika &gt; 6m) dan akomodasi luar kota.</p>
        </div>
      </div>

      {/* Tombol Add to Cart */}
      <Button
        onClick={handleSubmit}
        className="w-full h-14 text-lg bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg shadow-teal-600/30 transition-all font-bold"
      >
        <ShoppingCart className="w-6 h-6 mr-2" />
        Masukkan ke Keranjang
      </Button>
    </div>
  );
}