# MANUAL BOOK: SISTEM PENJADWALAN PRODUKSI (BUILDING SCHEDULE APP)

---

## 1. PENDAHULUAN
### 1.1 Latar Belakang
Sistem Building Schedule App dirancang untuk mengelola dan memantau jadwal pembuatan ban (tire building) secara real-time. Sistem ini mengintegrasikan data dari PPC (Production Planning & Control) dan PPL (Production Planning & Logistics) untuk membantu tim produksi dalam mengatur urutan kerja pada setiap mesin secara efisien.

### 1.2 Tujuan
Tujuan dari sistem ini adalah untuk menyediakan visualisasi jadwal yang jelas, memungkinkan penyesuaian jadwal yang fleksibel (drag and drop), memantau stok material, serta melacak pencapaian produksi harian secara akurat untuk meminimalkan keterlambatan.

---

## 2. OTENTIKASI DAN HAK AKSES
### 2.1 Halaman Login
Akses ke fungsi penuh sistem memerlukan otentikasi. Pengguna harus memasukkan **Username** dan **Password**. Pengguna yang belum login atau masuk sebagai tamu akan diarahkan ke mode **Viewer**.

> **[TEMPATKAN SCREENSHOT HALAMAN LOGIN DI SINI]**

### 2.2 Level Pengguna (Roles)
Sistem memiliki struktur hak akses sebagai berikut:

1. **Viewer (Tanpa Login / Guest):**
   * Hanya dapat melihat Dashboard dan daftar jadwal.
   * Tidak memiliki akses ke menu administrasi atau pengaturan jadwal.
2. **Editor:**
   * Memiliki akses untuk membuat dan menyesuaikan jadwal harian (Adjust Schedule).
   * Memiliki keterbatasan dalam mengubah data stok awal (Balance Out) pada beberapa modul.
   * Tidak dapat mengakses menu manajemen user.
3. **Creator:**
   * Memiliki hak akses penuh untuk membuat data master produk, mesin, dan kategori.
   * Dapat mengatur jadwal dan sinkronisasi data PPC/PPL.
4. **Admin:**
   * Level tertinggi dengan kontrol penuh atas seluruh sistem.
   * Dapat mengelola pengguna (User Management), Role, dan konfigurasi sistem global.

---

## 3. DASHBOARD UTAMA
Dashboard adalah pusat informasi produksi real-time yang menyajikan data secara visual.

### 3.1 Konten Dashboard
Halaman dashboard terdiri dari beberapa elemen utama:
* **Filter Bar:** Memungkinkan pemilihan **Line (Kategori Produksi)** dan **Tanggal**. Terdapat tombol *Manual Refresh* untuk sinkronisasi data terbaru.
* **Machine Header:** Menampilkan nama mesin dan shift yang sedang aktif.
* **Tabel Jadwal (Schedule Table):** Detail teknis per ukuran ban meliputi Rim, Code, Cure/Shift, Mold, Stock, dan Prioritas.
* **Gantt Chart (Visual Timeline):** Representasi visual durasi pengerjaan di sisi kanan tabel.

> **[TEMPATKAN SCREENSHOT DASHBOARD PENUH DI SINI]**

### 3.2 Penjelasan Warna dan Grafik
Sistem menggunakan kode warna untuk membedakan fase dan status produksi:

#### **A. Warna Tabel per Shift**
* **Biru Muda (Shift 1):** Baris atau kolom yang aktif pada shift pagi.
* **Oranye Muda (Shift 2):** Baris atau kolom yang aktif pada shift sore.
* **Hijau Muda (Shift 3):** Baris atau kolom yang aktif pada shift malam.

#### **B. Warna Grafik Gantt Chart**
* <span style="color: #3b82f6">■</span> **Biru (Building):** Menunjukkan durasi proses perakitan ban (building).
* <span style="color: #fb923c">■</span> **Oranye (Curing):** Estimasi waktu proses pematangan (curing).
* <span style="color: #dc2626">■</span> **Merah (Shortage):** Indikasi adanya kekurangan material atau masalah stok.
* <span style="color: #6ee7b7">■</span> **Hijau (Achievement):** Menunjukkan target yang sudah tercapai (actual production).
* <span style="color: #fef08a">■</span> **Kuning/Merah Muda:** Area istirahat (Break Time) di dalam jadwal.

---

## 4. MODUL PENJADWALAN (SCHEDULES)
### 4.1 Adjust Schedule (Pembuatan Jadwal)
Modul paling kritikal untuk mengatur operasional harian.
* **Sinkronisasi PPC:** Data rencana awal ditarik dari sistem PPC berdasarkan tanggal dan line.
* **Drag & Drop:** Urutan prioritas (A, B, C...) dapat diubah dengan menggeser baris produk. Produk juga bisa dipindahkan antar mesin secara fleksibel.
* **Kalkulasi BO (Balance Out):** Sistem secara otomatis menghitung sisa target produksi jika ada perubahan quantity di salah satu shift.

> **[TEMPATKAN SCREENSHOT HALAMAN ADJUST SCHEDULE DI SINI]**

### 4.2 Schedule List
Menampilkan semua arsip jadwal yang telah dipublikasikan. Memudahkan pelacakan jadwal di masa lalu.

---

## 5. MODUL REFERENSI (PPC & PPL)
### 5.1 PPC List (Production Planning)
Menampilkan data rencana produksi mentah (raw data) yang akan diproses di menu Adjust Schedule. Data meliputi tanggal rencana, kode ukuran, mesin target, dan jumlah mold.

### 5.2 PPL List (Production Logistics)
Menampilkan data logistik terkait ketersediaan material ban. Data ini krusial untuk memastikan mesin tidak berhenti karena kekurangan bahan baku (Ready Material).

---

## 6. MASTER DATA (ADMINISTRASI)
Halaman ini hanya dapat diakses oleh Admin dan Creator.

### 6.1 Products & Product Restrictions
* **Products:** Daftar semua ukuran ban beserta spesifikasi waktu siklus (cycle time).
* **Restrictions:** Mengatur pembatasan ukuran tertentu pada mesin-mesin tertentu untuk mencegah kesalahan produksi.

### 6.2 Machines & Lines
* **Machines:** Pengelolaan data fisik mesin (ID Mesin, Tipe).
* **Lines/Categories:** Pengelompokan mesin ke dalam kategori tertentu (misalnya: PCR, LTR) dan pengaturan kode ban yang diizinkan di line tersebut.

### 6.3 Shifts & Config
* **Shifts:** Pengaturan jam mulai dan selesai setiap shift, termasuk jadwal jam istirahat (break).
* **Config:** Pengaturan parameter sistem seperti batas refresh otomatis dan toleransi waktu.

### 6.4 User & Role Management
* **User List:** Menambah atau mengedit akun karyawan (NIK, Nama, Role).
* **Role List:** Mengatur nama-nama jabatan/level akses di dalam sistem.

---

## 7. PANDUAN PENGGUNAAN (WORKFLOW)
### 7.1 Alur Pembuatan Jadwal (Untuk Editor/Admin)
1. Masuk ke menu **Schedules > Adjust Schedule**.
2. Pilih **Line** dan **Tanggal**.
3. Pastikan data PPC muncul. Gunakan **Drag & Drop** untuk menyesuaikan prioritas.
4. Periksa apakah stok material (Stock RC) mencukupi.
5. Klik **"Adjust Schedule"** untuk mengirim jadwal ke Dashboard.

### 7.2 Alur Pemantauan (Untuk Viewer/Supervisor)
1. Buka **Dashboard**.
2. Pilih Line produksi yang ingin dipantau.
3. Lihat grafik **Achievement (Hijau)** untuk membandingkan dengan rencana.
4. Periksa kolom **B.O** untuk melihat sisa target yang harus diselesaikan.

---
