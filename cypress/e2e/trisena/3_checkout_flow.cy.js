describe('Customer E2E Flow dengan My Orders dan Riwayat Pembelian', () => {
  
  describe('Validasi My Orders Saat Belum Ada Pesanan', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.contains('button', 'Masuk', { timeout: 10000 }).click();
      cy.get('input[type="email"]').clear().type('hilmiawananggoro189@gmail.com');
      cy.get('input[type="password"]').clear().type('Tenetoperasator_180903');
      cy.get('form').submit();
      cy.url({ timeout: 10000 }).should('not.include', '/login');
    });

    it('Menampilkan pesan kosong saat belum ada pesanan', () => {
      cy.get('a[title="Pesanan Saya"]', { timeout: 10000 }).click();
      cy.url().should('include', '/my-orders');
      
      cy.contains('Belum ada pesanan', { timeout: 5000 }).should('be.visible');
      cy.contains('Mulai Belanja', { timeout: 5000 }).should('be.visible');
    });
  });

  describe('Validasi My Orders Setelah Membuat Pesanan', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.contains('button', 'Masuk', { timeout: 10000 }).click();
      cy.get('input[type="email"]').clear().type('hilmiawananggoro189@gmail.com');
      cy.get('input[type="password"]').clear().type('Tenetoperasator_180903');
      cy.get('form').submit();
      cy.url({ timeout: 10000 }).should('not.include', '/login');

      cy.get('nav').contains('Katalog Produk').click();
      cy.get('a[href^="/product/"]').first().click({ force: true });
      
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Berhasil');
      });
      cy.contains('button', 'Masukkan ke Keranjang').click();
      
      cy.get('[data-cy="tombol-keranjang-header"]').click({ force: true });
      cy.contains('button', 'Checkout').click();
      cy.contains('button', 'Proses Pesanan Sekarang').click();
      cy.contains('Pesanan Berhasil!', { timeout: 15000 }).should('be.visible');
      
      cy.contains('button', 'Kembali ke Beranda').click();
      cy.wait(1000);
    });

    it('Berhasil mengakses halaman My Orders dan menampilkan nomor pesanan yang diawali TRS', () => {
      cy.get('a[title="Pesanan Saya"]', { timeout: 10000 }).click();
      cy.url({ timeout: 10000 }).should('include', '/my-orders');
      
      cy.contains('p', /^TRS-/, { timeout: 10000 }).should('be.visible');
    });

    it('Berhasil mengakses tab Riwayat Pembelian di halaman My Orders', () => {
      cy.get('a[title="Pesanan Saya"]', { timeout: 10000 }).click();
      cy.url({ timeout: 10000 }).should('include', '/my-orders');
      
      cy.contains('button', 'Riwayat Pembelian', { timeout: 10000 }).click();
    });

    it('Menampilkan badge jumlah pesanan di icon Pesanan Saya', () => {
      cy.get('a[title="Pesanan Saya"] span', { timeout: 10000 }).should('be.visible');
    });

    it('Membuat pesanan, lalu verifikasi detail pesanan di My Orders', () => {
      cy.get('a[title="Pesanan Saya"]').click();
      cy.url().should('include', '/my-orders');
      
      cy.contains('p', /^TRS-/, { timeout: 10000 }).click();
      
      cy.contains('Total Pembayaran', { timeout: 5000 }).should('be.visible');
    });
  });

  describe('Validasi Multiple Orders di My Orders', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.contains('button', 'Masuk', { timeout: 10000 }).click();
      cy.get('input[type="email"]').clear().type('hilmiawananggoro189@gmail.com');
      cy.get('input[type="password"]').clear().type('Tenetoperasator_180903');
      cy.get('form').submit();
      cy.url({ timeout: 10000 }).should('not.include', '/login');
    });

    it('Membuat 2 pesanan dan verifikasi keduanya muncul di My Orders', () => {
      const orderNumbers = [];
      
      for (let i = 1; i <= 2; i++) {
        cy.get('nav').contains('Katalog Produk').click();
        cy.get('a[href^="/product/"]').first().click({ force: true });
        
        cy.on('window:alert', (text) => {
          expect(text).to.contains('Berhasil');
        });
        cy.contains('button', 'Masukkan ke Keranjang').click();
        
        cy.get('[data-cy="tombol-keranjang-header"]').click({ force: true });
        cy.contains('button', 'Checkout').click();
        cy.contains('button', 'Proses Pesanan Sekarang').click();
        
        cy.contains('Pesanan Berhasil!', { timeout: 15000 }).should('be.visible');
        
        cy.contains('Nomor Pesanan Anda:').invoke('text').then((text) => {
          const orderNumber = text.replace('Nomor Pesanan Anda:', '').trim();
          orderNumbers.push(orderNumber);
        });
        
        if (i < 2) {
          cy.contains('button', 'Kembali ke Beranda').click();
          cy.wait(1000);
        }
      }
      
      cy.contains('button', 'Kembali ke Beranda').click();
      cy.wait(1000);
      
      cy.get('a[title="Pesanan Saya"]').click();
      cy.url().should('include', '/my-orders');
      
      for (const orderNumber of orderNumbers) {
        cy.contains('p', orderNumber, { timeout: 5000 }).should('be.visible');
      }
    });
  });
});