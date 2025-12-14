// ===========================================
// 1. KONFIGURASI GOOGLE APPS SCRIPT
// Ganti URL di bawah ini dengan URL Deployment Anda!
// ===========================================
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzn06KlDm3fCQ4rdRMXt38acytuSYPYMak5cdC_EpE4mbg4sT5rzfKy9bxBe32-RiA9VQ/exec';

// Variabel Global
let namaSiswa = '';
let skor = 0;
let jawabanPengguna = []; 

// ===========================================
// 2. DATA SOAL (10 PG + 5 URAIAN)
// ===========================================
const dataSoal = [
    // --- 10 SOAL PILIHAN GANDA ---
    {
        tipe: 'pg',
        soal: "Bentuk penjumlahan berulang dari 3 × 5 adalah...",
        pilihan: ["3 + 5", "5 + 5 + 5", "3 + 3 + 3 + 3 + 3", "5 + 3"],
        jawaban: "5 + 5 + 5"
    },
    {
        tipe: 'pg',
        soal: "4 + 4 + 4 + 4 + 4 jika diubah ke bentuk perkalian menjadi...",
        pilihan: ["4 × 4", "5 × 4", "4 × 5", "5 + 4"],
        jawaban: "5 × 4"
    },
    {
        tipe: 'pg',
        soal: "Terdapat 2 piring, setiap piring berisi 6 apel. Kalimat matematikanya adalah...",
        pilihan: ["6 × 2", "2 + 6", "2 × 6", "6 + 2"],
        jawaban: "2 × 6"
    },
    {
        tipe: 'pg',
        soal: "Hasil dari 3 × 7 adalah...",
        pilihan: ["10", "14", "21", "24"],
        jawaban: "21"
    },
    {
        tipe: 'pg',
        soal: "Berapa kali angka 9 dijumlahkan jika perkaliannya 5 × 9?",
        pilihan: ["4 kali", "9 kali", "5 kali", "59 kali"],
        jawaban: "5 kali"
    },
    {
        tipe: 'pg',
        soal: "Jika 8 × 2, maka penjumlahan berulangnya adalah...",
        pilihan: ["8 + 8", "2 + 2 + 2 + 2 + 2 + 2 + 2 + 2", "16", "8 + 2"],
        jawaban: "2 + 2 + 2 + 2 + 2 + 2 + 2 + 2"
    },
    {
        tipe: 'pg',
        soal: "Kalimat perkalian yang benar untuk 6 + 6 adalah...",
        pilihan: ["6 × 6", "2 × 6", "6 × 2", "12"],
        jawaban: "2 × 6"
    },
    {
        tipe: 'pg',
        soal: "Ada 4 kotak, setiap kotak isi 5 pensil. Total pensil adalah...",
        pilihan: ["20", "9", "25", "15"],
        jawaban: "20"
    },
    {
        tipe: 'pg',
        soal: "Hasil dari 6 × 4 adalah...",
        pilihan: ["20", "24", "28", "30"],
        jawaban: "24"
    },
    {
        tipe: 'pg',
        soal: "Hasil dari 10 × 8 adalah...",
        pilihan: ["18", "80", "108", "81"],
        jawaban: "80"
    },

    // --- 5 SOAL URAIAN SINGKAT ---
    {
        tipe: 'uraian',
        soal: "Tuliskan hasil dari 6 × 5!",
        jawaban: "30"
    },
    {
        tipe: 'uraian',
        soal: "Ada 3 kandang, setiap kandang berisi 4 ayam. Berapa total ayam?",
        jawaban: "12"
    },
    {
        tipe: 'uraian',
        soal: "Berapa hasil dari 9 × 5?",
        jawaban: "45"
    },
    {
        tipe: 'uraian',
        soal: "Jika 2 × A = 14, berapakah nilai A?",
        jawaban: "7"
    },
    {
        tipe: 'uraian',
        soal: "Berapa hasil dari 7 × 4?",
        jawaban: "28"
    }
];

// ===========================================
// 3. FUNGSI NAVIGASI & TTS
// ===========================================

function tampilkanHalaman(idHalaman) {
    const semuaHalaman = document.querySelectorAll('.halaman');
    semuaHalaman.forEach(halaman => {
        halaman.classList.remove('aktif');
    });

    const halamanAktif = document.getElementById(idHalaman);
    if (halamanAktif) {
        halamanAktif.classList.add('aktif');
        if (idHalaman !== 'halaman-menu') {
            TextToSpeech(halamanAktif.querySelector('h2').textContent);
        }
    }
    
    if (idHalaman === 'halaman-latihan') {
        muatLatihanSoal();
    }
}

function TextToSpeech(teks) {
    if ('speechSynthesis' in window) {
        // Hentikan suara sebelumnya jika ada
        window.speechSynthesis.cancel(); 
        const utterance = new SpeechSynthesisUtterance(teks);
        utterance.lang = 'id-ID'; 
        utterance.rate = 1.0; 
        window.speechSynthesis.speak(utterance);
    } else {
        console.warn("Browser tidak mendukung Web Speech API.");
    }
}

// Fungsi Navigasi dengan Pengecekan Nama
function navigasiDanCekNama(idHalaman) {
    const inputNama = document.getElementById('input-nama');
    const nama = inputNama ? inputNama.value.trim() : '';
    
    if (!nama) {
        alert("🚨 Harap masukkan namamu dulu ya sebelum mulai!");
        TextToSpeech("Harap masukkan namamu dulu ya sebelum mulai!");
        inputNama.focus();
        return;
    }
    namaSiswa = nama;
    tampilkanHalaman(idHalaman);
}

// ===========================================
// 4. FUNGSI SIMULASI (DIBATASI 1-10)
// ===========================================

function MulaiSimulasi() {
    let A = parseInt(document.getElementById('inputA').value);
    let B = parseInt(document.getElementById('inputB').value);
    
    const visualContainer = document.getElementById('visualisasi-simulasi');
    const teksPerhitungan = document.getElementById('teks-perhitungan');

    // VALIDASI KHUSUS FASE A (Maksimal input 10)
    if (isNaN(A) || isNaN(B) || A < 1 || B < 1 || A > 10 || B > 10) {
        visualContainer.innerHTML = `
            <div style="color: red; padding: 20px; border: 2px dashed red; border-radius: 10px; background: #fff0f0;">
                <p>⚠️ <strong>Ups! Angkanya kebesaran!</strong></p>
                <p>Ingat ya, untuk Fase A kita belajar angka <strong>1 sampai 10</strong> saja.</p>
                <p>Supaya hasilnya tidak lebih dari 100.</p>
            </div>
        `;
        teksPerhitungan.innerHTML = ""; 
        TextToSpeech("Ups! Angkanya cuma boleh satu sampai sepuluh ya! Coba lagi.");
        return; 
    }

    const total = A * B;
    let penjumlahanTeks = "";
    
    // Logic Penjumlahan Berulang
    for (let i = 0; i < A; i++) {
        penjumlahanTeks += B;
        if (i < A - 1) {
            penjumlahanTeks += " + ";
        }
    }

    // Render Teks
    teksPerhitungan.innerHTML = `
        <div class="hasil-box">
            <p>⭐ **Perkalian:** ${A} × ${B}</p>
            <p>⭐ **Penjumlahan Berulang:** ${penjumlahanTeks}</p>
            <p style="font-size: 1.5em; font-weight: bold; color: #2ecc71;">Total hasilnya adalah: ${total}!</p>
        </div>
    `;

    // Render Visualisasi (Keranjang & Cokelat)
    let htmlVisual = "";
    for (let i = 0; i < A; i++) {
        htmlVisual += `
            <div class="keranjang" style="animation: popIn 0.5s ease-out both; animation-delay: ${i * 0.1}s;">
                <span style="display:block; font-weight:bold; color:#d35400;">🧺 Ke-${i + 1}</span>
                <div class="isi-cokelat" style="font-size: 1.2em;">
                    ${'🍫'.repeat(B)}
                </div>
                <span style="font-size:0.8em; color:#555;">(${B} cokelat)</span>
            </div>
        `;
    }
    visualContainer.innerHTML = htmlVisual;
    
    TextToSpeech(`Benar! ${A} keranjang dikali ${B} cokelat, sama dengan ${total}.`);
}

// ===========================================
// 5. FUNGSI LATIHAN SOAL
// ===========================================

function acakSoal(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function muatLatihanSoal() {
    acakSoal(dataSoal); // Acak urutan soal
    skor = 0;
    jawabanPengguna = [];

    const areaSoal = document.getElementById('area-soal');
    let htmlSoal = "";

    dataSoal.forEach((item, index) => {
        const nomor = index + 1;
        htmlSoal += `<div class="kartu-soal" id="soal-${nomor}">
            <p class="nomor-soal">Soal No. ${nomor} (${item.tipe.toUpperCase()})</p>
            <p class="teks-soal">${item.soal}</p>
        `;

        if (item.tipe === 'pg') {
            htmlSoal += `<div class="pilihan-ganda">`;
            item.pilihan.forEach(pilihan => {
                const idUnik = `pg-${nomor}-${pilihan.replace(/\s/g, '-')}`;
                htmlSoal += `
                    <label>
                        <input type="radio" name="jawaban-${nomor}" value="${pilihan}" id="${idUnik}">
                        ${pilihan}
                    </label>
                `;
            });
            htmlSoal += `</div>`;
        } else if (item.tipe === 'uraian') {
            htmlSoal += `<input type="text" name="jawaban-${nomor}" class="input-uraian" placeholder="Jawab di sini...">`;
        }

        htmlSoal += `</div>`;
    });

    htmlSoal += `
        <button class="tombol-aksi cek-jawaban" onclick="cekJawaban()">✅ Periksa Hasil Belajarku!</button>
        <div id="hasil-cek" class="hasil-cek"></div>
    `;

    areaSoal.innerHTML = htmlSoal;
}

function cekJawaban() {
    // Pastikan nama ada (double check)
    const inputNama = document.getElementById('input-nama');
    const nama = inputNama ? inputNama.value.trim() : '';
    if (!nama) {
        alert("🚨 Masukkan nama dulu di halaman utama!");
        tampilkanHalaman('halaman-menu');
        return;
    }
    namaSiswa = nama;

    skor = 0;
    jawabanPengguna = [];
    let semuaTerisi = true;

    dataSoal.forEach((item, index) => {
        const nomor = index + 1;
        let jawabanInput;
        let benar = false;

        if (item.tipe === 'pg') {
            const radioTerpilih = document.querySelector(`input[name="jawaban-${nomor}"]:checked`);
            jawabanInput = radioTerpilih ? radioTerpilih.value : '';
            if (jawabanInput && jawabanInput === item.jawaban) benar = true;
        } else if (item.tipe === 'uraian') {
            const inputTeks = document.querySelector(`input[name="jawaban-${nomor}"]`);
            jawabanInput = inputTeks ? inputTeks.value.trim() : '';
            // Validasi uraian (abaikan huruf besar/kecil)
            if (jawabanInput && jawabanInput.toLowerCase() === item.jawaban.toLowerCase()) benar = true;
        }

        if (!jawabanInput) semuaTerisi = false;
        if (benar) skor++;

        // Visual Feedback (Warna Hijau/Merah di soal)
        const kartuSoal = document.getElementById(`soal-${nomor}`);
        kartuSoal.classList.remove('benar', 'salah');
        if (jawabanInput) kartuSoal.classList.add(benar ? 'benar' : 'salah');
    });

    if (!semuaTerisi) {
        alert("🚨 Isi semua jawaban dulu ya sebelum periksa!");
        TextToSpeech("Isi semua jawaban dulu ya sebelum periksa!");
        return;
    }

    const totalSoal = dataSoal.length;
    const persentase = (skor / totalSoal) * 100;
    
    let pesan = persentase >= 80 ? "Hebat! Kamu Juara!" : (persentase >= 50 ? "Bagus! Terus berlatih!" : "Ayo semangat! Coba lagi ya!");
    
    // Tampilkan Hasil di Layar
    document.getElementById('hasil-cek').innerHTML = `
        <div class="rekap-skor">
            <p>Nama: <strong>${namaSiswa}</strong></p>
            <p>Benar: <strong>${skor}</strong> dari <strong>${totalSoal}</strong></p>
            <p>Nilai: <strong>${persentase.toFixed(0)}%</strong></p>
            <p class="pesan-motivasi">${pesan}</p>
        </div>
    `;
    TextToSpeech(`Skor kamu ${skor} dari ${totalSoal}. ${pesan}`);
    
    // Kirim Data ke Google Sheets
    const dataKirim = {
        Nama: namaSiswa,
        TotalSoal: totalSoal,
        SkorBenar: skor,
        Persentase: persentase.toFixed(1) + '%',
        Timestamp: new Date().toLocaleString('id-ID')
    };
    postToGoogleSheet(dataKirim);
}

// ===========================================
// 6. FUNGSI KIRIM KE GOOGLE SHEETS
// ===========================================

function postToGoogleSheet(data) {
    if (WEB_APP_URL.includes('GANTI_DENGAN_URL')) {
        console.warn("⚠️ URL Google Sheets belum disetting!");
        return;
    }

    fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(() => console.log('Data terkirim ke Spreadsheet'))
    .catch(error => console.error('Gagal kirim:', error));
}

// ===========================================
// 7. INISIALISASI (Saat Website Dibuka)
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // Pasang suara pada tombol
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            // Filter agar tombol simulasi/cek tidak bicara dobel
            if (!button.textContent.includes('Mulai') && !button.textContent.includes('Periksa')) {
                TextToSpeech(button.textContent.replace(/[^a-zA-Z0-9\s]/g, ''));
            }
        });
    });
    
    tampilkanHalaman('halaman-menu');
});
