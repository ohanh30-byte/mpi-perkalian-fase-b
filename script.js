// ===========================================
// 1. KONFIGURASI GOOGLE APPS SCRIPT
// GANTI DENGAN URL DEPLOYMENT WEB APP ANDA YANG BENAR
// ===========================================
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz_7C0IjjwAFUy9OuUutkXRPjWt3DX3ja_2Y4P9w9zXtnMSoYk4ySxPe7ryf5RqdsycFg/exec';

// Variabel Global
let namaSiswa = '';
let skor = 0;
let jawabanPengguna = []; 

// ===========================================
// 2. NAVIGASI HALAMAN & INPUT NAMA
// ===========================================

function tampilkanHalaman(idHalaman) {
    // Sembunyikan semua halaman
    document.querySelectorAll('.halaman').forEach(halaman => {
        halaman.classList.remove('aktif');
    });

    // Tampilkan halaman tujuan
    const halamanAktif = document.getElementById(idHalaman);
    if (halamanAktif) {
        halamanAktif.classList.add('aktif');
        // TTS Judul Halaman (Kecuali halaman depan)
        if (idHalaman !== 'halaman-depan') {
             const judul = halamanAktif.querySelector('h2').textContent;
             TextToSpeech(judul);
        }
    }
    
    // Jika masuk ke latihan, muat soal
    if (idHalaman === 'halaman-latihan') {
        muatLatihanSoal();
    }
}

// FUNGSI BARU: Validasi Nama di Halaman Depan
function masukAplikasi() {
    const inputNama = document.getElementById('input-nama');
    const nama = inputNama.value.trim();

    if (!nama) {
        alert("🚨 Eits, nama tidak boleh kosong! Tulis namamu dulu ya.");
        TextToSpeech("Eits, nama tidak boleh kosong! Tulis namamu dulu ya.");
        inputNama.focus();
        return;
    }

    // Simpan Nama
    namaSiswa = nama;
    
    // Update tampilan nama di Halaman Menu
    document.getElementById('tampilan-nama-siswa').textContent = namaSiswa;

    // Pindah ke Halaman Menu
    tampilkanHalaman('halaman-menu');
    TextToSpeech(`Halo ${namaSiswa}, selamat datang di menu utama!`);
}

function TextToSpeech(teks) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); 
        const utterance = new SpeechSynthesisUtterance(teks);
        utterance.lang = 'id-ID'; 
        utterance.rate = 1.0; 
        window.speechSynthesis.speak(utterance);
    }
}

// ===========================================
// 3. LOGIKA SIMULASI & SOAL (DATA LAMA TETAP SAMA)
// ===========================================

// --- DATA SOAL (10 PG + 5 URAIAN) ---
const dataSoal = [
    { tipe: 'pg', soal: "Bentuk penjumlahan berulang dari 3 × 5 adalah...", pilihan: ["3 + 5", "5 + 5 + 5", "3 + 3 + 3", "5 + 3"], jawaban: "5 + 5 + 5" },
    { tipe: 'pg', soal: "4 + 4 + 4 + 4 + 4 jika diubah ke bentuk perkalian menjadi...", pilihan: ["4 × 4", "5 × 4", "4 × 5", "5 + 4"], jawaban: "5 × 4" },
    { tipe: 'pg', soal: "2 piring, setiap piring isi 6 apel. Kalimat matematikanya...", pilihan: ["6 × 2", "2 + 6", "2 × 6", "6 + 2"], jawaban: "2 × 6" },
    { tipe: 'pg', soal: "Hasil dari 3 × 7 adalah...", pilihan: ["10", "14", "21", "24"], jawaban: "21" },
    { tipe: 'pg', soal: "Berapa kali angka 9 dijumlahkan jika 5 × 9?", pilihan: ["9 kali", "5 kali", "59 kali", "4 kali"], jawaban: "5 kali" },
    { tipe: 'pg', soal: "Jika 8 × 2, maka penjumlahan berulangnya...", pilihan: ["8 + 8", "2+2+2+2+2+2+2+2", "16", "8+2"], jawaban: "2+2+2+2+2+2+2+2" }, // Jawaban disesuaikan stringnya
    { tipe: 'pg', soal: "Perkalian yang benar untuk 6 + 6 adalah...", pilihan: ["6 × 6", "2 × 6", "6 × 2", "12"], jawaban: "2 × 6" },
    { tipe: 'pg', soal: "4 kotak, setiap kotak isi 5 pensil. Total?", pilihan: ["20", "9", "25", "15"], jawaban: "20" },
    { tipe: 'pg', soal: "Hasil 6 × 4 adalah...", pilihan: ["20", "24", "28", "30"], jawaban: "24" },
    { tipe: 'pg', soal: "Hasil 10 × 8 adalah...", pilihan: ["18", "80", "108", "81"], jawaban: "80" },
    { tipe: 'uraian', soal: "Tuliskan hasil dari 6 × 5!", jawaban: "30" },
    { tipe: 'uraian', soal: "Ada 3 kandang, setiap kandang 4 ayam. Total ayam?", jawaban: "12" },
    { tipe: 'uraian', soal: "Berapa hasil dari 9 × 5?", jawaban: "45" },
    { tipe: 'uraian', soal: "Jika 2 × A = 14, berapakah nilai A?", jawaban: "7" },
    { tipe: 'uraian', soal: "Berapa hasil dari 7 × 4?", jawaban: "28" }
];

// --- FUNGSI SIMULASI ---
function MulaiSimulasi() {
    let A = parseInt(document.getElementById('inputA').value);
    let B = parseInt(document.getElementById('inputB').value);
    const vis = document.getElementById('visualisasi-simulasi');
    const txt = document.getElementById('teks-perhitungan');

    if (isNaN(A) || isNaN(B) || A < 1 || B < 1 || A > 10 || B > 10) {
        vis.innerHTML = "<p style='color:red; font-weight:bold;'>⚠️ Angka harus 1 sampai 10 ya!</p>";
        txt.innerHTML = "";
        TextToSpeech("Angka harus satu sampai sepuluh ya.");
        return;
    }

    const total = A * B;
    let jumlahStr = [];
    for(let i=0; i<A; i++) jumlahStr.push(B);
    
    let htmlVisual = "";
    for (let i = 0; i < A; i++) {
        htmlVisual += `<div class="keranjang animate-pop"><span class="label-keranjang">🧺 ${i+1}</span><div class="isi-cokelat">${'🍫'.repeat(B)}</div></div>`;
    }
    
    vis.innerHTML = htmlVisual;
    txt.innerHTML = `<div class="hasil-box"><p>${A} × ${B}</p><p>${jumlahStr.join(" + ")}</p><p class="hasil-besar">Total: ${total}</p></div>`;
    TextToSpeech(`${A} kali ${B} sama dengan ${total}.`);
}

// --- FUNGSI LATIHAN ---
function muatLatihanSoal() {
    const area = document.getElementById('area-soal');
    area.innerHTML = "";
    skor = 0;
    
    // Acak Soal (Opsional)
    dataSoal.sort(() => Math.random() - 0.5);

    dataSoal.forEach((item, idx) => {
        let html = `<div class="kartu-soal" id="soal-${idx}"><p class="nomor-soal">Soal ${idx+1}</p><p class="teks-soal">${item.soal}</p>`;
        if (item.tipe === 'pg') {
            html += `<div class="pilihan-ganda">`;
            item.pilihan.forEach(pil => {
                html += `<label><input type="radio" name="jawaban-${idx}" value="${pil}"> ${pil}</label>`;
            });
            html += `</div>`;
        } else {
            html += `<input type="text" name="jawaban-${idx}" class="input-uraian" placeholder="Jawab...">`;
        }
        html += `</div>`;
        area.innerHTML += html;
    });

    area.innerHTML += `<button class="tombol-aksi cek-jawaban" onclick="cekJawaban()">✅ Periksa Jawaban</button><div id="hasil-cek" class="hasil-cek"></div>`;
}

function cekJawaban() {
    if (!namaSiswa) { alert("Nama hilang. Silakan masuk ulang."); tampilkanHalaman('halaman-depan'); return; }
    
    skor = 0;
    let total = dataSoal.length;
    let terisi = true;

    dataSoal.forEach((item, idx) => {
        let val = "";
        if (item.tipe === 'pg') {
            const el = document.querySelector(`input[name="jawaban-${idx}"]:checked`);
            if (el) val = el.value;
        } else {
            const el = document.querySelector(`input[name="jawaban-${idx}"]`);
            if (el) val = el.value.trim();
        }

        if (!val) terisi = false;
        
        // Logika Pengecekan (Sederhana)
        // Hapus spasi untuk membandingkan jawaban uraian/pg lebih aman
        let benar = false;
        if (val.replace(/\s/g,'').toLowerCase() === item.jawaban.replace(/\s/g,'').toLowerCase()) {
            benar = true;
            skor++;
        }

        // Visual Feedback
        const card = document.getElementById(`soal-${idx}`);
        card.classList.remove('benar', 'salah');
        if (val) card.classList.add(benar ? 'benar' : 'salah');
    });

    if (!terisi) { alert("Isi semua jawaban dulu ya!"); return; }

    let persen = ((skor/total)*100).toFixed(0);
    let pesan = persen >= 80 ? "Luar Biasa!" : "Tetap Semangat!";
    
    document.getElementById('hasil-cek').innerHTML = `
        <div class="rekap-skor">
            <p>Nama: <strong>${namaSiswa}</strong></p>
            <p>Skor: <strong>${skor}/${total}</strong> (${persen}%)</p>
            <p>${pesan}</p>
        </div>
    `;
    TextToSpeech(`Nilai kamu ${persen}. ${pesan}`);

    // KIRIM KE GOOGLE SHEETS
    postToGoogleSheet({
        Nama: namaSiswa,
        SkorBenar: skor,
        TotalSoal: total,
        Persentase: persen + "%",
        Timestamp: new Date().toLocaleString('id-ID')
    });
}

function postToGoogleSheet(data) {
    if (WEB_APP_URL.includes('GANTI')) { console.warn("URL Script belum dipasang!"); return; }
    
    fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(() => console.log("Terkirim")).catch(e => console.error(e));
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    tampilkanHalaman('halaman-depan');
});
