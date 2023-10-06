

    let saldo = 0;
    let count = 1;

    function cekSaldo() {
      alert('Jumlah Saldo Anda : ' + saldo);
    }

    function tambahSaldo() {
      const tambah = prompt('Masukkan Jumlah Saldo yang Ingin Anda Deposit: ');
      if (Number.isInteger(+tambah)) {
        if (+tambah != 0) {
          saldo = +tambah + saldo;
          alert('Anda Berhasil Menambahkan Saldo');
          addToHistory(+tambah, "Deposit Tunai");
        } else {
          alert('Saldo tidak boleh diisikan 0 rupiah');
        }
      } else {
        alert('Saldo Harus Bernilaikan Angka');
      }
      updateSaldo();
    }

    function kurangiSaldo() {
      const kurang = prompt('Masukkan Jumlah Uang yang Ingin Anda Tarik : ');
      if (Number.isInteger(+kurang)) {
        if (saldo >= +kurang) {
          if (+kurang != 0) {
            saldo = saldo - +kurang;
            alert('Berhasil Menarik Uang');
            addToHistory(+kurang, "Penarikkan Tunai");
          } else {
            alert('Inputan tidak boleh 0');
          }
        } else {
          alert('Jumalh Saldo Kamu Kurang ');
        }
      } else {
        alert('Harus Bernilai Numeric');
      }
      updateSaldo();
    }

    function formatDate(date) {
        const options = { day: "numeric", month: "long", year: "numeric" };
        return date.toLocaleDateString("id-ID", options);
      }
      

      function addToHistory(jumlah, jenis) {
        const date = new Date();
        const formattedDate = formatDate(date);
        const formattedAmount = `Rp ${jumlah}`; 
        const historyItem = {
            no: count++,
            date: formattedDate,
            amount: formattedAmount,
            type: jenis,
        };
        displayHistory(historyItem);
      }

    function displayHistory(historyItem) {
      const table = document.getElementById("history");
      const row = table.insertRow(-1);
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      cell1.innerHTML = historyItem.no;
      cell2.innerHTML = historyItem.date;
      cell3.innerHTML = historyItem.amount;
      cell4.innerHTML = historyItem.type;
    }

    function updateSaldo() {
      document.getElementById("saldo").textContent = saldo;
    }


