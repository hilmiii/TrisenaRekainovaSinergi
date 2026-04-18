describe('Pengujian Fitur Autentikasi', () => {
  beforeEach(() => {
    // 1. Mulai dari halaman utama
    cy.visit('/');
    
    // 2. Klik tombol 'Masuk' yang ada di Header
    // Karena elemennya adalah <Button> yang dibungkus <Link>, kita cari yang mengandung teks 'Masuk'
    cy.contains('Masuk').click();

    // 3. Verifikasi bahwa halaman sudah berpindah ke /login sebelum lanjut ke pengujian
    cy.url().should('include', '/login');
  });

  it('Menampilkan pesan error saat login dengan kredensial salah', () => {
    cy.get('input[type="email"]').type('email.salah@gmail.com');
    cy.get('input[type="password"]').type('passwordsalah123');
    
    // Asumsi tombol submit di form login juga bertuliskan 'Masuk'
    // Gunakan selektor spesifik jika teksnya sama dengan tombol di header
    cy.get('form').contains('button', 'Masuk').click();

    // Sesuaikan teks error ini dengan yang ada di UI Anda
    cy.contains('Email atau Password Salah', { matchCase: false }).should('be.visible'); 
  });

  it('Berhasil login dengan kredensial yang benar', () => {
    cy.get('input[type="email"]').type('hilmiawananggoro189@Gmail.com'); 
    cy.get('input[type="password"]').type('tenetoperasator'); 
    
    cy.get('form').contains('button', 'Masuk').click();

    // Verifikasi diarahkan ke Beranda
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    
    // Verifikasi token tersimpan (tanda sesi aktif)
    cy.window().its('localStorage').invoke('getItem', 'auth_token').should('exist');
  });
});