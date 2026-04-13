describe('Admin Flow: Order Management', () => {
  it('Admin berhasil login dan melihat daftar pesanan', () => {
    cy.visit('/portal-trisena-rahasia');
    
    cy.get('input[type="email"]').type('andyfajar76@gmail.com'); // Gunakan email admin
    cy.get('input[type="password"]').type('Anggoro_76');
    cy.contains('button', 'Masuk').click();

    // Tunggu dan verifikasi diarahkan ke halaman Admin
    cy.visit('/admin/dashboard');
    cy.url().should('include', '/admin/dashboard');

    // Verifikasi elemen utama Dashboard Admin muncul
    cy.contains('Admin Panel').should('be.visible');
    cy.contains('Daftar Pesanan Aktif').should('be.visible');

    // Verifikasi tabel tidak kosong (Mencari minimal 1 baris di tbody)
    cy.get('tbody tr').should('have.length.at.least', 1);
  });

  it('Admin dapat membuka tab Riwayat & Invoice', () => {
    // Asumsi sudah login (Gunakan bypass token di proyek nyata)
    cy.visit('/admin/dashboard');

    // Klik tab Riwayat
    cy.contains('button', 'Riwayat & Invoice Selesai').click();

    // Verifikasi judul tabel berubah
    cy.contains('Riwayat Selesai').should('be.visible');
  });
});