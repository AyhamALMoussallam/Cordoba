# Cordoba frontend

React UI for **شركة قرطبة للصرافة والحوالات**.

## Separate processes

| What | Command | URL | Data |
|---|---|---|---|
| React UI only | `cd frontend` then `npm run dev` | http://localhost:5173 | **None** — layout only |
| Laravel + MySQL | Start Apache and MySQL in XAMPP | http://localhost/cordoba/ | **Real data** from phpMyAdmin |

`npm run dev` does **not** start Laravel and does **not** load rates, branches, or FAQs.

## XAMPP (real site)

1. Start **Apache** and **MySQL** in XAMPP Control Panel (`C:\xampp2`).
2. Open http://localhost/cordoba/
3. Admin: http://localhost/cordoba/admin/login  
   `admin@cordobamt.com` / `Admin1234`
4. Database `cordoba` in http://localhost/phpmyadmin

## Build UI into XAMPP

```bash
cd frontend
npm run build
```
