describe('Customer E2E Flow: Login to Checkout', () => {
  // Sebelum setiap test, set state agar Cypress tahu kita mulai dari mana
  beforeEach(() => {
    // Kunjungi halaman login
    cy.visit('/login');
  });

  it('Berhasil melakukan login dengan kredensial yang benar', () => {
    cy.get('input[type="email"]').type('hilmiawananggoro189@Gmail.com'); // Sesuaikan email di DB Anda
    cy.get('input[type="password"]').type('tenetoperasator'); // Sesuaikan password
    cy.contains('button', 'Masuk').click();

    // Verifikasi diarahkan ke Beranda
    cy.url().should('include', '/');
    // Verifikasi token tersimpan
    cy.window().its('localStorage').invoke('getItem', 'auth_token').should('exist');
  });

it('Berhasil menambahkan produk ke keranjang dan Checkout', () => {
    // Login Programmatis
    cy.window().then((win) => {
      win.localStorage.setItem('auth_token', 'dummy-token-for-test'); 
    });

    // 1. Pergi ke Katalog
    cy.visit('/catalog');
    
    // 2. Klik produk pertama yang muncul
    cy.get('a[href^="/product/"]').first().click();

    // 3. Di halaman detail, klik tombol Masukkan Keranjang
    cy.contains('button', 'Masukkan ke Keranjang').click();

    // Tangkap alert
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Berhasil');
    });

    cy.wait(500); 

    // 4. Klik tombol Keranjang di Header (GUNAKAN FORCE: TRUE)
    cy.get('[data-cy="tombol-keranjang-header"]').click({ force: true });

    // 5. Verifikasi Drawer Keranjang Terbuka
    cy.contains('Keranjang Pesanan').should('be.visible');

    // 6. Klik tombol Checkout di dalam Drawer
    cy.contains('button', 'Checkout').click();

    // 7. Verifikasi berada di halaman Checkout
    cy.url().should('include', '/checkout');

    // 8. Proses Pesanan
    cy.contains('button', 'Proses Pesanan Sekarang').click();

    // 9. Verifikasi Pesanan Berhasil
    cy.contains('Pesanan Berhasil!').should('be.visible');
    cy.contains('Nomor Pesanan Anda:').should('be.visible');
  });
});