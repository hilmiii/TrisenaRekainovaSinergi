describe('Pengujian Navigasi Halaman Publik', () => {
  it('Berhasil memuat Halaman Utama (Home)', () => {
    cy.visit('/');
    cy.get('nav').should('be.visible'); // Memastikan navbar muncul
    cy.get('footer').should('be.visible'); // Memastikan footer muncul
  });

  it('Berhasil menavigasi ke halaman Katalog', () => {
    cy.visit('/');
    // Asumsi ada tautan/menu bernama 'Katalog' di navbar
    cy.contains('a', 'Katalog', { matchCase: false }).click();
    cy.url().should('include', '/catalog');
  });

  it('Berhasil menavigasi ke halaman Tentang Kami (About)', () => {
    cy.visit('/');
    cy.contains('a', 'Tentang Kami', { matchCase: false }).click();
    cy.url().should('include', '/about');
  });

  it('Berhasil menavigasi ke halaman Kontak', () => {
    cy.visit('/');
    cy.contains('a', 'Hubungi Kami', { matchCase: false }).click();
    cy.url().should('include', '/contact');
  });
});