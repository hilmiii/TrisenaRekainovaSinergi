import React, { useState } from 'react';
import { Button } from './src/Components/ui/button';
import { Label } from './src/Components/ui/label';
import { Textarea } from './src/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './src/Components/ui/select';
import { Input } from './src/Components/ui/input';
import { ShoppingCart, Check, Package, Ruler, Palette, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductCustomizer({ product, onAddToCart }) {
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!selectedMaterial || !selectedSize || !selectedColor) {
      return;
    }
    
    const cartItem = {
      product,
      material: selectedMaterial,
      size: selectedSize,
      color: selectedColor,
      quantity,
      notes,
      addedAt: new Date().toISOString()
    };
    
    onAddToCart(cartItem);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isValid = selectedMaterial && selectedSize && selectedColor;

  return (
    <div className="space-y-6">
      {/* Material Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-gray-700 font-medium">
          <Layers className="w-4 h-4 text-teal-500" />
          Material Konstruksi
        </Label>
        <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
          <SelectTrigger className="w-full h-12 border-gray-200 focus:ring-teal-500">
            <SelectValue placeholder="Pilih material..." />
          </SelectTrigger>
          <SelectContent>
            {product.materials?.map((material) => (
              <SelectItem key={material} value={material}>
                {material}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Size Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-gray-700 font-medium">
          <Ruler className="w-4 h-4 text-teal-500" />
          Ukuran (P x L x T)
        </Label>
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="w-full h-12 border-gray-200 focus:ring-teal-500">
            <SelectValue placeholder="Pilih ukuran..." />
          </SelectTrigger>
          <SelectContent>
            {product.sizes?.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-gray-700 font-medium">
          <Palette className="w-4 h-4 text-teal-500" />
          Warna Finishing
        </Label>
        <Select value={selectedColor} onValueChange={setSelectedColor}>
          <SelectTrigger className="w-full h-12 border-gray-200 focus:ring-teal-500">
            <SelectValue placeholder="Pilih warna..." />
          </SelectTrigger>
          <SelectContent>
            {product.colors?.map((color) => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-gray-700 font-medium">
          <Package className="w-4 h-4 text-teal-500" />
          Jumlah Unit
        </Label>
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="h-12 border-gray-200 focus:ring-teal-500"
        />
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label className="text-gray-700 font-medium">
          Spesifikasi & Catatan Tambahan
        </Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tuliskan spesifikasi khusus atau permintaan tambahan untuk produk laboratorium Anda..."
          className="min-h-[120px] border-gray-200 focus:ring-teal-500 resize-none"
        />
        <p className="text-xs text-gray-500">
          Contoh: kebutuhan voltase listrik khusus, aksesoris tambahan, modifikasi desain, dll.
        </p>
      </div>

      {/* Add to Cart Button */}
      <AnimatePresence mode="wait">
        <motion.div
          key={added ? 'added' : 'default'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Button
            onClick={handleAddToCart}
            disabled={!isValid}
            className={`w-full h-14 text-lg font-semibold transition-all duration-300 ${
              added 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-teal-600 hover:bg-teal-700'
            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Ditambahkan ke Keranjang!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Masukkan ke Keranjang
              </>
            )}
          </Button>
        </motion.div>
      </AnimatePresence>

      {!isValid && (
        <p className="text-sm text-amber-600 text-center">
          * Pilih material, ukuran, dan warna terlebih dahulu
        </p>
      )}
    </div>
  );
}