describe('Pengujian Fitur Autentikasi', () => {
  describe('Pengujian Registrasi', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.contains('button', 'Masuk', { timeout: 10000 }).click();
      cy.url().should('include', '/login');
      cy.contains('a', 'Daftar sekarang', { timeout: 10000 }).click();
      cy.url().should('include', '/register');
    });

    it('Menampilkan validasi saat form registrasi kosong', () => {
      cy.get('form').submit();
      
      cy.get('input[name="name"]').then(($input) => {
        expect($input[0].validity.valueMissing).to.be.true;
      });
      
      cy.get('input[name="email"]').then(($input) => {
        expect($input[0].validity.valueMissing).to.be.true;
      });
      
      cy.get('input[name="password"]').then(($input) => {
        expect($input[0].validity.valueMissing).to.be.true;
      });
      
      cy.get('input[name="password_confirmation"]').then(($input) => {
        expect($input[0].validity.valueMissing).to.be.true;
      });
    });

    it('Menampilkan validasi saat password dan konfirmasi password tidak cocok', () => {
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="password_confirmation"]').type('password456');
      cy.get('form').submit();
      
      cy.contains('Konfirmasi password tidak cocok!', { timeout: 5000 }).should('be.visible');
      cy.url().should('include', '/register');
      cy.window().its('localStorage').invoke('getItem', 'auth_token').should('not.exist');
    });

    it('Menampilkan error saat registrasi dengan email yang sudah terdaftar', () => {
      cy.get('input[name="name"]').type('Rizky Hilmiawan Anggoro');
      cy.get('input[name="email"]').type('hilmiawananggoro189@gmail.com');
      cy.get('input[name="password"]').type('Tenetoperasator_180903');
      cy.get('input[name="password_confirmation"]').type('Tenetoperasator_180903');
      cy.get('form').submit();
      
      cy.contains('The email has already been taken.', { timeout: 5000 }).should('be.visible');
      cy.url().should('include', '/register');
      cy.window().its('localStorage').invoke('getItem', 'auth_token').should('not.exist');
    });

    it('Berhasil registrasi dengan akun baru', () => {
      const timestamp = Date.now();
      const uniqueEmail = `caileespaeny@gmail.com`;
      
      cy.get('input[name="name"]').type('Cailee Spaeny');
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('input[name="password"]').type('beautycailee');
      cy.get('input[name="password_confirmation"]').type('beautycailee');
      cy.get('form').submit();
      
      cy.url({ timeout: 10000 }).should('not.include', '/register');
      cy.url().should('not.include', '/login');
      
      cy.window().its('localStorage').invoke('getItem', 'auth_token').should('exist');
      
      cy.contains('button', 'Masuk').should('not.exist');
      cy.contains('a', 'Profil').should('be.visible');
    });

    it('Menampilkan validasi saat email tidak valid', () => {
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="password_confirmation"]').type('password123');
      cy.get('form').submit();
      
      cy.get('input[name="email"]').then(($input) => {
        expect($input[0].validity.typeMismatch).to.be.true;
      });
    });
  });

  describe('Pengujian Login', () => {
    beforeEach(() => {
      cy.visit('/');   
      cy.contains('button', 'Masuk', { timeout: 10000 }).click();
      cy.url().should('include', '/login');
    });

    it('Menampilkan pesan error saat login dengan kredensial salah', () => {
      cy.get('input[type="email"]').type('email.salah@gmail.com');
      cy.get('input[type="password"]').type('passwordsalah123');   
      cy.get('form').submit();   
      cy.contains('Email atau Password Salah', { matchCase: false, timeout: 10000 }).should('be.visible');
      cy.url().should('include', '/login');
      cy.window().its('localStorage').invoke('getItem', 'auth_token').should('not.exist');
    });

    it('Berhasil login dengan kredensial user yang benar', () => {
      cy.get('input[type="email"]').clear().type('hilmiawananggoro189@gmail.com');
      cy.get('input[type="password"]').clear().type('Tenetoperasator_180903');   
      cy.get('form').submit();   
      cy.url({ timeout: 15000 }).should('not.include', '/login');   
      cy.window({ timeout: 10000 })
        .its('localStorage')
        .invoke('getItem', 'auth_token')
        .should('exist');
      
      cy.get('body', { timeout: 10000 }).should('exist');
      cy.contains('button', 'Masuk').should('not.exist');
    });

    it('Berhasil login dengan kredensial admin yang benar', () => {
      cy.get('input[type="email"]').clear().type('andyfajar76@gmail.com');
      cy.get('input[type="password"]').clear().type('Anggoro_76');
      
      cy.get('form').submit();
      
      cy.url({ timeout: 15000 }).should('not.include', '/login');
      
      cy.window({ timeout: 10000 })
        .its('localStorage')
        .invoke('getItem', 'auth_token')
        .should('exist');
      cy.get('body', { timeout: 10000 }).should('exist');
    });

    it('Menampilkan validasi saat email kosong', () => {
      cy.get('input[type="email"]').clear();
      cy.get('input[type="password"]').type('password123');
      cy.get('form').submit();
      
      cy.get('input[type="email"]').then(($input) => {
        const input = $input[0];
        expect(input.validity.valueMissing).to.be.true;
      });
    });

    it('Menampilkan validasi saat password kosong', () => {
      cy.get('input[type="email"]').clear().type('email@test.com');
      cy.get('input[type="password"]').clear();
      cy.get('form').submit();
      
      cy.get('input[type="password"]').then(($input) => {
        const input = $input[0];
        expect(input.validity.valueMissing).to.be.true;
      });
    });

    it('Tidak bisa mengakses halaman dashboard tanpa login - redirect ke 404', () => {
      cy.clearLocalStorage();   
      cy.visit('/dashboard', { failOnStatusCode: false });
      cy.url({ timeout: 10000 });
      cy.get('h1').should('contain', '404');
      cy.contains('Halaman tidak ditemukan', { timeout: 5000 }).should('be.visible');
      cy.window().its('localStorage').invoke('getItem', 'auth_token').should('not.exist');
    });

describe('Customer E2E Flow dengan Edit Profil', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('button', 'Masuk', { timeout: 10000 }).click();
    cy.get('input[type="email"]').clear().type('caileespaeny@gmail.com');
    cy.get('input[type="password"]').clear().type('beautycailee');
    cy.get('form').submit();
    cy.url({ timeout: 10000 }).should('not.include', '/login');
  });

  it('Berhasil mengakses halaman profil', () => {
    cy.get('a[href="/profile"]', { timeout: 10000 }).click();
    cy.url({ timeout: 10000 }).should('include', '/profile');
    cy.contains('h1', 'Profil Saya', { timeout: 5000 }).should('be.visible');
  });

  it('Berhasil membuka form edit profil', () => {
    cy.get('a[href="/profile"]', { timeout: 10000 }).click();
    cy.url().should('include', '/profile');
    
    cy.contains('button', 'Edit Profil', { timeout: 5000 }).click();
    
    cy.get('input[value="Cailee Spaeny"]', { timeout: 5000 }).should('be.visible');
    cy.get('input[placeholder="Contoh: 08123456789"]').should('be.visible');
    cy.get('input[placeholder="Nama kampus/perusahaan"]').should('be.visible');
    cy.get('input[placeholder="Detail alamat pengiriman"]').should('be.visible');
    cy.contains('button', 'Simpan Perubahan').should('be.visible');
    cy.contains('button', 'Batal').should('be.visible');
  });

  it('Berhasil mengisi nomor telepon, instansi, dan alamat', () => {
    cy.get('a[href="/profile"]', { timeout: 10000 }).click();
    cy.url().should('include', '/profile');
    
    cy.contains('button', 'Edit Profil').click();
    
    cy.get('input[placeholder="Contoh: 08123456789"]').clear().type('081234567890');
    cy.get('input[placeholder="Nama kampus/perusahaan"]').clear().type('PT. Test Company');
    cy.get('input[placeholder="Detail alamat pengiriman"]').clear().type('Jl. Test Address No. 123');
    
    cy.contains('button', 'Simpan Perubahan').click();
    
    cy.wait(2000);
    
    cy.contains('p', '081234567890', { timeout: 5000 }).should('be.visible');
    cy.contains('p', 'PT. Test Company').should('be.visible');
    cy.contains('p', 'Jl. Test Address No. 123').should('be.visible');
  });

  it('Berhasil membatalkan edit profil', () => {
    cy.get('a[href="/profile"]', { timeout: 10000 }).click();
    cy.url().should('include', '/profile');
    
    cy.contains('button', 'Edit Profil').click();
    
    cy.get('input[placeholder="Contoh: 08123456789"]').clear().type('089876543210');
    cy.get('input[placeholder="Nama kampus/perusahaan"]').clear().type('PT. Cancel Test');
    cy.get('input[placeholder="Detail alamat pengiriman"]').clear().type('Jl. Cancel Address');
    
    cy.contains('button', 'Batal').click();
    
    cy.wait(1000);
    
    cy.contains('button', 'Edit Profil').should('be.visible');
  });
});

    it('Logout berfungsi dengan baik', () => {
      cy.get('input[type="email"]').clear().type('hilmiawananggoro189@gmail.com');
      cy.get('input[type="password"]').clear().type('Tenetoperasator_180903');
      cy.get('form').submit();
      
      cy.url({ timeout: 10000 }).should('not.include', '/login');
      
      cy.contains('a', 'Profil', { timeout: 10000 }).click();
      
      cy.url({ timeout: 10000 }).should('include', '/profile');
      
      cy.contains('button', 'Keluar Akun', { timeout: 10000 }).click();
      
      cy.window().its('localStorage').invoke('getItem', 'auth_token').should('not.exist');
      
      cy.url({ timeout: 10000 }).should('not.include', '/profile');
      cy.url().should('not.include', '/login');
    });
  });
});