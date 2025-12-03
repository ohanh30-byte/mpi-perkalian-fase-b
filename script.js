// =================================================================
// KONFIGURASI GLOBAL
// =================================================================

// GANTI DENGAN URL GOOGLE APPS SCRIPT YANG SUDAH ANDA DEPLOY
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzZyYQ-MXdd-zLipP5Dq9Pd92kcjmhFrfcoYZAiJnuXWmMHlATgFS0MoIM0nWu1UEEi5A/exec'; 
let skorAkhirLatihan = 0;

// =================================================================
// 1. FUNGSI NAVIGASI & INIT
// =================================================================

function tampilkanHalaman(idHalaman) {
    document.querySelectorAll('.halaman').forEach(halaman => {
        halaman.classList.remove('aktif');
    });
    
    document.getElementById(idHalaman).classList.add('aktif');

    if (idHalaman === 'halaman-menu') {
        TextToSpeech("Selamat datang di MPI Perkalian Ceria. Silahkan pilih pintu petualanganmu!");
    } else if (idHalaman === 'halaman-latihan') {
        muatSoal();
        TextToSpeech("Kamu telah masuk ke Pintu Tantangan Soal. Kerjakan semua soal lalu klik tombol cek jawaban.");
    } else if (idHalaman === 'halaman-refleksi') {
        muatEfikasiKuesioner();
        TextToSpeech("Ini adalah halaman refleksi. Isi dengan jujur ya!");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    tampilkanHalaman('halaman-menu');
});


// =================================================================
// 2. FUNGSI TEXT-TO-SPEECH (TTS) DIGITAL
// =================================================================

function TextToSpeech(teks) {
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(teks);
        
        utterance.lang = 'id-ID'; 
        utterance.rate = 1.0;
        
        synth.speak(utterance);
    } else {
        console.warn("Browser Anda tidak mendukung Web Speech API (Text-to-Speech).");
    }
}


// =================================================================
// 3. FUNGSI SIMULASI KONKRET
// =================================================================

function MulaiSimulasi() {
    const A = parseInt(document.getElementById('inputA').value);
    const B = parseInt(document.getElementById('inputB').value);
    const visualisasiArea = document.getElementById('visualisasi-simulasi');
    const teksPerhitungan = document.getElementById('teks-perhitungan');
    let perhitunganBerulang = "";
    let totalHasil = 0;

    if (isNaN(A) || isNaN(B) || A < 1 || B < 1) {
        alert("Masukkan angka yang valid (minimal 1) untuk Keranjang dan Cokelat.");
        return;
    }
    
    visualisasiArea.innerHTML = '';
    
    let teksTTS = `Simulasi untuk ${A} dikali ${B}. Artinya, ${A} keranjang dengan masing-masing isi ${B} cokelat.`;
    TextToSpeech(teksTTS);

    for (let i = 0; i < A; i++) {
        const kotak = document.createElement('div');
        kotak.className = 'kotak';
        kotak.innerHTML = `🧺 **Keranjang ${i + 1}**`;

        for (let j = 0; j < B; j++) {
            const kelereng = document.createElement('div');
            kelereng.className = 'kelereng';
            kotak.appendChild(kelereng);
        }

        visualisasiArea.appendChild(kotak);
        
        totalHasil += B;
        if (i > 0) {
            perhitunganBerulang += " + ";
        }
        perhitunganBerulang += B;
    }

    teksPerhitungan.innerHTML = `${A} kali ${B} = ${perhitunganBerulang} = <span style="color:var(--warna-utama);">${totalHasil}</span>`;
    
    TextToSpeech(`Total hasilnya adalah ${totalHasil} cokelat. Selamat!`);
}


// =================================================================
// 4. DATA SOAL LENGKAP (20 PG + 10 URAIAN)
// =================================================================

const dataSoal = [
    // --- PG 1-20 ---
    { id: 1, tipe: 'PG', soal: "Bentuk penjumlahan berulang dari 6 x 3 adalah...", opsi: ["6+6+6", "3+3+3+3+3+3", "6+3", "3 x 6"], jawabanBenar: "3+3+3+3+3+3" },
    { id: 2, tipe: 'PG', soal: "2+2+2+2+2 jika diubah menjadi bentuk perkalian adalah...", opsi: ["2 x 5", "5 x 2", "2+5", "2 x 2 x 2 x 2 x 2"], jawabanBenar: "5 x 2" },
    { id: 3, tipe: 'PG', soal: "Hasil dari 7 x 0 adalah...", opsi: ["7", "1", "70", "0"], jawabanBenar: "0" },
    { id: 4, tipe: 'PG', soal: "Jika ada 5 kelompok, dan setiap kelompok berisi 4 siswa, maka total siswa dapat dihitung dengan...", opsi: ["5+4", "5 x 5", "4 x 4", "5 x 4"], jawabanBenar: "5 x 4" },
    { id: 5, tipe: 'PG', soal: "Perkalian bilangan dengan angka 1, seperti 9 x 1, hasilnya adalah...", opsi: ["1", "90", "19", "9"], jawabanBenar: "9" },
    { id: 6, tipe: 'PG', soal: "Hasil dari 8 x 5 adalah...", opsi: ["40", "35", "13", "85"], jawabanBenar: "40" },
    { id: 7, tipe: 'PG', soal: "Jika sebuah piring berisi 6 kue, dan ada 2 piring, maka total kue adalah...", opsi: ["2 x 6 = 10", "6+6=12", "2+6=8", "6 x 2 = 18"], jawabanBenar: "6+6=12" },
    { id: 8, tipe: 'PG', soal: "7 x 4 sama dengan...", opsi: ["24", "28", "32", "21"], jawabanBenar: "28" },
    { id: 9, tipe: 'PG', soal: "9 x 8 = 8 x n. Nilai n adalah...", opsi: ["8", "9", "17", "72"], jawabanBenar: "9" },
    { id: 10, tipe: 'PG', soal: "Sifat pertukaran (komutatif) yang benar adalah...", opsi: ["3 x 5 = 5+3", "3 x 5 = 3 x 3 x 3", "3 x 5 = 5 x 3", "3 x 5 = 5-3"], jawabanBenar: "3 x 5 = 5 x 3" },
    { id: 11, tipe: 'PG', soal: "Hasil dari 10 x 9 adalah...", opsi: ["19", "1", "90", "109"], jawabanBenar: "90" },
    { id: 12, tipe: 'PG', soal: "Jika A x 6 = 42. Maka nilai A adalah...", opsi: ["6", "7", "8", "4"], jawabanBenar: "7" },
    { id: 13, tipe: 'PG', soal: "Ayah memiliki 7 tumpukan buku. Setiap tumpukan berisi 11 buku. Total buku Ayah adalah...", opsi: ["18", "70", "77", "88"], jawabanBenar: "77" },
    { id: 14, tipe: 'PG', soal: "Paman memanen 4 keranjang mangga, masing-masing berisi 15 buah. Berapa total mangga?", opsi: ["19", "40", "60", "55"], jawabanBenar: "60" },
    { id: 15, tipe: 'PG', soal: "3 x 18 dapat dihitung dengan cara (3 x 10) + (3 x n). Nilai n yang tepat adalah...", opsi: ["3", "10", "8", "18"], jawabanBenar: "8" },
    { id: 16, tipe: 'PG', soal: "Santi membeli 5 bungkus permen. Setiap bungkus berisi 16 permen. Jika 20 permen dimakan adiknya, berapa sisa permen Santi?", opsi: ["80", "60", "75", "90"], jawabanBenar: "60" },
    { id: 17, tipe: 'PG', soal: "Sebuah bus dapat mengangkut 12 penumpang. Jika ada 8 bus yang terisi penuh, berapa total penumpang?", opsi: ["20", "86", "96", "84"], jawabanBenar: "96" },
    { id: 18, tipe: 'PG', soal: "Hitunglah 4 x 23 menggunakan sifat distributif.", opsi: ["40+23", "4+20+3", "80+12", "4 x 2 x 3"], jawabanBenar: "80+12" },
    { id: 19, tipe: 'PG', soal: "Harga satu pensil adalah Rp. 900. Jika Rina membeli 10 pensil, berapa total uang yang harus ia bayar?", opsi: ["Rp. 9.000", "Rp. 900", "Rp. 1.000", "Rp. 9.900"], jawabanBenar: "Rp. 9.000" },
    { id: 20, tipe: 'PG', soal: "Jumlah kaki dari 15 ekor ayam adalah... (Petunjuk: Ayam memiliki 2 kaki)", opsi: ["17", "30", "15", "45"], jawabanBenar: "30" },
    // --- Uraian 21-30 ---
    { id: 21, tipe: 'Uraian', soal: "Tuliskan bentuk perkalian dari 12 + 12 + 12 + 12 + 12.", jawabanBenar: "5 x 12" },
    { id: 22, tipe: 'Uraian', soal: "Lengkapi: 9 x 5 = ...", jawabanBenar: "45" },
    { id: 23, tipe: 'Uraian', soal: "Tuliskan hasil dari 10 x 6.", jawabanBenar: "60" },
    { id: 24, tipe: 'Uraian', soal: "Hitung hasil dari 6 x 14 dengan cara memisahkan angka puluhan dan satuan.", jawabanBenar: "84" },
    { id: 25, tipe: 'Uraian', soal: "Pak Hari membeli 9 bungkus roti. Setiap bungkus berisi 10 roti. Berapa total roti Pak Hari?", jawabanBenar: "90" },
    { id: 26, tipe: 'Uraian', soal: "Tuliskan bilangan yang hilang: 7 x ... = 49.", jawabanBenar: "7" },
    { id: 27, tipe: 'Uraian', soal: "Jika 13 ditambah berulang sebanyak 3 kali, berapa hasilnya? (Tulis angkanya saja)", jawabanBenar: "39" },
    { id: 28, tipe: 'Uraian', soal: "Ibu membuat 5 kantong kue, setiap kantong berisi 18 kue. Jika 10 kue diberikan kepada tetangga, berapa sisa kue Ibu?", jawabanBenar: "80" },
    { id: 29, tipe: 'Uraian', soal: "Di sebuah kolam, terdapat 6 ikan dan 4 katak. Berapa total kaki seluruh hewan di kolam itu? (Petunjuk: Ikan 0 kaki, Katak 4 kaki)", jawabanBenar: "16" },
    { id: 30, tipe: 'Uraian', soal: "Ani memiliki 2 kotak pensil. Kotak pertama berisi 15 pensil. Kotak kedua berisi 14 pensil. Tuliskan total pensil Ani dalam bentuk perkalian, jika jumlah pensil di kedua kotak dibuat sama (rata-rata) dan dikalikan 2. (Tuliskan perkaliannya saja)", jawabanBenar: "2 x 14.5" }
];


// =================================================================
// 5. FUNGSI MUAT SOAL & CEK JAWABAN
// =================================================================

function muatSoal() {
    const areaSoal = document.getElementById('area-soal');
    let htmlSoal = '<h3>✨ Bagian I: Pilihan Ganda (20 Soal)</h3>';

    // Looping untuk Pilihan Ganda
    dataSoal.filter(s => s.tipe === 'PG').forEach((soal, index) => {
        const opsiHuruf = ['A', 'B', 'C', 'D'];
        htmlSoal += `
            <div class="soal-box">
                <p><strong>${index + 1}.</strong> ${soal.soal}</p>
                <div class="opsi-jawaban">
                    ${soal.opsi.map((opsi, i) => `
                        <label>
                            <input type="radio" name="pg-soal-${soal.id}" value="${opsi}">
                            ${opsiHuruf[i]}. ${opsi}
                        </label>
                    `).join('<br>')}
                </div>
            </div>
        `;
    });

    htmlSoal += '<h3>🌟 Bagian II: Uraian Singkat (10 Soal)</h3>';

    // Looping untuk Uraian Singkat
    dataSoal.filter(s => s.tipe === 'Uraian').forEach((soal, index) => {
        htmlSoal += `
            <div class="soal-box">
                <p><strong>${index + 1}.</strong> ${soal.soal}</p>
                <textarea id="uraian-soal-${soal.id}" rows="1" placeholder="Tulis jawabanmu di sini. Angka atau kata kunci." data-id="${soal.id}"></textarea>
            </div>
        `;
    });

    areaSoal.innerHTML = htmlSoal;
    
    // Tombol untuk cek jawaban
    areaSoal.innerHTML += '<button class="tombol-aksi" onclick="cekJawaban()">✅ Selesai! Cek Jawaban & Nilai Saya</button>';
}


function cekJawaban() {
    let skor = 0;
    const totalSoal = dataSoal.length;
    const nilaiPerSoal = 100 / totalSoal; 

    // Cek Pilihan Ganda
    dataSoal.filter(s => s.tipe === 'PG').forEach(soal => {
        const inputName = `pg-soal-${soal.id}`;
        const jawabanSiswavalue = document.querySelector(`input[name="${inputName}"]:checked`)?.value;

        if (jawabanSiswavalue === soal.jawabanBenar) {
            skor += nilaiPerSoal;
        }
    });

    // Cek Uraian Singkat
    dataSoal.filter(s => s.tipe === 'Uraian').forEach(soal => {
        const inputId = `uraian-soal-${soal.id}`;
        const jawabanSiswavalue = document.getElementById(inputId)?.value.trim();

        // Normalisasi jawaban (case-insensitive, hapus spasi berlebih)
        const jawabanBenarNormalized = soal.jawabanBenar.toLowerCase().replace(/\s/g, '');
        const jawabanSiswaNormalized = jawabanSiswavalue ? jawabanSiswavalue.toLowerCase().replace(/\s/g, '') : '';
        
        if (jawabanSiswaNormalized === jawabanBenarNormalized) {
            skor += nilaiPerSoal;
        }
    });

    skorAkhirLatihan = Math.round(skor);

    let pesan;
    if (skorAkhirLatihan >= 80) {
        pesan = `Hebat! Nilai kamu adalah ${skorAkhirLatihan}. Kamu sudah menguasai konsep perkalian! 🎉`;
    } else if (skorAkhirLatihan >= 60) {
        pesan = `Bagus! Nilai kamu adalah ${skorAkhirLatihan}. Ada beberapa bagian yang perlu kamu pelajari lagi. 👍`;
    } else {
        pesan = `Ayo semangat! Nilai kamu adalah ${skorAkhirLatihan}. Jangan patah semangat dan coba ulangi materi dan latihan. 🧐`;
    }

    alert(pesan);
    TextToSpeech(pesan);
}


// =================================================================
// 6. EFIIKASI DIRI BANDURA & PENGIRIMAN DATA
// =================================================================

// Data Pertanyaan Efikasi Diri berdasarkan 4 Sumber Bandura (3 Pernyataan per Sumber)
const dataEfikasi = [
    // 1. Pengalaman Keberhasilan (Mastery Experience) - 3 Pernyataan
    { title: "Pengalaman Keberhasilan (Mastery Experience)", key: "mastery_1", question: "Saya yakin dapat menyelesaikan semua jenis soal perkalian jika sudah mempelajarinya." },
    { title: "Pengalaman Keberhasilan (Mastery Experience)", key: "mastery_2", question: "Saya merasa puas karena hasil latihan saya menunjukkan peningkatan kemampuan dalam perkalian." },
    { title: "Pengalaman Keberhasilan (Mastery Experience)", key: "mastery_3", question: "Saya dapat dengan mudah mengingat langkah-langkah untuk menghitung perkalian dua digit." },

    // 2. Pengalaman Perwakilan (Vicarious Experience / Modeling) - 3 Pernyataan
    { title: "Pengalaman Perwakilan (Modeling)", key: "vicarious_1", question: "Melihat teman yang dulunya kesulitan sekarang menguasai perkalian membuat saya yakin saya juga bisa." },
    { title: "Pengalaman Perwakilan (Modeling)", key: "vicarious_2", question: "Contoh kasus (video/animasi) tentang perkalian membantu saya memahami cara menyelesaikan masalah yang serupa." },
    { title: "Pengalaman Perwakilan (Modeling)", key: "vicarious_3", question: "Saya percaya saya akan mendapat nilai bagus dalam perkalian karena banyak teman saya juga bisa melakukannya." },

    // 3. Dukungan Verbal (Social Persuasion) - 3 Pernyataan
    { title: "Dukungan Verbal (Social Persuasion)", key: "persuasion_1", question: "Saya merasa lebih percaya diri dalam perkalian setelah mendapat pujian atau dukungan dari guru." },
    { title: "Dukungan Verbal (Social Persuasion)", key: "persuasion_2", question: "Dorongan dari orang tua atau orang terdekat membuat saya tidak takut mencoba soal-soal sulit." },
    { title: "Dukungan Verbal (Social Persuasion)", key: "persuasion_3", question: "Saya yakin bisa mencapai target nilai saya karena orang-orang di sekitar saya percaya pada kemampuan saya." },

    // 4. Kondisi Emosional (Physiological State) - 3 Pernyataan
    { title: "Kondisi Emosional (Physiological State)", key: "physiological_1", question: "Saat mengerjakan soal perkalian, saya merasa rileks dan tidak panik." },
    { title: "Kondisi Emosional (Physiological State)", key: "physiological_2", question: "Saya bisa fokus penuh pada soal tanpa diganggu oleh rasa cemas atau takut gagal." },
    { title: "Kondisi Emosional (Physiological State)", key: "physiological_3", question: "Detak jantung saya normal dan tangan saya tidak berkeringat saat dihadapkan pada soal hitungan yang rumit." }
];

// Fungsi Pembantu untuk membuat HTML Skala Efikasi
function buatSkalaEfikasi(name) {
    let html = '';
    const labels = ["1 (Tidak Yakin)", "2", "3", "4", "5 (Sangat Yakin)"];
    for (let i = 1; i <= 5; i++) {
        html += `<label><input type="radio" name="${name}" value="${i}" required> ${labels[i-1]}</label>`;
    }
    return html;
}

function muatEfikasiKuesioner() {
    const areaEfikasi = document.getElementById('area-efikasi');
    let htmlEfikasi = '';
    let currentTitle = '';
    let indexSoal = 0; // Menghitung nomor urut soal secara global

    dataEfikasi.forEach((item) => {
        indexSoal++;
        
        // Hanya tampilkan judul/header Sumber Efikasi jika berbeda dari sebelumnya
        if (item.title !== currentTitle) {
            htmlEfikasi += `<h3>${item.title}</h3>`;
            currentTitle = item.title;
        }

        htmlEfikasi += `
            <div class="soal-efikasi">
                <p><strong>${indexSoal}.</strong> ${item.question}</p>
                <div class="efikasi-skala">
                    ${buatSkalaEfikasi(item.key)}
                </div>
            </div>
        `;
    });
    areaEfikasi.innerHTML = htmlEfikasi;
}


// Event Listener untuk Form Pengiriman Data
document.getElementById('form-refleksi').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('timestamp').value = new Date().toISOString();
    
    if (WEB_APP_URL === 'GANTI_DENGAN_URL_DEPLOYED_ANDA') {
        alert("🚨 Gagal Kirim Data: Harap ganti variabel WEB_APP_URL di script.js dengan URL Google Apps Script Anda!");
        return;
    }

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Tambahkan skor akhir latihan
    data.skor_latihan = skorAkhirLatihan; 

    postToGoogleSheet(data);
    
    alert("Terima kasih, data refleksi dan efikasi diri Anda telah disimpan!");
    tampilkanHalaman('halaman-menu');
});


function postToGoogleSheet(data) {
    fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        // Karena mode 'no-cors', log ini hanya menunjukkan Fetch berhasil, 
        // bukan status HTTP server.
        console.log('Data dikirim ke Google Sheets. Cek sheet Anda.', response);
    })
    .catch(error => {
        console.error('Error saat mengirim data:', error);
        alert("Gagal menyimpan data refleksi ke server. Cek koneksi atau URL Apps Script.");
    });
}
