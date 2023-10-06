class BankAccount {
    constructor(nama, saldo) {
      this.saldo = saldo;
      this.nama = nama;
    }
  
    withdraw(jumlah) {
      try {
        if (!Number.isInteger(jumlah)) {
          throw new Error('Jumlah harus angka');
        }
        if (jumlah > this.saldo) {
          throw new Error('Transaksi Gagal, saldo tidak mencukupi');
        }
        if (jumlah === 0) {
          throw new Error('Jumlah harus lebih dari 0');
        }
        const saldoSebelumnya = this.saldo;
        this.saldo -= jumlah;
        setTimeout(() => {
          alert(`Penarikan berhasil dengan saldo sebesar ${jumlah} dari ${saldoSebelumnya}`);
        }, 1500);
      } catch (error) {
        alert(error.message);
      }
    }
  
    deposit(jumlah) {
      try {
        if (!Number.isInteger(jumlah)) {
          throw new Error('Jumlah harus berupa angka');
        }
        if (jumlah === 0) {
          throw new Error('Jumlah harus lebih dari 0');
        }
        this.saldo += jumlah;
        setTimeout(() => {
          alert(`Berhasil mendeposit saldo sebesar ${jumlah}`);
        }, 1500);
      } catch (error) {
        alert(error.message);
      }
    }
  
    cekSaldo() {
      alert(`Saldo ${this.nama} saat ini adalah ${this.saldo}`);
    }
  }
  
  const objek1 = new BankAccount('IJK', 100000);
  let isRunning = true;
  
  while (isRunning) {
    alert('1. Withdraw\n2. Deposit\n3. Cek Saldo\n4. Keluar');
    let pilihan = prompt('Masukkan pilihan menu: ');
  
    switch (parseInt(pilihan)) {
      case 1:
        let jumlahTarik = prompt('Masukkan jumlah saldo yang ingin ditarik: ');
        objek1.withdraw(parseInt(jumlahTarik));
        break;
      case 2:
        let jumlahDeposit = prompt('Masukkan jumlah saldo yang ingin didepositkan: ');
        objek1.deposit(parseInt(jumlahDeposit));
        break;
      case 3:
        objek1.cekSaldo();
        break;
      case 4:
        isRunning = false;
        break;
      default:
        alert('Pilihan Menu tidak valid!');
    }
  }
  
  setTimeout(() => {
    objek1.cekSaldo();
  }, 1500); 
  