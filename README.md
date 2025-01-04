# Absen Karyawan App

<img width="1710" alt="Screenshot 2025-01-04 at 16 57 48" src="https://github.com/user-attachments/assets/59a760af-ce67-48a4-af25-c177ae0deb87" />

<br>
<br>

## Dokumentasi API

Semua endpoint menggunakan Base URL: ```http://localhost/8000```

### Karyawan

| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| GET | /karyawan | Mendapatkan data semua karyawan |
| GET | /karyawan/:id | Mendapatkan data karyawan berdasarkan id |
| POST | /karyawan | Menambahkan data karyawan |
| PUT | /karyawan/:id | Mengubah data karyawan berdasarkan id |
| DELETE | /karyawan/:id | Menghapus data karyawan berdasarkan id |

<br>

### Admin

| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| GET | /admin | Mendapatkan data semua admin |
| GET | /admin/:id | Mendapatkan data admin berdasarkan id |
| POST | /admin | Menambahkan data admin |
| PUT | /admin/:id | Mengubah data admin berdasarkan id |
| DELETE | /admin/:id | Menghapus data admin berdasarkan id |

<br>

### Absensi

| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| GET | /absen | Mendapatkan data semua absensi |
| GET | /absen/:id | Mendapatkan data absensi berdasarkan id |
| POST | /absen/checkin/:id | Menambahkan data absensi melalui checkin |
| POST | /absen/checkout/:id | Melakukan checkout data absensi |
| PUT | /absen/:id | Mengubah data absensi berdasarkan id |
| DELETE | /absen/:id | Menghapus data absensi berdasarkan id |

