import React from "react";
import { Navigate } from "react-router-dom";

// Fungsi untuk memeriksa apakah pengguna sudah login (ini contoh sederhana)
const isAuthenticated = () => {
  // Logika autentikasi sederhana: cek apakah token login disimpan di localStorage
  return localStorage.getItem("token") !== null;
};

function ProtectedRoute({ element }) {
  // Jika pengguna sudah login, tampilkan elemen yang diminta
  // Jika belum, arahkan ke halaman login
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
