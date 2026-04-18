describe('Customer E2E Flow: Journey Lengkap dari Login ke Checkout', () => {
  
  it('Berhasil melakukan alur belanja lengkap melalui antarmuka pengguna', () => {
    // 1. Mulai dari Halaman Utama
    cy.visit('/');

    // 2. Alur Login Manual (karena visit /login langsung dilarang/404)
    cy.contains('Masuk').click();
    cy.url().should('include', '/login');
    
    cy.get('input[type="email"]').type('hilmiawananggoro189@Gmail.com');
    cy.get('input[type="password"]').type('tenetoperasator');
    cy.get('form').contains('button', 'Masuk').click();

    // Pastikan kembali ke Home setelah login
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // 3. Navigasi ke Katalog melalui Header
    // Mencari link 'Katalog' di dalam komponen Header
    cy.get('nav').contains('Katalog').click();
    cy.url().should('include', '/catalog');

    // 4. Pilih Produk pertama di Katalog
    // Mengklik link produk yang dihasilkan oleh ProductCard
    cy.get('a[href^="/product/"]').first().click();
    cy.url().should('include', '/product/');

    // 5. Tambahkan ke Keranjang
    cy.contains('button', 'Masukkan ke Keranjang').click();

    // Verifikasi Alert Berhasil
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Berhasil');
    });

    // 6. Buka Drawer Keranjang melalui Icon di Header
    // Menggunakan selektor data-cy yang sudah Anda siapkan sebelumnya
    cy.get('[data-cy="tombol-keranjang-header"]').click({ force: true });

    // 7. Klik tombol Checkout di dalam Drawer
    // Tombol ini terdapat dalam komponen CartDrawer
    cy.contains('button', 'Checkout').click();
    cy.url().should('include', '/checkout');

    // 8. Proses Pesanan di Halaman Checkout
    // Menekan tombol final yang ada di Pages/Checkout.jsx
    cy.contains('button', 'Proses Pesanan Sekarang').click();

    // 9. Verifikasi Akhir
    cy.contains('Pesanan Berhasil!').should('be.visible');
    cy.contains('Nomor Pesanan Anda:').should('be.visible');
  });
});