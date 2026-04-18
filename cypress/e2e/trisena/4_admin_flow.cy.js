// admin_flow.cy.js - Desktop Version dengan semua selector yang akurat
describe('Admin E2E Flow - Desktop View: Fitur Spesifik Dashboard (Modal & Status)', () => {
  
  beforeEach(() => {
    // Set viewport ke ukuran desktop
    cy.viewport(1280, 720);
    
    // Intercept API calls
    cy.intercept('GET', '**/api/admin/orders').as('getOrders');
    cy.intercept('PUT', '**/api/admin/orders/*/status').as('updateStatus');

    cy.visit('/');
    cy.get('header').contains('Masuk').click();
    cy.get('input[type="email"]').type('andyfajar76@Gmail.com');
    cy.get('input[type="password"]').type('Anggoro_76');
    cy.get('form').contains('button', 'Masuk').click();
    cy.get('header').contains('Dashboard Admin', { timeout: 10000 }).should('be.visible').click();
    cy.url().should('include', '/admin/dashboard');

    // Wait for initial orders to load
    cy.wait('@getOrders', { timeout: 10000 });
  });

  it('Berhasil mengubah status ke Dikirim dengan menginput Resi Pengiriman', () => {
    // Pastikan di tab Pesanan Aktif
    cy.contains('Pesanan Aktif').click();

    // Tunggu tabel desktop memiliki data
    cy.get('tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);

    // Klik dropdown status di baris pertama
    cy.get('tbody tr').first().find('button.w-36').click();

    // Pilih opsi 'Dikirim'
    cy.contains('.cursor-pointer', 'Dikirim').click();

    // Verifikasi Modal Input Resi Terbuka
    cy.contains('Input Resi Pengiriman', { timeout: 5000 }).should('be.visible');

    // Isi form ekspedisi
    cy.get('input[placeholder="Contoh: JNE, Deliveree, Sicepat…"]').type('JNE Reguler');
    
    // Isi form nomor resi - menggunakan placeholder yang tepat
    cy.get('input[placeholder="Masukkan nomor resi…"]').type('JP1234567890');

    // Submit resi
    cy.contains('button', 'Simpan & Kirim').click();

    // Tunggu API call dan pastikan modal tertutup
    cy.wait('@updateStatus', { timeout: 5000 });
    cy.contains('Input Resi Pengiriman').should('not.exist');
  });

  it('Berhasil menyelesaikan pesanan melalui konfirmasi modal', () => {
    cy.contains('Pesanan Aktif').click();
    cy.get('tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);

    // Buka dropdown status
    cy.get('tbody tr').first().find('button.w-36').click();

    // Pilih opsi 'Selesai'
    cy.contains('.cursor-pointer', 'Selesai').click();

    // Verifikasi AlertDialog Konfirmasi Terbuka
    cy.contains('Konfirmasi Penyelesaian', { timeout: 5000 }).should('be.visible');

    // Klik tombol konfirmasi
    cy.contains('button', 'Iya, Selesaikan').click();

    // Tunggu API call
    cy.wait('@updateStatus', { timeout: 5000 });
    
    // Pastikan dialog tertutup
    cy.contains('Konfirmasi Penyelesaian').should('not.exist');
  });

  it('Berhasil membuka Invoice pada tab Riwayat', () => {
    // Pindah ke tab Riwayat & Invoice
    cy.contains('button', 'Riwayat & Invoice').click();

    // Verifikasi header berubah
    cy.contains('Riwayat Transaksi').should('be.visible');

    // Tunggu data riwayat termuat
    cy.get('tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);

    // Klik tombol Invoice di baris pertama
    cy.get('tbody tr').first().contains('button', 'Invoice').click();

    // Verifikasi Modal Invoice terbuka
    cy.contains('INVOICE', { timeout: 5000 }).should('be.visible');
    cy.contains('PT. Trisena Rekainova Sinergi').should('be.visible');

    // Tutup Invoice
    cy.contains('button', 'Tutup').click();
    
    // Pastikan modal tertutup
    cy.contains('INVOICE').should('not.exist');
  });
});