# HTML PDF API

API untuk mengubah **HTML menjadi PDF** dengan berbagai jenis input:

- HTML text
- HTML file (`.html` / `.htm`)
- URL
- Base64 HTML
- ZIP berisi `html + css + image`

Project ini dibuat agar bisa berjalan di **Windows** maupun **Ubuntu/Linux**, dan cocok dipakai untuk integrasi otomatis seperti **n8n**, internal tools, ERP, invoicing, dan workflow dokumen.

---

## Fitur

- Konversi HTML ke PDF menggunakan **Playwright + Chromium**
- Mendukung input dari string HTML langsung
- Mendukung input dari file HTML
- Mendukung input dari URL
- Mendukung input dari Base64 HTML
- Mendukung input dari file ZIP yang berisi asset lengkap
- Struktur project modular dan mudah dikembangkan
- Kompatibel untuk development di Windows dan deployment di Ubuntu/Linux
- Cocok dipanggil dari **n8n** atau service lain melalui HTTP API

---

## Tech Stack

- **Node.js**
- **Express.js**
- **Playwright**
- **Chromium**
- **Multer** untuk upload file
- **unzipper** untuk ekstraksi ZIP
- **fs-extra** untuk file handling

---

## Struktur Project

```text
html-pdf-api/
├─ src/
│  ├─ app.js
│  ├─ server.js
│  ├─ routes/
│  │  └─ pdf.routes.js
│  ├─ controllers/
│  │  └─ pdf.controller.js
│  ├─ services/
│  │  ├─ pdf.service.js
│  │  ├─ input.service.js
│  │  ├─ render.service.js
│  │  ├─ zip.service.js
│  │  └─ cleanup.service.js
│  ├─ middleware/
│  │  ├─ upload.middleware.js
│  │  └─ error.middleware.js
│  ├─ utils/
│  │  ├─ paths.js
│  │  ├─ response.js
│  │  └─ file.js
│  ├─ validators/
│  │  └─ pdf.validator.js
│  └─ config/
│     └─ env.js
├─ storage/
│  ├─ tmp/
│  ├─ extracted/
│  └─ output/
├─ test-files/
├─ .env
├─ .env.example
├─ .gitignore
└─ package.json
```

---

## Cara Kerja Singkat

Semua input akan dinormalisasi menjadi salah satu sumber render berikut:

- HTML string → dirender langsung oleh Playwright
- URL → dibuka oleh Playwright lalu di-export ke PDF
- HTML file → dibuka sebagai file lokal
- ZIP → diekstrak, dicari file HTML utama, lalu dirender sebagai file lokal

Output PDF akan disimpan ke folder:

```text
storage/output/
```

---

## Persyaratan

- Node.js 18+ disarankan
- npm
- Playwright Chromium browser

---

## Instalasi

### 1. Clone repository

```bash
git clone https://github.com/username/html-pdf-api.git
cd html-pdf-api
```

### 2. Install dependency

```bash
npm install
```

### 3. Install browser Playwright

```bash
npx playwright install chromium
```

### 4. Copy environment file

#### Windows CMD

```bat
copy .env.example .env
```

#### PowerShell / Linux / macOS

```bash
cp .env.example .env
```

### 5. Jalankan server

```bash
npm run dev
```

Server akan aktif di:

```text
http://localhost:3000
```

---

## Instalasi di Ubuntu / Linux

Selain langkah normal di atas, biasanya perlu dependency sistem untuk Chromium.

Jalankan:

```bash
npx playwright install chromium
npx playwright install-deps
```

Catatan:

- `install-deps` hanya diperlukan di Linux
- pastikan user yang menjalankan app punya permission tulis ke folder `storage/`

---

## Environment Variables

Contoh `.env.example`:

```env
PORT=3000
APP_NAME=html-pdf-api
NODE_ENV=development
MAX_FILE_SIZE_MB=50
TEMP_DIR=storage/tmp
EXTRACT_DIR=storage/extracted
OUTPUT_DIR=storage/output
```

---

## Endpoint

### Health Check

```http
GET /health
```

Contoh response:

```json
{
  "success": true,
  "message": "API is running"
}
```

---

### Generate PDF

```http
POST /api/pdf/generate
```

API ini hanya menerima **satu jenis input per request**:

- `html`
- `html_base64`
- `url`
- `html_file`
- `zip_file`

Jika mengirim lebih dari satu jenis input sekaligus, request akan ditolak.

---

## Contoh Penggunaan

### 1. HTML text

```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{"html":"<html><body><h1>Hello</h1></body></html>"}'
```

#### Windows CMD

Karena CMD sensitif dengan karakter `<` dan `>`, lebih aman pakai file JSON.

Buat `test-files/sample.json`:

```json
{
  "html": "<html><body><h1>Hello</h1></body></html>"
}
```

Lalu jalankan:

```bat
curl.exe -X POST http://localhost:3000/api/pdf/generate -H "Content-Type: application/json" --data-binary @test-files/sample.json
```

---

### 2. Base64 HTML

```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{"html_base64":"PGh0bWw+PGJvZHk+PGgxPkhlbGxvPC9oMT48L2JvZHk+PC9odG1sPg=="}'
```

---

### 3. URL

```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

---

### 4. HTML file upload

```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -F "html_file=@test-files/sample.html"
```

#### Windows CMD

```bat
curl.exe -X POST http://localhost:3000/api/pdf/generate -F "html_file=@test-files/sample.html"
```

---

### 5. ZIP file upload

```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -F "zip_file=@test-files/sample.zip"
```

#### Windows CMD

```bat
curl.exe -X POST http://localhost:3000/api/pdf/generate -F "zip_file=@D:\Documents\TEONE\dokumen\html.zip"
```

---

## Contoh Response Sukses

```json
{
  "success": true,
  "message": "PDF berhasil dibuat",
  "data": {
    "input_type": "html",
    "file_name": "5d21e451-17db-47da-916f-7bb0606a7193.pdf",
    "file_path": "D:\\Documents\\TEONE\\API html to pdf\\storage\\output\\5d21e451-17db-47da-916f-7bb0606a7193.pdf"
  }
}
```

---

## Format ZIP yang Direkomendasikan

Agar asset seperti CSS dan gambar ikut terbaca, susun ZIP seperti ini:

```text
sample.zip
├─ index.html
├─ style.css
└─ images/
   └─ logo.png
```

Contoh `index.html`:

```html
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>ZIP HTML Test</h1>
  <img src="images/logo.png" width="120">
</body>
</html>
```

Catatan penting:

- gunakan path relatif seperti `style.css` atau `images/logo.png`
- hindari path absolut lokal
- paling aman gunakan `index.html` sebagai file utama

---

## Integrasi dengan n8n

API ini cocok dipanggil lewat **n8n** menggunakan node seperti:

- **HTTP Request** untuk kirim JSON atau multipart form
- **Read Binary File** untuk upload `.html` atau `.zip`
- **Move Binary Data** bila perlu transform file/binary

Use case yang cocok:

- generate invoice PDF otomatis
- generate dokumen dari HTML template
- convert halaman internal jadi PDF
- workflow approval dokumen
- kirim PDF otomatis ke email, WhatsApp, Drive, S3, dan lainnya

Saran untuk integrasi n8n:

- tambahkan API key / bearer token sebelum production
- pertimbangkan response PDF langsung sebagai binary untuk memudahkan workflow
- tambahkan cleanup file sementara bila beban tinggi

---

## Kompatibilitas Windows dan Ubuntu/Linux

Project ini dirancang agar kompatibel lintas OS dengan pendekatan berikut:

- menggunakan `path.join()` untuk path handling
- tidak hardcode separator path Windows/Linux
- menggunakan Playwright yang mendukung Windows dan Linux
- folder storage dibuat otomatis saat server start

Yang perlu diperhatikan di Ubuntu:

- install dependency sistem Chromium
- permission tulis ke folder `storage/`
- ketersediaan font bila PDF harus konsisten dengan Windows

---

## Troubleshooting

### 1. `Invalid package.json`

Pastikan `package.json` berisi JSON yang valid dan tidak kosong.

### 2. `HTML render belum diimplementasikan`

Artinya file `render.service.js` masih placeholder dan belum diisi logic Playwright.

### 3. `curl` error di Windows CMD

Gunakan `curl.exe` dan lebih aman kirim JSON dari file:

```bat
curl.exe -X POST http://localhost:3000/api/pdf/generate -H "Content-Type: application/json" --data-binary @test-files/sample.json
```

### 4. ZIP berhasil upload tapi CSS/gambar tidak muncul

Pastikan:

- file utama HTML ada di dalam ZIP
- referensi asset memakai path relatif
- struktur ZIP benar
- render dari file lokal, bukan dari string HTML biasa

### 5. Playwright gagal di Ubuntu

Jalankan:

```bash
npx playwright install chromium
npx playwright install-deps
```

---

## Pengembangan Lanjutan yang Disarankan

Beberapa fitur yang sebaiknya ditambahkan sebelum production:

- endpoint download PDF
- response langsung file PDF
- API key / auth middleware
- cleanup otomatis untuk folder temp / extracted / output
- opsi PDF: `format`, `margin`, `orientation`, `scale`
- queue / concurrency control
- logging yang lebih detail
- Dockerfile untuk deployment konsisten
- rate limiting

---

## Roadmap

- [x] Support HTML text
- [x] Support Base64 HTML
- [x] Support URL
- [x] Support HTML file upload
- [x] Support ZIP upload
- [ ] Download endpoint
- [ ] Cleanup service
- [ ] Auth / API key
- [ ] PDF options
- [ ] Direct binary PDF response
- [ ] Docker support
- [ ] Queue support

---

## Kontribusi

Silakan fork repository ini dan buat pull request bila ingin menambahkan fitur atau perbaikan.

Jika ingin kontribusi, sebaiknya buat perubahan dalam struktur modular yang sudah ada agar codebase tetap rapi dan mudah dirawat.

---

## Lisensi


