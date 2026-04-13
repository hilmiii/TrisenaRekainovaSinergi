// src/utils/pricingConfig.js

export const PRICING_MATRIX = {
  "Fume Hood FHP Series": {
    "Standard (HPL)": {
      "4ft (120cm)": 47000000,
      "5ft (150cm)": 58000000,
      "6ft (180cm)": 84000000,
      "8ft (240cm)": 92000000,
    },
    "Medium (SCR)": {
      "4ft (120cm)": 50000000,
      "5ft (150cm)": 62000000,
      "6ft (180cm)": 89000000,
      "8ft (240cm)": 98000000,
    },
    "Premium (PRH)": {
      "4ft (120cm)": 59000000,
      "5ft (150cm)": 70000000,
      "6ft (180cm)": 106000000,
      "8ft (240cm)": 114000000,
    }
  },
  "Laminar Air Flow": {
    "Standard": {
      "LVP120H": 47000000,
    }
  },
  "Wet Scrubber System": {
    "Without Blower": {
      "600 x 600 x 1500 mm": 24000000,
      // Catatan: Di PDF tertulis 50mm, kemungkinan typo dari 750mm. Saya gunakan 750mm.
      "750 x 850 x 1500 mm": 26000000, 
    }
  }
};

// Fungsi pembantu untuk mengambil harga dengan aman
export const getExactPrice = (productName, material, size) => {
  try {
    const price = PRICING_MATRIX[productName][material][size];
    return price || 0; // Kembalikan 0 jika kombinasi tidak ditemukan
  } catch (error) {
    return 0;
  }
};